import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-update-product-modal',
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
    <h2 mat-dialog-title>Update Product</h2>
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
      <button mat-raised-button color="primary" (click)="onSubmit()">Update Product</button>
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
    }

    mat-dialog-content {
      padding-top: 1rem !important;
    }
  `]
})
export class UpdateProductModalComponent {
  product: Product;

  constructor(
    private dialogRef: MatDialogRef<UpdateProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: Product
  ) {
    this.product = { ...data };
  }

  onSubmit(): void {
    const updateData = {
      name: this.product.name,
      description: this.product.description,
      imageUrl: this.product.imageUrl,
      price: this.product.price,
      quantity: this.product.quantity
    };
    this.dialogRef.close(updateData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 