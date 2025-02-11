import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
  template: `
    <button mat-button [matMenuTriggerFor]="languageMenu">
      <mat-icon>language</mat-icon>
      {{ getLangName(currentLang) }}
    </button>
    <mat-menu #languageMenu="matMenu">
      <button mat-menu-item *ngFor="let lang of languages" 
              (click)="switchLanguage(lang)"
              [disabled]="currentLang === lang">
        {{ getLangName(lang) }}
      </button>
    </mat-menu>
  `,
  styles: [`
    button {
      min-width: 120px;
      color: white;
    }
    mat-icon {
      margin-right: 8px;
    }
  `]
})
export class LanguageSwitcherComponent {
  languages = ['en', 'de'];
  currentLang: string;

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentLang = this.translate.currentLang || 'en';
  }

  switchLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('preferredLanguage', lang);
    }
  }

  getLangName(lang: string): string {
    const names = {
      'en': 'English',
      'de': 'Deutsch'
    };
    return names[lang as keyof typeof names] || lang.toUpperCase();
  }
} 