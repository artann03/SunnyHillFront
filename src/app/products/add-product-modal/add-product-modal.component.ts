import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-product-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>Add New Product</h2>
    <mat-dialog-content class="dialog-content">
      <form (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Product Name</mat-label>
          <input matInput [(ngModel)]="product.name" name="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput [(ngModel)]="product.description" name="description" required></textarea>
        </mat-form-field>

        <div class="file-input-container">
          <label for="imageInput" class="file-input-label">
            Choose Image
            <input 
              type="file" 
              id="imageInput" 
              (change)="onFileSelected($event)"
              accept="image/*"
              class="file-input"
              required>
          </label>
          <span *ngIf="selectedFileName" class="file-name">{{ selectedFileName }}</span>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Price</mat-label>
          <input matInput type="number" [(ngModel)]="product.price" name="price" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Quantity</mat-label>
          <input matInput type="number" [(ngModel)]="product.quantity" name="quantity" required>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()">Add Product</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    
    .dialog-content {
      min-width: 400px;
      padding: 20px;
      margin-top: 1rem;  /* Add space at the top */
    }

    mat-dialog-content {
      padding-top: 1rem !important;  /* Force top padding */
    }

    h2[mat-dialog-title] {
      margin-bottom: 0;  /* Remove bottom margin from title */
    }

    .file-input-container {
      margin-bottom: 1rem;
    }

    .file-input-label {
      display: inline-block;
      padding: 8px 16px;
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 8px;
    }

    .file-input {
      display: none;
    }

    .file-name {
      margin-left: 8px;
      color: #666;
    }
  `]
})
export class AddProductModalComponent {
  product = {
    name: '',
    description: '',
    price: 0,
    quantity: 0
  };
  selectedFile: File | null = null;
  selectedFileName: string = '';

  constructor(private dialogRef: MatDialogRef<AddProductModalComponent>) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('image', this.selectedFile);
    formData.append('price', this.product.price.toString());
    formData.append('quantity', this.product.quantity.toString());

    this.dialogRef.close(formData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 