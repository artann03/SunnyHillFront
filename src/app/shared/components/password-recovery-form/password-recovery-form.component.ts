import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LogoComponent } from '../logo/logo.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-password-recovery-form',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    RouterModule,
    LogoComponent,
    TranslateModule
  ],
  templateUrl: './password-recovery-form.component.html',
  styleUrls: ['./password-recovery-form.component.css']
})
export class PasswordRecoveryFormComponent {
  @Output() formSubmit = new EventEmitter<string>();
  
  recoveryForm: FormGroup;
  isSubmitted = false;
  emailSent = false;
  emailError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.emailError = '';
    
    if (this.recoveryForm.valid) {
      const email = this.recoveryForm.get('email')?.value;
      this.authService.verifyEmailExists(email).subscribe({
        next: () => {
          this.formSubmit.emit(email);
          this.emailSent = true;
        },
        error: (error: any) => {
          this.emailError = 'No account found with this email address';
        }
      });
    }
  }

  shouldShowError(controlName: string): boolean {
    const control = this.recoveryForm.get(controlName);
    if (!control) return false;
    return (control.invalid && (control.dirty || control.touched || this.isSubmitted)) || !!this.emailError;
  }

  getErrorMessage(): string {
    const control = this.recoveryForm.get('email');
    if (this.emailError) return this.emailError;
    if (control?.hasError('required')) return 'Email is required';
    if (control?.hasError('email')) return 'Please enter a valid email';
    return '';
  }
} 