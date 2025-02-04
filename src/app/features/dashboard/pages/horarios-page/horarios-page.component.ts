import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DatatableComponent } from "../../components/datatable/datatable.component";
import { SchedulesContractService } from '../../services/schedules-contract.service';

@Component({
  selector: 'app-horarios-page',
  standalone: true,
  imports: [DatatableComponent],
  templateUrl: './horarios-page.component.html',
  styleUrl: './horarios-page.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HorariosPageComponent implements OnInit {

  constructor(private readonly scheduleContractService: SchedulesContractService) {
  }

  async ngOnInit(): Promise<void> {
    const schedules = await this.scheduleContractService.listAllSchedules();
    console.log(schedules);
  }

}
