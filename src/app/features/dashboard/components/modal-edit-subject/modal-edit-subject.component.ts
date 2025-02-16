import { ChangeDetectionStrategy, Component, input, model, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseContractService } from '../../services/course-contract.service';

@Component({
  selector: 'app-modal-edit-subject',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './modal-edit-subject.component.html',
  styleUrl: './modal-edit-subject.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalEditSubjectComponent {

  public showSuccess = signal<boolean>(false);
  public readonly onCloseModal = output();
  public readonly courseId = input<bigint>(0n);
  public readonly formCourse = this.formBuilder.group({
    name: ['', Validators.required],
    credits: ['', Validators.required],
    description: ['', Validators.required],
  });

  constructor(
    private readonly _courseContractService: CourseContractService,
    private readonly formBuilder: FormBuilder
  ) {}

  async ngOnInit() {
    const course = await this._courseContractService.getCourseById(this.courseId());
    this.formCourse.patchValue({
      name: course.name,
      credits: course.credits.toString(),
      description: course.description
    })
  }

  public async closeModal(): Promise<void> {
    const { name, credits, description } = this.formCourse.value;
    if (name && credits && description) {
      this._courseContractService.updateCourse(this.courseId(), name, +credits, description);
      const logs = await this._courseContractService.getEventsFromBlockchain(
        'CourseUpdated'
      );
      if (logs) {
        console.log('Course updated');
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
