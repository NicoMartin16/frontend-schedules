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
  coursesToRegister = signal<Schedule[]>([]);
  subjectsToRegister = signal<Sobject[]>([]);

  constructor(
    private readonly studentContractService: StudentContractService,
    private readonly _courseContractService: CourseContractService
  ) {}

  async ngOnInit(): Promise<void> {
    
    this.schedules.set(await this.studentContractService.listAllSchedules());
    this.subjects.set(await this._courseContractService.listAllCourses());
    this.subjectsToRegister.set(await this.studentContractService.getStudentCourses());
  
  }

  public async registerStudentInCourse(schedule: Schedule): Promise<void> {
    const subject = this.subjects().find((subject) => subject.name === schedule?.courseName);
    this.coursesToRegister.set([...this.coursesToRegister(), schedule]);
    console.log(subject);
    if (subject) {
      this.subjectsToRegister.set([...this.subjectsToRegister(), subject]);
    }    
  }

  public async getStudentCourses(): Promise<void> {
    const coursesStudent = await this.studentContractService.getStudentCourses();
  }

  public transformNumberToHour(hour: number | undefined): string {
    const validHour = hour ?? 0;
    return validHour.toString().padStart(2, '0') + ':00';
  }

  totalCredits(): number {
    return this.subjectsToRegister().reduce((acc, subject) => acc + Number(subject.credits), 0);
    
  }

  async registerSchedule() {
    const idsCourses = this.subjectsToRegister().map((course) => course.id);
    await this.studentContractService.registerStudentInCourse(idsCourses);
    const logs = this.studentContractService.getEventsFromBlockchain('StudentRegisteredInCourse');
    console.log(logs);
  }

}
