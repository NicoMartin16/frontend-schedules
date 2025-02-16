import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { DatatableComponent } from "../../components/datatable/datatable.component";
import { SchedulesContractService } from '../../services/schedules-contract.service';
import { Schedule } from '../../models/schedule.model';
import { SchedulesTableComponent } from "../../components/schedules-table/schedules-table.component";
import { ModalAddScheduleComponent } from "../../components/modal-add-schedule/modal-add-schedule.component";

@Component({
  selector: 'app-horarios-page',
  standalone: true,
  imports: [DatatableComponent, SchedulesTableComponent, ModalAddScheduleComponent],
  templateUrl: './horarios-page.component.html',
  styleUrl: './horarios-page.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HorariosPageComponent implements OnInit {

  isModalOpen = false;

  schedulesList = signal<Schedule[]>([]);

  constructor(private readonly scheduleContractService: SchedulesContractService) {
  }

  async ngOnInit(): Promise<void> {
    this.schedulesList.set(await this.scheduleContractService.listAllSchedules());
    console.log(this.schedulesList());
    this.triggerAnimation();
  }

  openModal() {
    this.isModalOpen = true;
  }

  async closeModal(): Promise<void> {
    this.isModalOpen = false;
    this.schedulesList.set(await this.scheduleContractService.listAllSchedules());
    this.triggerAnimation();
  }

  triggerAnimation() {
    const tableRows = document.querySelectorAll('tr');
    tableRows.forEach(row => {
        row.classList.add('animate-pulse');
        setTimeout(() => row.classList.remove('animate-pulse'), 500);
    });
  }

}
