'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileBarChart,
  TrendingUp,
  Download,
  Filter,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  Star,
  Clock,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'sales' | 'marketing' | 'operations' | 'finance' | 'customer';
  icon: React.ElementType;
  metrics: string[];
  defaultTimeRange: string;
  format: 'pdf' | 'excel' | 'csv' | 'dashboard';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  isCustomizable: boolean;
}

interface ReportConfig {
  templateId: string;
  name: string;
  timeRange: {
    start: Date;
    end: Date;
  };
  filters: Record<string, any>;
  metrics: string[];
  format: 'pdf' | 'excel' | 'csv' | 'dashboard';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    enabled: boolean;
    recipients: string[];
  };
}

interface ReportGeneratorProps {
  onReportGenerate?: (config: ReportConfig) => void;
  className?: string;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'revenue_summary',
    name: 'Revenue Summary',
    description: 'Comprehensive revenue analysis with trends and forecasts',
    category: 'finance',
    icon: DollarSign,
    metrics: ['Total Revenue', 'Revenue Growth', 'Revenue by Source', 'Profit Margins'],
    defaultTimeRange: '30d',
    format: 'pdf',
    frequency: 'monthly',
    isCustomizable: true
  },
  {
    id: 'booking_performance',
    name: 'Booking Performance',
    description: 'Detailed analysis of booking patterns and conversion rates',
    category: 'sales',
    icon: BarChart3,
    metrics: ['Total Bookings', 'Conversion Rate', 'Booking Sources', 'Cancellation Rate'],
    defaultTimeRange: '30d',
    format: 'excel',
    frequency: 'weekly',
    isCustomizable: true
  },
  {
    id: 'customer_insights',
    name: 'Customer Insights',
    description: 'Customer behavior, segmentation, and satisfaction metrics',
    category: 'customer',
    icon: Users,
    metrics: ['Customer Acquisition', 'Customer Lifetime Value', 'Retention Rate', 'Satisfaction Score'],
    defaultTimeRange: '90d',
    format: 'pdf',
    frequency: 'monthly',
    isCustomizable: true
  },
  {
    id: 'destination_analysis',
    name: 'Destination Analysis',
    description: 'Performance analysis by destination and trip categories',
    category: 'operations',
    icon: MapPin,
    metrics: ['Popular Destinations', 'Revenue by Location', 'Booking Trends', 'Seasonal Patterns'],
    defaultTimeRange: '90d',
    format: 'excel',
    frequency: 'monthly',
    isCustomizable: true
  },
  {
    id: 'marketing_roi',
    name: 'Marketing ROI',
    description: 'Marketing campaign performance and return on investment',
    category: 'marketing',
    icon: Target,
    metrics: ['Campaign Performance', 'Cost per Acquisition', 'Channel Attribution', 'ROI by Campaign'],
    defaultTimeRange: '30d',
    format: 'pdf',
    frequency: 'weekly',
    isCustomizable: true
  },
  {
    id: 'operational_efficiency',
    name: 'Operational Efficiency',
    description: 'Operational metrics and efficiency indicators',
    category: 'operations',
    icon: Activity,
    metrics: ['Response Time', 'Resolution Rate', 'Vendor Performance', 'System Uptime'],
    defaultTimeRange: '7d',
    format: 'dashboard',
    frequency: 'daily',
    isCustomizable: false
  }
];

const availableMetrics = [
  { id: 'total_revenue', name: 'Total Revenue', category: 'finance' },
  { id: 'revenue_growth', name: 'Revenue Growth', category: 'finance' },
  { id: 'profit_margin', name: 'Profit Margin', category: 'finance' },
  { id: 'total_bookings', name: 'Total Bookings', category: 'sales' },
  { id: 'conversion_rate', name: 'Conversion Rate', category: 'sales' },
  { id: 'cancellation_rate', name: 'Cancellation Rate', category: 'sales' },
  { id: 'customer_acquisition', name: 'Customer Acquisition', category: 'customer' },
  { id: 'customer_ltv', name: 'Customer Lifetime Value', category: 'customer' },
  { id: 'retention_rate', name: 'Retention Rate', category: 'customer' },
  { id: 'satisfaction_score', name: 'Satisfaction Score', category: 'customer' },
  { id: 'popular_destinations', name: 'Popular Destinations', category: 'operations' },
  { id: 'seasonal_trends', name: 'Seasonal Trends', category: 'operations' },
  { id: 'campaign_performance', name: 'Campaign Performance', category: 'marketing' },
  { id: 'cost_per_acquisition', name: 'Cost per Acquisition', category: 'marketing' },
  { id: 'channel_attribution', name: 'Channel Attribution', category: 'marketing' }
];

