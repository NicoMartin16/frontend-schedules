import { Injectable } from '@angular/core';
import { ViemService } from '../../../core/services/viem.service';
import { getContract } from 'viem';
import { environment } from '../../../../environments/environment.development';
import { courseContractAbi } from '../models/course-contract.abi';
import { EventCourse } from '../models/event-course.type';
import { Sobject } from '../models/subject.model';



@Injectable({
  providedIn: 'root'
})
export class CourseContractService {

  public courseContract;

  constructor(
    private readonly _viemService: ViemService,
  ) {
    this.courseContract = getContract({
      address: `0x${environment.contractAddres}`,
      abi: courseContractAbi,
      client: {
        public: this._viemService.publicClient,
        wallet: this._viemService.walletClient
      },
    });
  }

  public async createCourse(name: string, credits: number, description: string) {
    const account = await this._viemService.getAddress();
    const [address] = account;
    await this.courseContract.write.createCourse([name, description, BigInt(credits)], { 
      account: address,
      chain: environment.chain,
    });
    
  }

  public async listAllCourses(): Promise<Sobject[]> {
    const courses = await this.courseContract.read.listCourses();
    const coursesList: Promise<Sobject[]> = Promise.all(courses.map(async (course) => {
      let subject = await this.courseContract.read.getCourse([course]);
      return {
        id: subject[0],
        name: subject[1],
        description: subject[2],
        credits: subject[3],
      }
    }));

    return coursesList;
  }

  public async deleteCourse(idCourse: bigint): Promise<void> {
    const account = await this._viemService.getAddress();
    const [address] = account;
    await this.courseContract.write.deleteCourse([idCourse], {
      account: address,
      chain: environment.chain,
    })
  }

  public async getCourseById(idCourse: bigint): Promise<Sobject> {
    const course = await this.courseContract.read.getCourse([idCourse]);
    return {
      id: course[0],
      name: course[1],
      description: course[2],
      credits: course[3],
    }
  }

  public async updateCourse(idCourse: bigint, name: string, credits: number, description: string): Promise<void> {
    const account = await this._viemService.getAddress();
    const [address] = account;
    await this.courseContract.write.updateCourse([idCourse, name, description, BigInt(credits)], {
      account: address,
      chain: environment.chain,
    });
  }
  
  public getEventsFromBlockchain(eventName: EventCourse): Promise<any> {
    return new Promise((resolve, reject) => {
      const unwatch = this._viemService.publicClient.watchContractEvent({
        address: `0x${environment.contractAddres}`,
        abi: courseContractAbi,
        eventName,
        onLogs: logs => {
          console.log(logs);
          resolve(logs);
          unwatch();
        },
        onError: error => {
          reject(error);
          unwatch();
        }
      });
    });
  }

}
