import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TypingComponent } from '../typing.component';
import { Router } from '@angular/router';
import { TechStack } from '../tech-stack/tech-stack';

@Component({
  selector: 'app-home',
  imports: [TypingComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class Home {
  protected readonly title = signal('Portfolio-Website');

  constructor(private router: Router) {}

  goTo(path: string) {
    console.log('navigating to', path);
    this.router.navigate([path]);
  }

  goToExternal(path: string) {
    console.log('navigating to', path);
    window.open(path, '_blank');
  }
}
