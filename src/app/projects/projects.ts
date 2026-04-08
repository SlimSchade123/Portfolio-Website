import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TypingComponent } from "../typing.component";

@Component({
  selector: 'app-projects',
  imports: [TypingComponent],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {

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
