import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TypingComponent } from "../typing.component";

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageClass: string;
  imageUrl: string;
  githubUrl?: string;
  note?: string;
}

@Component({
  selector: 'app-projects',
  imports: [CommonModule, TypingComponent],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements AfterViewInit, OnDestroy {

  @ViewChild('projectsViewport')
  private projectsViewport?: ElementRef<HTMLDivElement>;

  private autoScrollTimerId?: ReturnType<typeof setInterval>;
  currentProjectIndex = 0;
  projectIndexes: number[] = [];
  filterKeyword = '';

  readonly projects: ProjectItem[] = [
    {
      id: 'mechanon',
      title: 'Mechanon.exe',
      description: 'Mechanon is a Deep Reinforcement Learning bot using RLGym-PPO for training. It has 19 reward functions and was trained to 4B timesteps.',
      tags: ['Python', 'Deep RL', 'RLGym-PPO'],
      imageClass: 'project-image-mechanon',
      imageUrl: 'assets/images/Mechanon.png',
      note: 'Not Publicly Available',
    },
    {
      id: 'asd-chatbot',
      title: 'ASD-ChatBot.exe',
      description: 'Built for a hackathon, this chatbot uses an ASD-10 questionnaire classification model and reaches about 80% prediction accuracy.',
      tags: ['Python', 'ML', 'NLP'],
      imageClass: 'project-image-asd',
      imageUrl: 'assets/images/asdclassification.png',
      githubUrl: 'https://github.com/SlimSchade123/HackathonSpring2025-ASDClassificationModel',
    },
    {
      id: 'dnd-discord-bot',
      title: 'DND-Discord-Bot.exe',
      description: 'A Discord bot that can stand in as a Dungeon Master for Dungeons and Dragons, powered by GPT-based conversation flow.',
      tags: ['JavaScript', 'Prompt Engineering', 'LLM'],
      imageClass: 'project-image-dnd',
      imageUrl: 'assets/images/DNDBot.png',
      githubUrl: 'https://github.com/SlimSchade123/DiscordDND',
    },
    {
      id: 'raytracing-engine',
      title: 'Raytracing-Engine.exe',
      description: 'A raytracing engine for realistic lighting simulation in 3D scenes, with a software rasterizer implementation for alternate rendering.',
      tags: ['C++', 'Computer Graphics', 'Software Development'],
      imageClass: 'project-image-raytracing',
      imageUrl: 'assets/images/raytracing.png',
      githubUrl: 'https://github.com/SlimSchade123/GAT350-----Computer-Graphics',
    },
  ];

  visibleProjects: ProjectItem[] = [...this.projects];

  private readonly scrollIntervalMs = 12000;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.updateIndexes();
    this.initializeCarousel();
  }

  ngOnDestroy() {
    this.stopAutoScroll();
  }

  startAutoScroll() {
    this.stopAutoScroll();

    const projectPages = this.getProjectPages();

    if (projectPages.length <= 1) {
      return;
    }

    this.autoScrollTimerId = setInterval(() => {
      this.currentProjectIndex = (this.currentProjectIndex + 1) % projectPages.length;
      this.scrollToProject(this.currentProjectIndex);
    }, this.scrollIntervalMs);
  }

  stopAutoScroll() {
    if (this.autoScrollTimerId) {
      clearInterval(this.autoScrollTimerId);
      this.autoScrollTimerId = undefined;
    }
  }

  goToProject(index: number) {
    if (index < 0 || index >= this.projectIndexes.length) {
      return;
    }

    this.currentProjectIndex = index;
    this.scrollToProject(index);
    this.startAutoScroll();
  }

  onFilterChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filterKeyword = input.value;

    this.applyFilter();
    this.updateIndexes();

    requestAnimationFrame(() => {
      this.initializeCarousel();
    });
  }

  resetFilter() {
    this.filterKeyword = '';
    this.applyFilter();
    this.updateIndexes();

    requestAnimationFrame(() => {
      this.initializeCarousel();
    });
  }

  onViewportScroll() {
    const viewport = this.projectsViewport?.nativeElement;
    if (!viewport || viewport.clientWidth === 0) {
      return;
    }

    const nextIndex = Math.round(viewport.scrollLeft / viewport.clientWidth);
    this.currentProjectIndex = Math.max(0, Math.min(nextIndex, this.projectIndexes.length - 1));
  }

  trackProject(_index: number, project: ProjectItem) {
    return project.id;
  }

  private getProjectPages() {
    const viewport = this.projectsViewport?.nativeElement;
    if (!viewport) {
      return [];
    }

    return Array.from(viewport.querySelectorAll<HTMLElement>('.project-page'));
  }

  private scrollToProject(index: number) {
    const viewport = this.projectsViewport?.nativeElement;
    const projectPages = this.getProjectPages();
    if (!viewport || !projectPages[index]) {
      return;
    }

    viewport.scrollTo({
      left: projectPages[index].offsetLeft,
      behavior: 'smooth',
    });
  }

  private initializeCarousel() {
    const viewport = this.projectsViewport?.nativeElement;
    if (!viewport) {
      return;
    }

    this.currentProjectIndex = 0;

    // Wait one frame so layout measurements are stable before starting.
    requestAnimationFrame(() => {
      viewport.scrollTo({ left: 0, behavior: 'auto' });
      this.startAutoScroll();
    });
  }

  private applyFilter() {
    const keyword = this.filterKeyword.trim().toLowerCase();

    if (!keyword) {
      this.visibleProjects = [...this.projects];
      return;
    }

    this.visibleProjects = this.projects.filter(project => {
      const matchesDescription = project.description.toLowerCase().includes(keyword);
      const matchesTag = project.tags.some(tag => tag.toLowerCase().includes(keyword));
      return matchesDescription || matchesTag;
    });
  }

  private updateIndexes() {
    this.projectIndexes = this.visibleProjects.map((_project, index) => index);
  }

  goTo(path: string) {
    console.log('navigating to', path);
    this.router.navigate([path]);
  }

  goToExternal(path: string) {
    console.log('navigating to', path);
    window.open(path, '_blank');
  }
}
