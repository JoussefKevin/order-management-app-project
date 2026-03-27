import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/services/auth';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {

  private authService = inject(AuthService);
  readonly userRole   = this.authService.userRole;

  readonly navItems: NavItem[] = [
    { label: 'Home',      path: '/home',                             icon: 'home',    roles: ['ADMIN','CLIENT','SELLER'] },
    { label: 'Productos', path: '/administracion/productos',         icon: 'box',     roles: ['ADMIN','SELLER'] },
    { label: 'Órdenes',   path: '/administracion/ordenes',           icon: 'orders',  roles: ['ADMIN','CLIENT','SELLER'] },
    { label: 'Usuarios',  path: '/administracion/usuarios',          icon: 'users',   roles: ['ADMIN'] },
  ];

  get filteredNavItems(): NavItem[] {
    return this.navItems.filter(item =>
      item.roles.includes(this.userRole() ?? '')
    );
  }
}
