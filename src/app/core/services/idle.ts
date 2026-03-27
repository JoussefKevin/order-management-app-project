import { Injectable, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, BehaviorSubject, fromEvent, merge } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth';

const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 15 minutos

@Injectable({ providedIn: 'root' })
export class IdleService {

  private router      = inject(Router);
  private authService = inject(AuthService);
  private ngZone      = inject(NgZone);

  private readonly _isIdle$ = new BehaviorSubject<boolean>(false);
  readonly isIdle$ = this._isIdle$.asObservable();
  private readonly _destroy$ = new Subject<void>();

  private idleTimer: ReturnType<typeof setTimeout> | null = null;

  startWatching(): void {
    this.ngZone.runOutsideAngular(() => {

      const userEvents$ = merge(
        fromEvent(window, 'mousemove'),
        fromEvent(window, 'keydown'),
        fromEvent(window, 'click'),
        fromEvent(window, 'scroll'),
        fromEvent(window, 'touchstart')
      );

      userEvents$.pipe(
        debounceTime(500),
        takeUntil(this._destroy$)
      ).subscribe(() => {
        this._isIdle$.next(false);
        this.resetTimer();
      });

      this.resetTimer();
    });
  }

  stopWatching(): void {
    this._destroy$.next();
    this._destroy$.complete();
    if (this.idleTimer) clearTimeout(this.idleTimer);
  }

  private resetTimer(): void {
    if (this.idleTimer) clearTimeout(this.idleTimer);

    this.idleTimer = setTimeout(() => {
      this.ngZone.run(() => {
        this._isIdle$.next(true);
        this.authService.logout();
        this.router.navigate(['/login']);
      });
    }, IDLE_TIMEOUT_MS);
  }
}
