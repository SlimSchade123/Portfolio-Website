import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tech-stack',
  imports: [],
  templateUrl: './tech-stack.html',
  styleUrl: './tech-stack.css',
})
export class TechStack {
  
  @Input() techStack: string[] = ["DUMMY FORGOT"];
  

  UpdateTechStack(newTechStack: string[]) {
    this.techStack = newTechStack;
  }
}
