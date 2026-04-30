import { AfterViewInit, Component, ElementRef, OnDestroy, PLATFORM_ID, QueryList, ViewChildren, computed, inject, signal } from '@angular/core';
import { TypingComponent } from '../typing.component';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

type SkillCategory = 'frontend' | 'backend' | 'tools';

type SkillTab = {
  key: SkillCategory;
  label: string;
  heading: string;
  description: string;
  slides: SkillSlide[];
};

type SkillSlide = {
  title: string;
  summary: string;
  tags: string[];
};

type AboutTopicKey = 'origin' | 'builder' | 'current';
type InterestTopicKey = 'games' | 'cards' | 'creation';

type HomeTopic<T extends string> = {
  key: T;
  label: string;
  summary: string;
  highlights: string[];
};

@Component({
  selector: 'app-home',
  imports: [TypingComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class Home implements AfterViewInit, OnDestroy {
  @ViewChildren('scrollSection')
  private scrollSections?: QueryList<ElementRef<HTMLElement>>;

  private sectionObserver?: IntersectionObserver;
  private sectionChangesSub?: Subscription;
  private readonly onWindowLoad = () => {
    this.setupSectionObserver();
  };

  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly title = signal('Portfolio-Website');

  protected readonly aboutTopics: HomeTopic<AboutTopicKey>[] = [
    {
      key: 'origin',
      label: 'How It Started',
      summary: 'I grew up asking how games and software worlds are built, and that curiosity never left.',
      highlights: ['Curiosity-first mindset', 'Started with game systems', 'Focused on understanding fundamentals']
    },
    {
      key: 'builder',
      label: 'Builder Mindset',
      summary: 'I enjoy turning ideas into interactive experiences and solving technical challenges end-to-end.',
      highlights: ['Builds from concept to implementation', 'Enjoys debugging and iteration', 'Cares about user experience']
    },
    {
      key: 'current',
      label: 'What I Do Now',
      summary: 'I am focused on software development with interest across full-stack, AI/ML, and games.',
      highlights: ['Full-stack development', 'AI and ML exploration', 'Game development passion']
    }
  ];

  protected readonly interestTopics: HomeTopic<InterestTopicKey>[] = [
    {
      key: 'games',
      label: 'Gaming',
      summary: 'Gaming has been a lifelong hobby and a big source of design inspiration.',
      highlights: ['Long-term gamer', 'Appreciates game feel and mechanics', 'Inspired by immersive worlds']
    },
    {
      key: 'cards',
      label: 'Card Games',
      summary: 'I have played Magic: The Gathering for years and enjoy strategic decision making.',
      highlights: ['Over a decade of MTG', 'Loves strategy and deck building', 'Enjoys competitive thinking']
    },
    {
      key: 'creation',
      label: 'Creating',
      summary: 'Learning web development came from wanting to create things people can interact with.',
      highlights: ['Self-driven learning', 'Loves interactive products', 'Always experimenting with new tools']
    }
  ];

  protected readonly activeAboutTopic = signal<AboutTopicKey>('origin');
  protected readonly activeInterestTopic = signal<InterestTopicKey>('games');
  protected readonly selectedAboutTopic = computed(
    () => this.aboutTopics.find((topic) => topic.key === this.activeAboutTopic()) ?? this.aboutTopics[0]
  );
  protected readonly selectedInterestTopic = computed(
    () => this.interestTopics.find((topic) => topic.key === this.activeInterestTopic()) ?? this.interestTopics[0]
  );

  private autoCycleTimer?: ReturnType<typeof setInterval>;
  protected isAutoCycling = true;

  protected readonly skillTabs: SkillTab[] = [
    {
      key: 'frontend',
      label: '> Frontend',
      heading: 'User Interface Skills',
      description: 'I have been mastering frontend development since my early projects.',
      slides: [
        {
          title: 'Web UI Development',
          summary: 'With my strong foundation in web frameworks, I create responsive and dynamic user interfaces.',
          tags: ['design', 'angular', 'html/css']
        },
        {
          title: 'Game UI and Interaction',
          summary: 'Using Unity\'s UI system to create engaging and intuitive interfaces.',
          tags: ['usability', 'components', 'ux']
        },
        {
          title: 'Responsive Design',
          summary: 'Using projects like this portfolio site to expermient with modern CSS techniques.',
          tags: ['tailwind', 'css', 'interaction']
        }
      ]
    },
    {
      key: 'backend',
      label: '> Backend',
      heading: 'Backend Skills',
      description: 'I have experience building scalable backend systems and APIs.',
      slides: [
        {
          title: 'API Development',
          summary: 'Designing and implementing RESTful APIs with a focus on performance and maintainability.',
          tags: ['node.js', 'express', 'fastapi']
        },
        {
          title: 'Database Design',
          summary: 'Creating efficient database schemas and optimizing queries for better performance.',
          tags: ['postgresql', 'mongodb', 'database']
        },
        {
          title: 'Cloud Infrastructure',
          summary: 'Deploying and managing applications on cloud platforms with a focus on reliability and scalability.',
          tags: ['azure', 'docker']
        }
      ]
    },
    {
      key: 'tools',
      label: '> Game Development',
      heading: 'Game Development Skills',
      description: 'With my background in game development, I have experience with various tools and engines to bring interactive experiences to life.',
      slides: [
        {
          title: 'Unity Engine',
          summary: 'Skilled in using Unity for game development, including C# scripting, physics, and animation systems.',
          tags: ['Mechanics', 'Animation', 'Game Engine']
        },
        {
          title: 'Unreal Engine',
          summary: 'I have experience with Unreal Engine, particularly in level design and Blueprint scripting for rapid prototyping.',
          tags: ['UI/UX', 'Level Design', 'Prototyping']
        },
        {
          title: 'Blender',
          summary: 'I have experience with Blender for 3D modeling and animation.',
          tags: ['Animation', 'Rigging', 'Modelling']
        }
      ]
    }
  ];

  protected readonly activeSkillTab = signal<SkillCategory>('frontend');
  protected readonly selectedSkills = computed(
    () => this.skillTabs.find((tab) => tab.key === this.activeSkillTab()) ?? this.skillTabs[0]
  );
  protected readonly activeSlideIndex = signal(0);
  protected readonly activeSlide = computed(
    () => this.selectedSkills().slides[this.activeSlideIndex()] ?? this.selectedSkills().slides[0]
  );

  protected setActiveTab(tabKey: SkillCategory) {
    this.activeSkillTab.set(tabKey);
    this.activeSlideIndex.set(0);
  }

  protected goToSlide(index: number) {
    const max = this.selectedSkills().slides.length - 1;
    const bounded = Math.max(0, Math.min(index, max));
    this.activeSlideIndex.set(bounded);
  }

  protected nextSlide() {
    const slideCount = this.selectedSkills().slides.length;
    this.activeSlideIndex.update((current) => (current + 1) % slideCount);
  }

  protected previousSlide() {
    const slideCount = this.selectedSkills().slides.length;
    this.activeSlideIndex.update((current) => (current - 1 + slideCount) % slideCount);
  }

  protected setAboutTopic(topicKey: AboutTopicKey) {
    this.activeAboutTopic.set(topicKey);
    this.pauseAutoCycle();
  }

  protected setInterestTopic(topicKey: InterestTopicKey) {
    this.activeInterestTopic.set(topicKey);
  }

  protected onInteractiveCardMove(event: MouseEvent) {
    const card = event.currentTarget as HTMLElement | null;
    if (!card) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
    card.style.setProperty('--glitch-opacity', '0.9');
  }

  protected onInteractiveCardLeave(event: MouseEvent) {
    const card = event.currentTarget as HTMLElement | null;
    if (!card) {
      return;
    }

    card.style.setProperty('--glitch-opacity', '0');
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    requestAnimationFrame(() => {
      this.setupSectionObserver();
    });

    window.addEventListener('load', this.onWindowLoad, { once: true });

    this.sectionChangesSub = this.scrollSections?.changes.subscribe(() => {
      requestAnimationFrame(() => {
        this.setupSectionObserver();
      });
    });

    this.startAutoCycle();
  }

  private setupSectionObserver() {
    const sections = this.scrollSections?.toArray() ?? [];
    if (sections.length === 0) {
      return;
    }

    this.sectionObserver?.disconnect();

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          entry.target.classList.add('is-visible');
          this.sectionObserver?.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    for (const section of sections) {
      const element = section.nativeElement;

      if (!element.classList.contains('reveal-ready')) {
        element.classList.add('reveal-ready');
      }

      if (element.classList.contains('is-visible')) {
        continue;
      }

      const rect = element.getBoundingClientRect();
      const isAlreadyVisible = rect.top < viewportHeight * 0.9 && rect.bottom > viewportHeight * 0.15;

      if (isAlreadyVisible) {
        requestAnimationFrame(() => {
          element.classList.add('is-visible');
        });
        continue;
      }

      this.sectionObserver.observe(element);
    }
  }

  ngOnDestroy() {
    this.sectionObserver?.disconnect();
    this.sectionChangesSub?.unsubscribe();
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('load', this.onWindowLoad);
    }
    this.stopAutoCycle();
  }

  goTo(path: string) {
    console.log('navigating to', path);
    this.router.navigate([path]);
  }

  goToExternal(path: string) {
    console.log('navigating to', path);
    window.open(path, '_blank');
  }

  private startAutoCycle() {
    this.stopAutoCycle();
    this.autoCycleTimer = setInterval(() => {
      if (this.isAutoCycling) {
        const currentIndex = this.aboutTopics.findIndex(t => t.key === this.activeAboutTopic());
        const nextIndex = (currentIndex + 1) % this.aboutTopics.length;
        this.activeAboutTopic.set(this.aboutTopics[nextIndex].key);
      }
    }, 5000); // Cycle every 5 seconds
  }

  private pauseAutoCycle() {
    this.isAutoCycling = false;
    setTimeout(() => {
      this.isAutoCycling = true;
    }, 10000); // Resume after 10 seconds of inactivity
  }

  private stopAutoCycle() {
    if (this.autoCycleTimer) {
      clearInterval(this.autoCycleTimer);
      this.autoCycleTimer = undefined;
    }
  }
}
