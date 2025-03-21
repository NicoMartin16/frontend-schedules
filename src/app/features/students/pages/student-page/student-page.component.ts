import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-student-page',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  templateUrl: './student-page.component.html',
  styleUrl: './student-page.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentPageComponent {

}
