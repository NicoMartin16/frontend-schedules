import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ViemService } from '../../services/viem.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Address } from 'viem';
import { Role } from '../../../features/dashboard/models/role.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpComponent {

  public address = signal<Address>('0x..');
  public rol: Role = Role.Student;

  constructor(
    private viemService: ViemService,
    private userService: UserService,
    private router: Router,
  ) { }

  async getAccount() {
    const account = await this.viemService.getAddress();
    const [address] = account;
    this.address.set(address);
  }

  async signUp() {
    console.log(this.rol);
    const isRegister = await this.userService.isRegistered(this.address());
    if (!isRegister) {
      try {
        await this.userService.registerUser(this.address(), this.rol);
        this.router.navigate(['login']);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('User already registered');
    }
    const logs = await this.userService.getEventsFromBlockchain('UserRegistered');
    console.log(logs);
  }

}
