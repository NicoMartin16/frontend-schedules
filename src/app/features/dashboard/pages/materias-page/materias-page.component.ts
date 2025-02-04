import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ModalAddSubjectComponent } from "../../components/modal-add-subject/modal-add-subject.component";
import { DatatableComponent } from "../../components/datatable/datatable.component";
import { CourseContractService } from '../../services/course-contract.service';
import { Sobject } from '../../models/subject.model';

@Component({
  selector: 'app-materias-page',
  standalone: true,
  imports: [ModalAddSubjectComponent, DatatableComponent],
  templateUrl: './materias-page.component.html',
  styleUrls: ['./materias-page.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MateriasPageComponent implements OnInit {
  isModalOpen = false;
  coursesList = signal<Sobject[]>([]);

constructor (
    private readonly courseContract: CourseContractService
  ) {}

  async ngOnInit(): Promise<void> {
    this.coursesList.set(await this.courseContract.listAllCourses());
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
