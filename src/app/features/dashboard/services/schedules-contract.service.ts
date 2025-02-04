import { Injectable } from '@angular/core';
import { ViemService } from '../../../core/services/viem.service';
import { courseContractAbi } from '../models/course-contract.abi';
import { environment } from '../../../../environments/environment.development';
import { getContract } from 'viem';

@Injectable({
  providedIn: 'root',
})
export class SchedulesContractService {
  public scheduleContract;

  constructor(private readonly _viemService: ViemService) {
    this.scheduleContract = getContract({
      address: `0x${environment.contractAddres}`,
      abi: courseContractAbi,
      client: {
        public: this._viemService.publicClient,
        wallet: this._viemService.walletClient,
      },
    });
    console.log(this.scheduleContract);
  }

  public async createCourse(
    id: number,
    day: number,
    startHour: number,
    endHour: number
  ) {
    const account = await this._viemService.getAddress();
    const [address] = account;
    await this.scheduleContract.write.addSchedule(
      [BigInt(id), day, startHour, endHour],
      {
        account: address,
        chain: environment.chain,
      }
    );
  }

  public async addSchedule(id: number, day: number, startHour: number, endHour: number) {
    const account = await this._viemService.getAddress();
    const [address] = account;
    await this.scheduleContract.write.addSchedule([BigInt(id), day, startHour, endHour], {
      account: address,
      chain: environment.chain,
    });
  }

  public async listAllSchedules(): Promise<any[]> {
    const schedules = await this.scheduleContract.read.listAllSchedules();
    const schedulesList: Promise<any[]> = Promise.all(schedules.map(async (schedule) => {
      console.log(schedule);
    }))
    return schedulesList;
  }

  public async updateSchedule(idCourse: bigint, idSchedule: bigint, day: number, startHour: number, endHour: number) {
    const account = await this._viemService.getAddress();
    const [address] = account;
    await this.scheduleContract.write.updateSchedule([idCourse, idSchedule, day, startHour, endHour], {
      account: address,
      chain: environment.chain,
    });
  }

  public async getScheduleById(idCourse: bigint, idSchedule: bigint): Promise<any> {
    const schedule = await this.scheduleContract.read.getSchedule([idCourse, idSchedule]);
    return {
      
    }
  }
}
