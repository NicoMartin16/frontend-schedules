import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { StudentContractService } from '../../services/student-contract.service';
import { Sobject } from '../../../dashboard/models/subject.model';

@Component({
  selector: 'app-student-page',
  standalone: true,
  imports: [],
  templateUrl: './student-page.component.html',
  styleUrl: './student-page.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentPageComponent implements OnInit {

  public schedules = signal<Sobject[]>([]);

  constructor(
    private readonly studentsContractService: StudentContractService
  ) {}

  async ngOnInit(): Promise<void> {
    this.schedules.set(await this.studentsContractService.getStudentCourses());
    console.log(this.schedules());
  }

}
