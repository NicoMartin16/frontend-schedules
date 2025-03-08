import { Injectable } from '@angular/core';
import { ViemService } from '../../../core/services/viem.service';
import { courseContractAbi } from '../models/course-contract.abi';
import { environment } from '../../../../environments/environment.development';
import { getContract } from 'viem';
import { Schedule } from '../models/schedule.model';

@Injectable({
  providedIn: 'root',
})
export class SchedulesContractService {
  public scheduleContract!: any;

  constructor(private readonly _viemService: ViemService) {
    this.init();
  }

  public async init(): Promise<void> {
    const connected = await this._viemService.connectWallet();
    if (connected) {
      this.scheduleContract = getContract({
        address: `0x${environment.contractAddres}`,
        abi: courseContractAbi,
        client: {
          public: this._viemService.publicClient,
          wallet: this._viemService.walletClient,
        },
      });
    } else {
      console.error('Failed to connect wallet');
    }
  }

  public async addSchedule(id: number, day: number, startHour: number, endHour: number) {
    const account = await this._viemService.getAddress();
    const [address] = account;
    await this.scheduleContract.write.addSchedule([BigInt(id), day, startHour, endHour], {
      account: address,
      chain: environment.chain,
    });
  }

  public async listAllSchedules(): Promise<Schedule[]> {
    const schedules: Schedule[] = [...await this.scheduleContract.read.listAllSchedules()];
    return schedules;
  }

  public async updateSchedule(idCourse: bigint, idSchedule: bigint, day: number, startHour: number, endHour: number) {
    const account = await this._viemService.getAddress();
    const [address] = account;
    await this.scheduleContract.write.updateSchedule([idCourse, idSchedule, day, startHour, endHour], {
      account: address,
      chain: environment.chain,
    });
  }

  public async deleteSchedule(idCourse: bigint, idSchedule: bigint) {
    const account = await this._viemService.getAddress();
    const [address] = account;
    await this.scheduleContract.write.deleteSchedule([idCourse, idSchedule], {
      account: address,
      chain: environment.chain,
    });
  }

  public async getSchedule(idCourse: bigint, idSchedule: bigint): Promise<Schedule> {
    const schedule = await this.scheduleContract.read.getSchedule([idCourse, idSchedule]);
    return {
      id: schedule[0],
      day: schedule[1],
      startHour: schedule[2],
      endHour: schedule[3],
      courseName: schedule[4],
      isActive: schedule[5],
    }
  }

  public async getScheduleById(idSchedule: bigint): Promise<Schedule> {
    const schedule = await this.scheduleContract.read.getScheduleById([idSchedule]);
    return {
      id: schedule[0],
      day: schedule[1],
      startHour: schedule[2],
      endHour: schedule[3],
      courseName: schedule[4],
      isActive: schedule[5],
    }
    
  }
}
