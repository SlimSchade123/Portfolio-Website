import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  imports: [],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {

  constructor(private router: Router) {}

  goTo(path: string) {
    console.log('navigating to', path);
    this.router.navigate([path]);
  }

}
