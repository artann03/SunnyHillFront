import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardMetrics } from '../../models/dashboard.interface';
import { ChartConfiguration } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    TranslateModule,
    BaseChartDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  metrics?: DashboardMetrics;
  revenueChartData?: ChartConfiguration['data'];
  topProductsChartData?: ChartConfiguration['data'];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadMetrics();
  }

  private loadMetrics() {
    this.dashboardService.getMetrics().subscribe({
      next: (data) => {
        this.metrics = data;
        this.initializeCharts();
      },
      error: (error) => console.error('Error loading dashboard metrics:', error)
    });
  }

  private initializeCharts() {
    if (!this.metrics) return;

    // Monthly Revenue Chart
    this.revenueChartData = {
      labels: this.metrics.monthlyRevenues.map(m => m.month),
      datasets: [{
        label: 'Monthly Revenue',
        data: this.metrics.monthlyRevenues.map(m => m.revenue),
        backgroundColor: 'rgba(255, 154, 158, 0.5)',
        borderColor: '#ff9a9e'
      }]
    };

    // Top Products Chart
    this.topProductsChartData = {
      labels: this.metrics.topSellingProducts.map(p => p.productName),
      datasets: [{
        label: 'Sales Count',
        data: this.metrics.topSellingProducts.map(p => p.salesCount),
        backgroundColor: ['#ff9a9e', '#fad0c4', '#ffd1ff']
      }]
    };
  }
} 