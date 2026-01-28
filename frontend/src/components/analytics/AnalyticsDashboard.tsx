'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Star,
  Target,
  Eye,
  ShoppingCart,
  CreditCard,
  Clock,
  Filter,
  Download,
  RefreshCcw,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface DashboardMetric {
  id: string;
  label: string;
  value: number | string;
  previousValue?: number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  format?: 'currency' | 'percentage' | 'number' | 'time';
  icon: React.ElementType;
  color: string;
  description?: string;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
  }>;
}

interface DashboardData {
  overview: DashboardMetric[];
  revenue: {
    current: number;
    target: number;
    growth: number;
    breakdown: ChartData;
  };
  bookings: {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    trends: ChartData;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    segmentation: ChartData;
  };
  destinations: Array<{
    name: string;
    bookings: number;
    revenue: number;
    rating: number;
    growth: number;
  }>;
  performance: {
    conversionRate: number;
    averageOrderValue: number;
    customerLifetimeValue: number;
    returnCustomerRate: number;
  };
}

interface AnalyticsDashboardProps {
  timeRange: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | '1y') => void;
  userRole: 'admin' | 'vendor' | 'manager';
  className?: string;
}

const timeRangeOptions = {
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
  '90d': 'Last 3 Months',
  '1y': 'Last Year'
};

// Simple chart components (in a real app, you'd use a library like Chart.js or Recharts)
const SimpleLineChart = ({ data, height = 100 }: { data: number[]; height?: number }) => (
  <div className="relative" style={{ height }}>
    <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        points={data.map((value, index) => {
          const x = (index / (data.length - 1)) * 300;
          const y = 100 - ((value / Math.max(...data)) * 100);
          return `${x},${y}`;
        }).join(' ')}
      />
    </svg>
  </div>
);

const SimpleBarChart = ({ data, labels, height = 200 }: { data: number[]; labels: string[]; height?: number }) => (
  <div className="flex items-end justify-between space-x-2" style={{ height }}>
    {data.map((value, index) => (
      <div key={index} className="flex flex-col items-center flex-1">
        <div 
          className="bg-blue-600 rounded-t w-full transition-all duration-500 ease-in-out"
          style={{ height: `${(value / Math.max(...data)) * (height - 40)}px` }}
        />
        <span className="text-xs text-gray-500 mt-2 text-center">{labels[index]}</span>
      </div>
    ))}
  </div>
);

const DonutChart = ({ data, total }: { data: Array<{ label: string; value: number; color: string }>; total: number }) => (
  <div className="relative w-32 h-32 mx-auto">
    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="10"
      />
      {data.reduce((acc, item, index) => {
        const percentage = (item.value / total) * 100;
        const strokeDasharray = `${percentage * 2.51} ${251.2 - percentage * 2.51}`;
        const strokeDashoffset = -acc.offset;
        
        acc.elements.push(
          <circle
            key={index}
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={item.color}
            strokeWidth="10"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        );
        
        acc.offset += percentage * 2.51;
        return acc;
      }, { elements: [] as React.ReactElement[], offset: 0 }).elements}
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg font-bold">{total}</div>
        <div className="text-xs text-gray-500">Total</div>
      </div>
    </div>
  </div>
);

