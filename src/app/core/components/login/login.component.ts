import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ViemService } from '../../services/viem.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Address } from 'viem';
import { Role } from '../../../features/dashboard/models/role.enum';

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
  private readonly userService = inject(UserService);

  public async connectWallet(): Promise<void> {
    const canConnected = await this._viemService.connectWallet();
    const address = await this._viemService.getAddress() as unknown as Address;
    const account: Address | null = await this._viemService.getConnectedAddress();
    if(!account) {
      console.log('Failed to connect');
      return;
    }
    const user = await this.userService.getUser(account);
    if(!canConnected) {
      console.log('Failed to connect');
    }

    if(user.role === Role.Student) {
      // TODO: Implement student dashboard;
      console.log('navigate to student dashboard');
      this._router.navigate(['students-dashboard']);
    }

    if(user.role === Role.Professor) {
      // TODO: Implement professor dashboard;
      console.log('navigate to professor dashboard');
    }

    if(user.role === Role.Admin) {
      this._router.navigate(['dashboard']);
    }

  }

  public navigateToSignUp = () =>  {
    this._router.navigate(['sign-up']);
  }

}
