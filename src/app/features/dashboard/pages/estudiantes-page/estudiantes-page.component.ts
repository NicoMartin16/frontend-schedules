import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-estudiantes-page',
  standalone: true,
  imports: [],
  templateUrl: './estudiantes-page.component.html',
  styleUrl: './estudiantes-page.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstudiantesPageComponent {

}
