import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar';
import { FooderComponent } from '../../../../shared/components/fooder/fooder';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar';
import { IdleService } from '../../../../core/services/idle';

@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooderComponent,
    NavbarComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  private idleService = inject(IdleService);

  ngOnInit(): void {
    this.idleService.startWatching();
  }

  ngOnDestroy(): void {
    this.idleService.stopWatching();
  }
}

@Component({
  selector: 'app-home-bienvenida',
  standalone: true,
  template: `
    <div class="welcome-screen">
      <img src="/images/logo.png" alt="Logo" class="welcome-logo" />
      <p class="welcome-sub">Selecciona una opción del menú para comenzar</p>
    </div>
  `,
  styles: [`
    .welcome-screen {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 60vh;
      gap: 1.25rem;
      text-align: center;
    }
    .welcome-logo {
      width: 120px;
      max-width: 60%;
      object-fit: contain;
      border-radius: 1rem;
    }
    .welcome-sub {
      font-size: 1rem;
      color: #64748b;
    }
  `]
})
export class HomeBienvenidaComponent {}
