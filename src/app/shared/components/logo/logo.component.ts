import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="logo" [class.large]="large">
      <span class="logo-text">SH</span>
    </div>
  `,
  styles: [`
    .logo {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo.large {
      width: 80px;
      height: 80px;
      border-radius: 20px;
    }

    .logo-text {
      color: white;
      font-weight: bold;
      font-size: 1.2rem;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }

    .large .logo-text {
      font-size: 2rem;
    }
  `]
})
export class LogoComponent {
  @Input() large = false;
} 