export default function AnalyticsDashboard({
  timeRange,
  onTimeRangeChange,
  userRole,
  className
}: AnalyticsDashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, [timeRange, userRole]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from your analytics API
      // const response = await fetch(`/api/analytics/dashboard?timeRange=${timeRange}&role=${userRole}`);
      // const data = await response.json();
      
      // Mock dashboard data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData: DashboardData = {
        overview: [
          {
            id: 'revenue',
            label: 'Total Revenue',
            value: 2540000,
            previousValue: 2180000,
            change: 16.5,
            changeType: 'positive',
            format: 'currency',
            icon: DollarSign,
            color: 'text-green-600',
            description: 'Total revenue generated'
          },
          {
            id: 'bookings',
            label: 'Total Bookings',
            value: 1247,
            previousValue: 1098,
            change: 13.6,
            changeType: 'positive',
            format: 'number',
            icon: ShoppingCart,
            color: 'text-blue-600',
            description: 'Number of bookings'
          },
          {
            id: 'customers',
            label: 'Active Customers',
            value: 892,
            previousValue: 823,
            change: 8.4,
            changeType: 'positive',
            format: 'number',
            icon: Users,
            color: 'text-purple-600',
            description: 'Active customer count'
          },
          {
            id: 'conversion',
            label: 'Conversion Rate',
            value: 3.2,
            previousValue: 2.8,
            change: 14.3,
            changeType: 'positive',
            format: 'percentage',
            icon: Target,
            color: 'text-orange-600',
            description: 'Visit to booking rate'
          }
        ],
        revenue: {
          current: 2540000,
          target: 3000000,
          growth: 16.5,
          breakdown: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Revenue',
              data: [380000, 420000, 390000, 450000, 480000, 520000]
            }]
          }
        },
        bookings: {
          total: 1247,
          confirmed: 1089,
          pending: 98,
          cancelled: 60,
          trends: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
              label: 'Bookings',
              data: [287, 319, 298, 343]
            }]
          }
        },
        customers: {
          total: 892,
          new: 156,
          returning: 736,
          segmentation: {
            labels: ['New', 'Returning', 'VIP'],
            datasets: [{
              label: 'Customers',
              data: [156, 586, 150]
            }]
          }
        },
        destinations: [
          { name: 'Manali', bookings: 234, revenue: 587000, rating: 4.8, growth: 23.4 },
          { name: 'Goa', bookings: 198, revenue: 445000, rating: 4.6, growth: 18.2 },
          { name: 'Kerala', bookings: 176, revenue: 398000, rating: 4.9, growth: 15.8 },
          { name: 'Rajasthan', bookings: 145, revenue: 365000, rating: 4.7, growth: 12.3 },
          { name: 'Kashmir', bookings: 123, revenue: 298000, rating: 4.8, growth: 8.9 }
        ],
        performance: {
          conversionRate: 3.2,
          averageOrderValue: 12580,
          customerLifetimeValue: 35400,
          returnCustomerRate: 68.5
        }
      };
      
      setDashboardData(mockData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const formatValue = (value: number | string, format?: string): string => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return `₹${(value / 1000).toFixed(0)}K`;
      case 'percentage':
        return `${value}%`;
      case 'time':
        return `${value}min`;
      default:
        return value.toLocaleString();
    }
  };

  const renderMetricCard = (metric: DashboardMetric) => {
    const Icon = metric.icon;
    const hasChange = metric.change !== undefined;
    
    return (
      <Card key={metric.id} className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn("p-3 rounded-full bg-gray-50", metric.color)}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatValue(metric.value, metric.format)}
                </p>
              </div>
            </div>
            
            {hasChange && (
              <div className={cn(
                "flex items-center space-x-1 text-sm",
                metric.changeType === 'positive' ? "text-green-600" : 
                metric.changeType === 'negative' ? "text-red-600" : "text-gray-600"
              )}>
                {metric.changeType === 'positive' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : metric.changeType === 'negative' ? (
                  <ArrowDownRight className="w-4 h-4" />
                ) : null}
                <span>{metric.change!.toFixed(1)}%</span>
              </div>
            )}
          </div>
          
          {metric.description && (
            <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardData!.overview.map(renderMetricCard)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Revenue Trends</span>
              <Badge className="bg-green-100 text-green-800">
                +{dashboardData!.revenue.growth}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Current</p>
                  <p className="text-lg font-bold">₹{(dashboardData!.revenue.current / 100000).toFixed(1)}L</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Target</p>
                  <p className="text-lg font-bold">₹{(dashboardData!.revenue.target / 100000).toFixed(1)}L</p>
                </div>
              </div>
              <Progress 
                value={(dashboardData!.revenue.current / dashboardData!.revenue.target) * 100} 
                className="h-2"
              />
              <SimpleBarChart 
                data={dashboardData!.revenue.breakdown.datasets[0].data} 
                labels={dashboardData!.revenue.breakdown.labels}
                height={150}
              />
            </div>
          </CardContent>
        </Card>

        {/* Bookings Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <DonutChart
                data={[
                  { label: 'Confirmed', value: dashboardData!.bookings.confirmed, color: '#10b981' },
                  { label: 'Pending', value: dashboardData!.bookings.pending, color: '#f59e0b' },
                  { label: 'Cancelled', value: dashboardData!.bookings.cancelled, color: '#ef4444' }
                ]}
                total={dashboardData!.bookings.total}
              />
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Confirmed ({dashboardData!.bookings.confirmed})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Pending ({dashboardData!.bookings.pending})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Cancelled ({dashboardData!.bookings.cancelled})</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDestinationsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Destinations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData!.destinations.map((destination, index) => (
              <div key={destination.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{destination.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{destination.bookings} bookings</span>
                      <span>₹{(destination.revenue / 1000).toFixed(0)}K revenue</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{destination.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn(
                    "flex items-center space-x-1 text-sm",
                    destination.growth > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {destination.growth > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{destination.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {dashboardData!.performance.conversionRate}%
            </div>
            <p className="text-sm text-gray-600 mt-1">Conversion Rate</p>
            <div className="mt-2 text-xs text-green-600">+0.4% vs last period</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              ₹{(dashboardData!.performance.averageOrderValue / 1000).toFixed(1)}K
            </div>
            <p className="text-sm text-gray-600 mt-1">Avg Order Value</p>
            <div className="mt-2 text-xs text-green-600">+8.2% vs last period</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              ₹{(dashboardData!.performance.customerLifetimeValue / 1000).toFixed(1)}K
            </div>
            <p className="text-sm text-gray-600 mt-1">Customer LTV</p>
            <div className="mt-2 text-xs text-green-600">+12.4% vs last period</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {dashboardData!.performance.returnCustomerRate}%
            </div>
            <p className="text-sm text-gray-600 mt-1">Return Rate</p>
            <div className="mt-2 text-xs text-green-600">+3.1% vs last period</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Segmentation</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart 
              data={dashboardData!.customers.segmentation.datasets[0].data}
              labels={dashboardData!.customers.segmentation.labels}
              height={200}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-blue-600 h-32">
              <SimpleLineChart data={dashboardData!.bookings.trends.datasets[0].data} height={120} />
            </div>
            <div className="flex justify-between mt-4 text-sm text-gray-600">
              {dashboardData!.bookings.trends.labels.map((label, index) => (
                <span key={index}>{label}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center p-12", className)}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 text-blue-600"
        >
          <BarChart3 className="w-8 h-8" />
        </motion.div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className={cn("text-center p-12", className)}>
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load dashboard</h3>
        <p className="text-gray-600 mb-4">There was an error loading the analytics data.</p>
        <Button onClick={loadDashboardData}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <BarChart3 className="w-8 h-8" />
            <span>Business Intelligence</span>
          </h1>
          <p className="text-gray-600">Comprehensive analytics and insights</p>
        </div>

        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={(value: string) => onTimeRangeChange?.(value as '7d' | '30d' | '90d' | '1y')}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(timeRangeOptions).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCcw className={cn("w-4 h-4", refreshing && "animate-spin")} />
            <span>Refresh</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <span>Export as PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Export as CSV</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Export as Excel</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="destinations" className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Destinations</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Performance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {renderOverviewTab()}
        </TabsContent>

        <TabsContent value="destinations" className="space-y-6 mt-6">
          {renderDestinationsTab()}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6 mt-6">
          {renderPerformanceTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
}