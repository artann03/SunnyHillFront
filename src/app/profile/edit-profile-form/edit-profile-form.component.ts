import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { UserProfile } from '../../models/user.interface';

@Component({
  selector: 'app-edit-profile-form',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ 'PROFILE.EDIT_PROFILE.TITLE' | translate }}</h2>
    <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'PROFILE.EDIT_PROFILE.NAME' | translate }}</mat-label>
          <input matInput formControlName="name" required>
          <mat-error *ngIf="profileForm.get('name')?.hasError('required')">
            {{ 'PROFILE.EDIT_PROFILE.NAME_REQUIRED' | translate }}
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'PROFILE.EDIT_PROFILE.CURRENT_PASSWORD' | translate }}</mat-label>
          <input matInput type="password" formControlName="currentPassword">
          <mat-error *ngIf="profileForm.get('currentPassword')?.hasError('required') && isPasswordChangeAttempted()">
            {{ 'PROFILE.EDIT_PROFILE.CURRENT_PASSWORD_REQUIRED' | translate }}
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'PROFILE.EDIT_PROFILE.NEW_PASSWORD' | translate }}</mat-label>
          <input matInput type="password" formControlName="newPassword">
          <mat-error *ngIf="profileForm.get('newPassword')?.hasError('minlength')">
            {{ 'PROFILE.EDIT_PROFILE.PASSWORD_LENGTH' | translate }}
          </mat-error>
        </mat-form-field>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">
          {{ 'COMMON.CANCEL' | translate }}
        </button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!isValid()">
          {{ 'COMMON.SAVE' | translate }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 300px;
      padding: 20px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    @media (max-width: 600px) {
      mat-dialog-content {
        min-width: unset;
        padding: 16px;
      }

      :host {
        width: 100%;
        max-width: 100%;
        height: 100%;
        max-height: 100%;
      }

      mat-dialog-actions {
        padding: 8px;
        margin-bottom: 0;
      }
    }
  `]
})
export class EditProfileFormComponent {
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditProfileFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserProfile
  ) {
    this.profileForm = this.fb.group({
      name: [data.name, Validators.required],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]]
    });
  }

  isPasswordChangeAttempted(): boolean {
    return !!this.profileForm.get('newPassword')?.value;
  }

  isValid(): boolean {
    const form = this.profileForm.value;
    if (!form.name) return false;

    if (form.newPassword && !form.currentPassword) return false;
    if (form.currentPassword && !form.newPassword) return false;

    return this.profileForm.valid;
  }

  onSubmit(): void {
    if (this.isValid()) {
      const formValue = this.profileForm.value;
      const updateData = {
        name: formValue.name,
        email: this.data.email,
        currentPassword: formValue.currentPassword || undefined,
        newPassword: formValue.newPassword || undefined
      };
      this.dialogRef.close(updateData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 