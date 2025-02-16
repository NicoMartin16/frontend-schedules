import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  DAYS_WEEK,
  DAYS_WEEK_ARRAY,
  DAYS_WEEK_TYPE,
} from '../../consts/days-week.const';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sobject } from '../../models/subject.model';
import { CourseContractService } from '../../services/course-contract.service';
import { SchedulesContractService } from '../../services/schedules-contract.service';
import { Schedule } from '../../models/schedule.model';

@Component({
  selector: 'app-modal-edit-schedule',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal-edit-schedule.component.html',
  styleUrl: './modal-edit-schedule.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalEditScheduleComponent {
  public schedule = model<Schedule>();
  public showSuccess = signal<boolean>(false);
  public readonly onCloseModal = output();
  public daysWeek = DAYS_WEEK_ARRAY;
  public subjects = signal<Sobject[]>([]);
  public readonly formSchedule = this.formBuilder.group({
    courseId: ['', Validators.required],
    day: ['', Validators.required],
    startHour: ['', Validators.required],
    endHour: ['', Validators.required],
  });

  constructor(
    private readonly _courseContractService: CourseContractService,
    private readonly _scheduleContractService: SchedulesContractService,
    private readonly formBuilder: FormBuilder
  ) {}

  async ngOnInit() {
    console.log(this.schedule());
    this.subjects.set(await this._courseContractService.listAllCourses());
    const subject = this.subjects().find((subject) => subject.name === this.schedule()?.courseName);
    console.log(subject);
    if(subject) {
      this.formSchedule.patchValue({
        courseId: subject?.id.toString(),
        day: this.schedule()?.day.toString(),
        startHour: this.transformNumberToHour(this.schedule()?.startHour),
        endHour: this.transformNumberToHour(this.schedule()?.endHour),
      });

    }
    
  }

  public getDayName(dayNumber: DAYS_WEEK_TYPE | number): string {
    if (typeof dayNumber === 'number' && dayNumber in DAYS_WEEK) {
      return DAYS_WEEK[dayNumber as DAYS_WEEK_TYPE];
    }
    return 'Dia inválido';
  }

  

  public async closeModal(): Promise<void> {
    console.log(this.formSchedule.value);
    const { courseId, day, endHour, startHour } = this.formSchedule.value;
    if (courseId && day && endHour && startHour) {
      const transformedStartHour = this.transformHourToNumber(startHour);
      const transformedEndHour = this.transformHourToNumber(endHour);
      await this._scheduleContractService.updateSchedule(
        BigInt(courseId),
        BigInt(this.schedule()?.id ?? 0n),
        +day,
        transformedStartHour,
        transformedEndHour
      );

      const logs = await this._courseContractService.getEventsFromBlockchain(
        'ScheduleUpdated'
      );
      if (logs) {
        console.log('Schedule updated');
        this.showSuccess.set(true);
        setTimeout(() => {
          this.showSuccess.set(false);
          this.onCloseModal.emit();
        }, 3000);
      }
    } else {
      console.error('Form values are invalid');
    }
    this.onCloseModal.emit();
  }

  public transformHourToNumber = (hour: string): number =>
    hour.split(':').map(Number)[0];

  private transformNumberToHour(hour: number | undefined): string {
    const validHour = hour ?? 0;
    return validHour.toString().padStart(2, '0') + ':00';
  }
}
