import { Injectable } from '@angular/core';
import { ViemService } from '../../../core/services/viem.service';
import { getContract } from 'viem';
import { environment } from '../../../../environments/environment.development';
import { courseContractAbi } from '../../dashboard/models/course-contract.abi';
import { Schedule } from '../../dashboard/models/schedule.model';
import { EventCourse } from '../../dashboard/models/event-course.type';
import { Sobject } from '../../dashboard/models/subject.model';

@Injectable({
  providedIn: 'root'
})
export class StudentContractService {

  public scheduleContract!: any;

  constructor(
    private readonly _viemService: ViemService,
  ) {
    this.scheduleContract = getContract({
      address: `0x${environment.contractAddres}`,
      abi: courseContractAbi,
      client: {
        public: this._viemService.publicClient,
        wallet: this._viemService.walletClient,
      },
    });
  }

  public async listAllSchedules(): Promise<Schedule[]> {
    console.log(this.scheduleContract);
    const schedules: Schedule[] = await this.scheduleContract.read.listAllSchedules();
    return schedules;
  }

  public async registerStudentInCourse(courseId: bigint[]) {
    console.log(courseId);
    const account = await this._viemService.getAddress();
    const [address] = account;
    await this.scheduleContract.write.registerStudentInCourses([courseId], {
      account: address,
      chain: environment.chain,
    });
  }
  

  public async getStudentCourses(): Promise<Sobject[]> {
    const account = await this._viemService.getAddress();
    const [address] = account;
    const courses: BigInt[] = await this.scheduleContract.read.getStudentCourses([], {
      account: address,
      chain: environment.chain,
    });
    const coursesStudent: Promise<Sobject[]> = Promise.all(courses.map(async (course: BigInt) => {
      let subject = await this.scheduleContract.read.getCourse([course]);
      return {
        id: subject[0],
        name: subject[1],
        description: subject[2],
        credits: subject[3],
      }
    }
    ));
    return coursesStudent;
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
