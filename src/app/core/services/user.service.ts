import { Injectable } from '@angular/core';
import { ViemService } from './viem.service';
import { Address, getContract } from 'viem';
import { environment } from '../../../environments/environment.development';
import { courseContractAbi } from '../../features/dashboard/models/course-contract.abi';
import { EventCourse } from '../../features/dashboard/models/event-course.type';
import { Role } from '../../features/dashboard/models/role.enum';
import { User } from '../../features/dashboard/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public courseContract!: any;

  constructor(
    private readonly viemService: ViemService,
  ) { 
    this.init();
  }

  private async init(): Promise<void> {
    const connected = await this.viemService.connectWallet();
    if (connected) {
      this.courseContract = getContract({
        address: `0x${environment.contractAddres}`,
        abi: courseContractAbi,
        client: {
          public: this.viemService.publicClient,
          wallet: this.viemService.walletClient
        },
      }); 
    } else {
      console.error('Failed to connect');
    }
  }

  public async registerUser(address: Address, rol: Role): Promise<void> {
    await this.courseContract.write.registerUser([address, rol], { 
      account: address,
      chain: environment.chain,
    });
  }

  public async isRegistered(address: Address): Promise<boolean> {
    return await this.courseContract.read.isRegistered([address]);
  }

  public async getUser(address: Address): Promise<User> {
    return await this.courseContract.read.getUser([address]);
  }

  public getEventsFromBlockchain(eventName: EventCourse): Promise<any> {
      return new Promise((resolve, reject) => {
        const unwatch = this.viemService.publicClient.watchContractEvent({
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
