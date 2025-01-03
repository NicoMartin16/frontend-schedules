import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ViemService } from '../../services/viem.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {


  public readonly isConnected = signal<boolean>(false)
  private readonly _router = inject(Router);

  private readonly _viemService = inject(ViemService);

  public async connectWallet(): Promise<void> {
    const canConnected = await this._viemService.connectWallet();
    const address = await this._viemService.getAddress();
    if(canConnected && address) {
      this._router.navigate(['dashboard']);
    }
  }

}
