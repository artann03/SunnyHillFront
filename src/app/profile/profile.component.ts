import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { UserProfile } from '../models/user.interface';
import { EditProfileFormComponent } from './edit-profile-form/edit-profile-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LanguageSwitcherComponent } from '../shared/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    TranslateModule,
    LanguageSwitcherComponent
  ],
  template: `
    <div class="profile-container">
      <mat-card>
        <div class="profile-header">
          <div class="avatar-container">
            <mat-icon class="avatar-icon">account_circle</mat-icon>
            <div class="user-info">
              <h2>{{user?.name}}</h2>
              <span class="role-badge">{{user?.role || 'User'}}</span>
            </div>
          </div>
          <div class="header-actions">
            <app-language-switcher></app-language-switcher>
            <button mat-raised-button color="primary" (click)="openEditDialog()">
              <mat-icon>edit</mat-icon>
              {{ 'PROFILE.EDIT' | translate }}
            </button>
          </div>
        </div>
        <mat-card-content>
          <div class="info-grid">
            <div class="info-item">
              <mat-icon>email</mat-icon>
              <div class="info-content">
                <span class="label">{{ 'PROFILE.EMAIL' | translate }}</span>
                <span class="value">{{user?.email}}</span>
              </div>
            </div>
            <div class="info-item">
              <mat-icon>badge</mat-icon>
              <div class="info-content">
                <span class="label">{{ 'PROFILE.ROLE' | translate }}</span>
                <span class="value">{{user?.role || 'User'}}</span>
              </div>
            </div>
            <div class="info-item">
              <mat-icon>access_time</mat-icon>
              <div class="info-content">
                <span class="label">{{ 'PROFILE.LAST_LOGIN' | translate }}</span>
                <span class="value">{{user?.lastLoginTime | date:'medium'}}</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    
    mat-card {
      padding: 2rem;
      border-radius: 12px;
    }

    .profile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }

    .avatar-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .avatar-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #666;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-info h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #333;
    }

    .role-badge {
      background-color: #e3f2fd;
      color: #1976d2;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.875rem;
      margin-top: 4px;
      display: inline-block;
    }

    .info-grid {
      display: grid;
      gap: 1.5rem;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .info-item mat-icon {
      color: #666;
    }

    .info-content {
      display: flex;
      flex-direction: column;
    }

    .label {
      font-size: 0.875rem;
      color: #666;
    }

    .value {
      font-size: 1rem;
      color: #333;
      margin-top: 4px;
    }

    button {
      gap: 8px;
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: UserProfile | null = null;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        this.user = profile;
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
      }
    });
  }

  openEditDialog(): void {
    if (!this.user) return;

    const dialogRef = this.dialog.open(EditProfileFormComponent, {
      data: this.user,
      width: '90%',
      maxWidth: '400px',
      maxHeight: '90vh',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.updateProfile(result).subscribe({
          next: (updatedProfile) => {
            this.user = {...this.user, ...updatedProfile};
            this.loadUserProfile();
            this.snackBar.open('Profile updated successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          },
          error: (error) => {
            console.error('Error updating profile:', error);
            this.snackBar.open(error.message || 'Failed to update profile', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        });
      }
    });
  }
}
