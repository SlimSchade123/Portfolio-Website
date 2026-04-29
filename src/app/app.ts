import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Location, isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit, OnDestroy {
  currentUrl = 'https://portfolio.local/';
  scrollProgress = 0;

  private scrollY = 0;
  private lastScrollY = 0;
  private scrollVelocity = 0;
  private animationFrame?: number;
  private scrollListener?: () => void;
  private isBrowser: boolean;

  constructor(
    private router: Router,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = 'https://portfolio.local' + event.url;
      });

    if (this.isBrowser) {
      this.setupScrollTracking();
    }
  }

  ngOnDestroy() {
    this.cleanupScrollTracking();
  }

  goBack() {
    this.location.back();
  }

  goForward() {
    this.location.forward();
  }

  refresh() {
    if (this.isBrowser) {
      window.location.reload();
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }

  onUrlInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (!value.startsWith('https://portfolio.local')) {
      input.value = 'https://portfolio.local' + value.replace(/^https:\/\/portfolio\.local/, '');
      this.currentUrl = input.value;
    } else {
      this.currentUrl = value;
    }
  }

  onUrlKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const path = this.currentUrl.replace('https://portfolio.local', '') || '/';
      this.router.navigate([path]);
    }
  }

  private setupScrollTracking() {
    this.scrollListener = () => {
      this.lastScrollY = this.scrollY;
      this.scrollY = window.scrollY;
      this.scrollVelocity = this.scrollY - this.lastScrollY;

      if (!this.animationFrame) {
        this.animationFrame = requestAnimationFrame(() => {
          this.updateScrollEffects();
          this.animationFrame = undefined;
        });
      }
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  private cleanupScrollTracking() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private updateScrollEffects() {
    const root = document.documentElement;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(this.scrollY / maxScroll, 1);

    this.scrollProgress = scrollProgress;

    // Update CSS variables for scroll-based effects
    root.style.setProperty('--scroll-y', `${this.scrollY}px`);
    root.style.setProperty('--scroll-velocity', `${Math.abs(this.scrollVelocity)}`);
    root.style.setProperty('--scroll-progress', `${scrollProgress}`);
    root.style.setProperty('--scroll-intensity', `${Math.min(Math.abs(this.scrollVelocity) / 10, 1)}`);
  }
}