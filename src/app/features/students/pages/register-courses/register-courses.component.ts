import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { StudentContractService } from '../../services/student-contract.service';
import { Schedule } from '../../../dashboard/models/schedule.model';
import { CourseContractService } from '../../../dashboard/services/course-contract.service';
import { Sobject } from '../../../dashboard/models/subject.model';

@Component({
  selector: 'app-register-courses',
  standalone: true,
  imports: [],
  templateUrl: './register-courses.component.html',
  styleUrl: './register-courses.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterCoursesComponent implements OnInit {

  schedules = signal<Schedule[]>([]);
  subjects = signal<Sobject[]>([]);

  constructor(
    private readonly studentContractService: StudentContractService,
    private readonly _courseContractService: CourseContractService
  ) {}

  async ngOnInit(): Promise<void> {
    
    this.schedules.set(await this.studentContractService.listAllSchedules());
    const courses = await this.getStudentCourses();
    console.log('schedules', this.schedules());
    console.log(courses);
  }

  public async registerStudentInCourse(schedule: Schedule): Promise<void> {
    this.subjects.set(await this._courseContractService.listAllCourses());
    const subject = this.subjects().find((subject) => subject.name === schedule?.courseName);
    console.log(subject);
    if(subject) {
      await this.studentContractService.registerStudentInCourse(subject.id);
      const logs = await this.studentContractService.getEventsFromBlockchain('StudentRegisteredInCourse');
      console.log(logs);
    }
  }

  public async getStudentCourses(): Promise<void> {
    const coursesStudent = await this.studentContractService.getStudentCourses();
    console.log(coursesStudent);
  }

  public transformNumberToHour(hour: number | undefined): string {
    const validHour = hour ?? 0;
    return validHour.toString().padStart(2, '0') + ':00';
  }

}
