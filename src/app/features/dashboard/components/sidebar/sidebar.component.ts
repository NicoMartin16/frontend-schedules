import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MenuItems } from '../../models/menu-items.model';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { MENU_ITEMS } from '../../consts/menu-items.const';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {

  public readonly menuItems: MenuItems[] = MENU_ITEMS;

  constructor(private _router: Router) { }

  public navigateTo(item: MenuItems): void {
    // this._router.navigate([item.path]);
    this._router.navigate([item.path]);
    this.menuItems.map((menuItem) => {
      if (menuItem === item) {
        menuItem.active = true;
      } else {
        menuItem.active = false;
      }
    })
  }

}
