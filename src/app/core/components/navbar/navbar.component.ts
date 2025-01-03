import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {

}
