import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseContractService } from '../../services/course-contract.service';
import { DAYS_WEEK, DAYS_WEEK_ARRAY } from '../../consts/days-week.const';
import { Sobject } from '../../models/subject.model';
import { SchedulesContractService } from '../../services/schedules-contract.service';
import { NewSchedule, Schedule } from '../../models/schedule.model';

@Component({
  selector: 'app-modal-add-schedule',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal-add-schedule.component.html',
  styleUrl: './modal-add-schedule.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalAddScheduleComponent {
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
    console.log(this.daysWeek);
    this.subjects.set(await this._courseContractService.listAllCourses());
  }

  public async closeModal(): Promise<void> {
    console.log(this.formSchedule.value);
    const { courseId, day, endHour, startHour } = this.formSchedule.value;
    if (courseId && day && endHour && startHour) {
      const transformedStartHour = this.transformHourToNumber(startHour);
      const transformedEndHour = this.transformHourToNumber(endHour);
      await this._scheduleContractService.addSchedule(
        +courseId,
        +day,
        transformedStartHour,
        transformedEndHour
      );

      const logs = await this._courseContractService.getEventsFromBlockchain(
        'ScheduleAdded'
      );
      if (logs) {
        console.log('Schedule created');
        this.showSuccess.set(true);
        setTimeout(() => {
          this.showSuccess.set(false);
          this.onCloseModal.emit();
        }, 5000);
      }
    } else {
      console.error('Form values are invalid');
    }
    this.onCloseModal.emit();
  }

  public transformHourToNumber = (hour: string): number =>
    hour.split(':').map(Number)[0];
}
