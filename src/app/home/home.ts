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

  protected readonly skillTabs: SkillTab[] = [
    {
      key: 'frontend',
      label: '> Frontend',
      heading: 'Frontend Placeholder Skills',
      description: 'Temporary placeholders. Replace these with your real frontend strengths.',
      slides: [
        {
          title: 'Placeholder UI Skill A',
          summary: 'Temporary summary for this frontend skill. Replace with your own project impact.',
          tags: ['placeholder', 'frontend', 'ui']
        },
        {
          title: 'Placeholder UI Skill B',
          summary: 'Temporary summary for this frontend skill. Mention your frameworks and wins here.',
          tags: ['placeholder', 'components', 'ux']
        },
        {
          title: 'Placeholder UI Skill C',
          summary: 'Temporary summary for this frontend skill. Swap in your strongest examples.',
          tags: ['placeholder', 'css', 'interaction']
        }
      ]
    },
    {
      key: 'backend',
      label: '> Backend',
      heading: 'Backend Placeholder Skills',
      description: 'Temporary placeholders. Swap these out for your backend experience.',
      slides: [
        {
          title: 'Placeholder API Skill A',
          summary: 'Temporary summary for your backend APIs. Replace with real service ownership.',
          tags: ['placeholder', 'api', 'backend']
        },
        {
          title: 'Placeholder API Skill B',
          summary: 'Temporary summary for backend architecture. Add your scaling or reliability work.',
          tags: ['placeholder', 'architecture', 'services']
        },
        {
          title: 'Placeholder Data Skill C',
          summary: 'Temporary summary for persistence and data modeling. Replace with true experience.',
          tags: ['placeholder', 'data', 'sql']
        }
      ]
    },
    {
      key: 'tools',
      label: '> Tools',
      heading: 'Tooling Placeholder Skills',
      description: 'Temporary placeholders. Update this list with your favorite tools and workflows.',
      slides: [
        {
          title: 'Placeholder Tool A',
          summary: 'Temporary summary for tool usage. Replace with real developer tooling strengths.',
          tags: ['placeholder', 'tooling', 'workflow']
        },
        {
          title: 'Placeholder Tool B',
          summary: 'Temporary summary for automation. Mention your CI/CD and productivity wins.',
          tags: ['placeholder', 'automation', 'devops']
        },
        {
          title: 'Placeholder Workflow C',
          summary: 'Temporary summary for team practices. Replace with your collaboration style.',
          tags: ['placeholder', 'git', 'process']
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
