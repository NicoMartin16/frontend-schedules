import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CourseContractService } from '../../services/course-contract.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-add-subject',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal-add-subject.component.html',
  styleUrl: './modal-add-subject.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalAddSubjectComponent implements OnInit {
  public showSuccess = signal<boolean>(false);
  public readonly onCloseModal = output();
  public readonly formCourse = this.formBuilder.group({
    name: ['', Validators.required],
    credits: ['', Validators.required],
    description: ['', Validators.required],
  });

  constructor(
    private readonly _courseContractService: CourseContractService,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit() {}

  public async closeModal(): Promise<void> {
    const { name, credits, description } = this.formCourse.value;
    if (name && credits && description) {
      this._courseContractService.createCourse(name, +credits, description);
      const logs = await this._courseContractService.getEventsFromBlockchain(
        'CourseCreated'
      );
      if (logs) {
        console.log('Course created');
        this.showSuccess.set(true);
        setTimeout(() => {
          this.showSuccess.set(false);
          this.onCloseModal.emit();
        }, 3000);
      }
    } else {
      console.error('Form values are invalid');
    }
    // this.onCloseModal.emit();
  }
}
