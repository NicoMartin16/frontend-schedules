import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {

}
