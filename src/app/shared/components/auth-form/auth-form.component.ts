import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    RouterLink,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  template: `
    <div class="auth-form-container">
      <mat-card class="auth-card">
        <mat-card-content>
          <form [formGroup]="authForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" required>
              <mat-error *ngIf="authForm.get('email')?.invalid">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" required>
              <mat-error *ngIf="authForm.get('password')?.invalid">
                Password is required
              </mat-error>
            </mat-form-field>

            <re-captcha
              formControlName="recaptcha"
              [siteKey]="recaptchaSiteKey">
            </re-captcha>

            <div class="error-message" *ngIf="error">{{ error }}</div>

            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="authForm.invalid || loading">
              {{ loading ? 'Loading...' : 'Login' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-form-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    
    .auth-card {
      padding: 1rem;
    }
    
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    mat-form-field {
      width: 100%;
    }
    
    .error-message {
      color: #f44336;
      margin-bottom: 1rem;
      text-align: center;
    }
    
    button {
      width: 100%;
    }

    re-captcha {
      margin: 1rem 0;
      display: flex;
      justify-content: center;
    }
  `]
})
export class AuthFormComponent {
  @Input() loading = false;
  @Input() error: string | null = null;
  @Output() formSubmit = new EventEmitter<{email: string; password: string; recaptchaToken: string}>();

  recaptchaSiteKey = 'your-recaptcha-site-key'; // Get this from Google reCAPTCHA admin
  authForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      recaptcha: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.authForm.valid) {
      const { email, password, recaptcha } = this.authForm.value;
      this.formSubmit.emit({ 
        email, 
        password, 
        recaptchaToken: recaptcha 
      });
    }
  }
} 