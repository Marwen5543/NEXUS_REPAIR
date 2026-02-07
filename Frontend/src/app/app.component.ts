import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'nexus-repair';
  showHeaderFooter = true;
  private destroy$ = new Subject<void>();

  constructor(private router: Router) {
    // Set initial state based on current URL
    this.updateShowHeaderFooter(this.router.url);
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        // Hide header and footer on login and signup pages
        this.updateShowHeaderFooter(event.urlAfterRedirects || event.url);
      });
  }

  private updateShowHeaderFooter(url: string): void {
    const path = url.split('?')[0];
    this.showHeaderFooter = !['/login', '/signup'].includes(path);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
