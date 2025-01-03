import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { Sobject } from '../../models/subject.model';
import { CourseContractService } from '../../services/course-contract.service';
import { ModalEditSubjectComponent } from "../modal-edit-subject/modal-edit-subject.component";

@Component({
  selector: 'app-datatable',
  standalone: true,
  imports: [ModalEditSubjectComponent],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatatableComponent {
 
  public coursesList = input<Sobject[]>([]);
  public courseId = signal<bigint>(0n);
  public isModalEditOpen = signal<boolean>(false);

  constructor(
    private readonly courseContractService: CourseContractService
  ) { }

  async deleteCourse(idCourse: bigint) {
    console.log(idCourse);
    await this.courseContractService.deleteCourse(idCourse);
    const log = await this.courseContractService.getEventsFromBlockchain('CourseDeleted');
    console.log(log);
  }

  async editCourse(idCourse: bigint) {
    this.isModalEditOpen.set(true);
    this.courseId.set(idCourse);
  }

}
