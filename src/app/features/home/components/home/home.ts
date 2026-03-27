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