const categoryColors = {
  finance: 'bg-green-100 text-green-800',
  sales: 'bg-blue-100 text-blue-800',
  customer: 'bg-purple-100 text-purple-800',
  operations: 'bg-orange-100 text-orange-800',
  marketing: 'bg-pink-100 text-pink-800'
};

const categoryIcons = {
  finance: DollarSign,
  sales: BarChart3,
  customer: Users,
  operations: Activity,
  marketing: Target
};

export default function ReportGenerator({
  onReportGenerate,
  className
}: ReportGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [reportConfig, setReportConfig] = useState<Partial<ReportConfig>>({
    timeRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date()
    },
    format: 'pdf',
    metrics: [],
    filters: {}
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredTemplates = filterCategory === 'all' 
    ? reportTemplates 
    : reportTemplates.filter(t => t.category === filterCategory);

  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setReportConfig({
      templateId: template.id,
      name: template.name,
      timeRange: {
        start: new Date(Date.now() - (template.defaultTimeRange === '7d' ? 7 : template.defaultTimeRange === '30d' ? 30 : 90) * 24 * 60 * 60 * 1000),
        end: new Date()
      },
      format: template.format,
      metrics: template.metrics,
      filters: {}
    });
    setShowCustomization(template.isCustomizable);
  };

  const handleMetricToggle = (metricId: string, metricName: string) => {
    setReportConfig(prev => ({
      ...prev,
      metrics: prev.metrics?.includes(metricName)
        ? prev.metrics.filter(m => m !== metricName)
        : [...(prev.metrics || []), metricName]
    }));
  };

  const generateReport = async () => {
    if (!selectedTemplate || !reportConfig.templateId) return;

    setIsGenerating(true);
    try {
      // In a real app, this would call your report generation API
      // const response = await fetch('/api/reports/generate', {
      //   method: 'POST',
      //   body: JSON.stringify(reportConfig)
      // });
      
      // Mock report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      onReportGenerate?.(reportConfig as ReportConfig);
      
      // Simulate download or opening dashboard
      if (reportConfig.format === 'dashboard') {
        // Open in new tab or modal
        console.log('Opening dashboard view...');
      } else {
        // Simulate file download
        const fileName = `${reportConfig.name?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${reportConfig.format}`;
        console.log(`Downloading ${fileName}...`);
      }
      
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderTemplateCard = (template: ReportTemplate) => {
    const Icon = template.icon;
    const CategoryIcon = categoryIcons[template.category];
    const isSelected = selectedTemplate?.id === template.id;

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "cursor-pointer transition-all duration-200",
          isSelected && "ring-2 ring-blue-500"
        )}
        onClick={() => handleTemplateSelect(template)}
      >
        <Card className={cn(
          "h-full",
          isSelected && "border-blue-500 shadow-md"
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <Badge className={categoryColors[template.category]}>
                  <CategoryIcon className="w-3 h-3 mr-1" />
                  {template.category}
                </Badge>
              </div>
              {template.isCustomizable && (
                <Badge variant="outline" className="text-xs">
                  Customizable
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <p className="text-sm text-gray-600">{template.description}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Key Metrics:</p>
                <div className="flex flex-wrap gap-1">
                  {template.metrics.slice(0, 3).map((metric) => (
                    <Badge key={metric} variant="secondary" className="text-xs">
                      {metric}
                    </Badge>
                  ))}
                  {template.metrics.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.metrics.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{template.frequency}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileBarChart className="w-3 h-3" />
                  <span>{template.format.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderCustomization = () => {
    if (!selectedTemplate || !showCustomization) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Customize Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Name */}
          <div>
            <Label htmlFor="report-name">Report Name</Label>
            <Input
              id="report-name"
              value={reportConfig.name || ''}
              onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter custom report name"
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <DatePicker
                date={reportConfig.timeRange?.start}
                onDateChange={(date: Date | undefined) => 
                  setReportConfig(prev => ({
                    ...prev,
                    timeRange: { ...prev.timeRange!, start: date || new Date() }
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <DatePicker
                date={reportConfig.timeRange?.end}
                onDateChange={(date: Date | undefined) => 
                  setReportConfig(prev => ({
                    ...prev,
                    timeRange: { ...prev.timeRange!, end: date || new Date() }
                  }))
                }
              />
            </div>
          </div>

          {/* Output Format */}
          <div>
            <Label htmlFor="format">Output Format</Label>
            <Select value={reportConfig.format} onValueChange={(value: any) => setReportConfig(prev => ({ ...prev, format: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Report</SelectItem>
                <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                <SelectItem value="csv">CSV Data</SelectItem>
                <SelectItem value="dashboard">Interactive Dashboard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Metrics Selection */}
          <div>
            <Label>Select Metrics</Label>
            <ScrollArea className="h-48 border rounded-md p-4">
              <div className="space-y-3">
                {Object.entries(
                  availableMetrics.reduce((acc, metric) => {
                    if (!acc[metric.category]) acc[metric.category] = [];
                    acc[metric.category].push(metric);
                    return acc;
                  }, {} as Record<string, typeof availableMetrics>)
                ).map(([category, metrics]) => (
                  <div key={category}>
                    <h4 className="font-medium text-sm text-gray-700 mb-2 capitalize">
                      {category}
                    </h4>
                    <div className="space-y-2 pl-2">
                      {metrics.map((metric) => (
                        <div key={metric.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={metric.id}
                            checked={reportConfig.metrics?.includes(metric.name)}
                            onCheckedChange={() => handleMetricToggle(metric.id, metric.name)}
                          />
                          <Label htmlFor={metric.id} className="text-sm">
                            {metric.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Additional Filters */}
          <div>
            <Label>Additional Filters</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="destination-filter" className="text-sm">Destination</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All destinations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Destinations</SelectItem>
                    <SelectItem value="manali">Manali</SelectItem>
                    <SelectItem value="goa">Goa</SelectItem>
                    <SelectItem value="kerala">Kerala</SelectItem>
                    <SelectItem value="rajasthan">Rajasthan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="category-filter" className="text-sm">Trip Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="leisure">Leisure</SelectItem>
                    <SelectItem value="culture">Culture</SelectItem>
                    <SelectItem value="nature">Nature</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <FileBarChart className="w-6 h-6" />
            <span>Report Generator</span>
          </h2>
          <p className="text-gray-600">Create comprehensive business reports and analytics</p>
        </div>

        {selectedTemplate && (
          <Button
            onClick={generateReport}
            disabled={isGenerating}
            className="flex items-center space-x-2"
          >
            {isGenerating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-4 h-4" />
              </motion.div>
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isGenerating ? 'Generating...' : 'Generate Report'}</span>
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-4">
        <Label>Filter by Category:</Label>
        <div className="flex space-x-2">
          <Button
            variant={filterCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory('all')}
          >
            All
          </Button>
          {Object.entries(categoryColors).map(([category, colorClass]) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons];
            return (
              <Button
                key={category}
                variant={filterCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterCategory(category)}
                className="flex items-center space-x-1"
              >
                <Icon className="w-3 h-3" />
                <span className="capitalize">{category}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => renderTemplateCard(template))}
      </div>

      {/* Customization Panel */}
      {renderCustomization()}

      {/* Selected Report Summary */}
      {selectedTemplate && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <selectedTemplate.icon className="w-5 h-5 text-blue-600" />
                  <span>{reportConfig.name || selectedTemplate.name}</span>
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {reportConfig.timeRange?.start?.toLocaleDateString()} - {reportConfig.timeRange?.end?.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileBarChart className="w-3 h-3" />
                    <span>{reportConfig.format?.toUpperCase()} Format</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BarChart3 className="w-3 h-3" />
                    <span>{reportConfig.metrics?.length || 0} Metrics</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {showCustomization && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCustomization(!showCustomization)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                )}
                <Badge className="bg-blue-100 text-blue-800">
                  Ready to Generate
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}