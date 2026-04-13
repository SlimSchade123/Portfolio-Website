import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-typing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="inline-flex items-baseline min-h-[1em] leading-none align-middle">
      <span class="inline-block min-w-[0.05em]">{{ displayedText() }}</span>
      <span
        class="ml-0.5 inline-block w-[2px] h-[1em] bg-[#1a3a1a] align-baseline"
        [class.opacity-0]="!cursorVisible()"
        [class.opacity-100]="cursorVisible()"
        style="transition: opacity 0.1s"
      ></span>
    </span>
  `,
})
export class TypingComponent implements OnInit, OnDestroy {
  @Input() words: string[] = [
    'SILLY GOOSE FORGOT TO ADD WORDS',
  ];
  @Input() typeSpeed = 80;
  @Input() deleteSpeed = 45;
  @Input() pauseAfterType = 2500;
  @Input() pauseAfterDelete = 400;

  displayedText = signal('');
  cursorVisible = signal(true);

  private wordIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private cursorTimer: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.startCursorBlink();
    this.tick();
  }

  ngOnDestroy() {
    if (this.timer) clearTimeout(this.timer);
    if (this.cursorTimer) clearInterval(this.cursorTimer);
  }

  private startCursorBlink() {
    this.cursorTimer = setInterval(() => {
      this.cursorVisible.update(v => !v);
    }, 530);
  }

  private tick() {
    const currentWord = this.words[this.wordIndex];

    if (!this.isDeleting) {
      // Typing forward
      this.charIndex++;
      this.displayedText.set(currentWord.slice(0, this.charIndex));

      if (this.charIndex === currentWord.length) {
        // Fully typed — pause, then start deleting
        this.timer = setTimeout(() => {
          this.isDeleting = true;
          this.tick();
        }, this.pauseAfterType);
        return;
      }
    } else {
      // Deleting
      this.charIndex--;
      this.displayedText.set(currentWord.slice(0, this.charIndex));

      if (this.charIndex === 0) {
        // Fully deleted — move to next word, pause, then start typing
        this.isDeleting = false;
        this.wordIndex = (this.wordIndex + 1) % this.words.length;
        this.timer = setTimeout(() => this.tick(), this.pauseAfterDelete);
        return;
      }
    }

    const delay = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
    this.timer = setTimeout(() => this.tick(), delay);
  }
}