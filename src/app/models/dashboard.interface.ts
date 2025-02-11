export interface DashboardMetrics {
  totalProducts: number;
  activeUsers: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  totalRevenue: number;
  totalOrders: number;
  topSellingProducts: TopSellingProduct[];
  monthlyRevenues: MonthlyRevenue[];
}

export interface TopSellingProduct {
  productName: string;
  salesCount: number;
  revenue: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
} 