import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Schedule } from '../../models/schedule.model';
import { DAYS_WEEK, DAYS_WEEK_TYPE } from '../../consts/days-week.const';
import { ModalEditSubjectComponent } from "../modal-edit-subject/modal-edit-subject.component";
import { ModalEditScheduleComponent } from "../modal-edit-schedule/modal-edit-schedule.component";

@Component({
  selector: 'app-schedules-table',
  standalone: true,
  imports: [ModalEditSubjectComponent, ModalEditScheduleComponent],
  templateUrl: './schedules-table.component.html',
  styleUrl: './schedules-table.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulesTableComponent {

  schedulesList = input<Schedule[]>([]);
  public isModalEditOpen = signal<boolean>(false);
  public onCloseModal = output();
  public schedule = signal<Schedule>({ id: 0n, day: 0, startHour: 0, endHour: 0, courseName: '', isActive: false });

  public getDayName(dayNumber: DAYS_WEEK_TYPE | number): string {
    if (typeof dayNumber === 'number' && dayNumber in DAYS_WEEK) {
      return DAYS_WEEK[dayNumber as DAYS_WEEK_TYPE];
    }
    return 'Dia inválido';
  }

  formatHour(hour: number): string {
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(0);
    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    return date.toLocaleTimeString([], options);
  }

  async editSchedule(schedule: Schedule) {
    this.isModalEditOpen.set(true);
    this.schedule.set(schedule);
  }

  async closeModalEdit() {
    this.isModalEditOpen.set(false);
    this.onCloseModal.emit();
  }

}
