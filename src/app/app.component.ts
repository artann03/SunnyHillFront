import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LogoComponent } from './shared/components/logo/logo.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { LanguageSwitcherComponent } from './shared/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink, 
    CommonModule,
    MatButtonModule,
    MatIconModule,
    LogoComponent,
    NavbarComponent,
    LanguageSwitcherComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isMenuOpen = false;
  currentUrl: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService
  ) {
    translate.addLangs(['en', 'de']);
    translate.setDefaultLang('en');
    
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('preferredLanguage');
      const browserLang = translate.getBrowserLang();
      const lang = savedLang || (browserLang?.match(/en|de/) ? browserLang : 'en');
      
      translate.use(lang);
      localStorage.setItem('preferredLanguage', lang);
    } else {
      translate.use('en'); // Default language for server-side rendering
    }

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.url;
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUrl = this.router.url;
    }
  }

  shouldShowNavbar(): boolean {
    return !this.isAuthRoute();
  }

  isAuthRoute(): boolean {
    const authRoutes = ['/login', '/register', '/forgot-password'];
    return authRoutes.some(route => this.currentUrl.startsWith(route));
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('preferredLanguage', lang);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  isAdmin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return this.authService.isAdmin();
    }
    return false;
  }
}
