import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { LanguageSwitcherComponent } from '../../shared/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    RouterModule,
    TranslateModule,
    LanguageSwitcherComponent
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../../shared/styles/auth.styles.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  emailSent = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.get('email')?.value;
      this.authService.requestPasswordReset(email).subscribe({
        next: () => {
          this.emailSent = true;
          this.snackBar.open('Recovery email sent successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Failed to send recovery email', error);
          this.snackBar.open('Failed to send recovery email', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
