// Advanced reporting service
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class ReportingService {
  /**
   * Generate revenue report
   */
  static async generateRevenueReport(startDate, endDate) {
    const Booking = mongoose.model('Booking');

    const data = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          'payment.paymentStatus': 'completed'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalRevenue: { $sum: '$pricing.totalPrice' },
          totalDiscount: { $sum: '$pricing.discount' },
          vendorPayment: { $sum: '$pricing.vendorAmount' },
          platformFee: { $sum: '$pricing.platformFee' },
          bookingCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    return {
      title: 'Revenue Report',
      period: `${startDate.toDateString()} - ${endDate.toDateString()}`,
      data,
      generatedAt: new Date(),
      summary: {
        totalRevenue: data.reduce((sum, d) => sum + d.totalRevenue, 0),
        totalDiscount: data.reduce((sum, d) => sum + d.totalDiscount, 0),
        totalVendorPayment: data.reduce((sum, d) => sum + d.vendorPayment, 0),
        totalBookings: data.reduce((sum, d) => sum + d.bookingCount, 0)
      }
    };
  }

  /**
   * Generate booking report
   */
  static async generateBookingReport(startDate, endDate) {
    const Booking = mongoose.model('Booking');

    const [statusBreakdown, paymentStatus, trends] = await Promise.all([
      Booking.aggregate([
        {
          $match: { createdAt: { $gte: startDate, $lte: endDate } }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            revenue: { $sum: '$pricing.totalPrice' }
          }
        }
      ]),
      Booking.aggregate([
        {
          $match: { createdAt: { $gte: startDate, $lte: endDate } }
        },
        {
          $group: {
            _id: '$payment.paymentStatus',
            count: { $sum: 1 }
          }
        }
      ]),
      Booking.aggregate([
        {
          $match: { createdAt: { $gte: startDate, $lte: endDate } }
        },
        {
          $group: {
            _id: { $dayOfMonth: '$createdAt' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    ]);

    return {
      title: 'Booking Report',
      period: `${startDate.toDateString()} - ${endDate.toDateString()}`,
      statusBreakdown,
      paymentStatus,
      trends,
      summary: {
        totalBookings: statusBreakdown.reduce((sum, s) => sum + s.count, 0),
        completedBookings: statusBreakdown.find(s => s._id === 'completed')?.count || 0,
        cancelledBookings: statusBreakdown.find(s => s._id === 'cancelled')?.count || 0,
        pendingBookings: statusBreakdown.find(s => s._id === 'pending')?.count || 0
      }
    };
  }

  /**
   * Generate vendor performance report
   */
  static async generateVendorReport(startDate, endDate) {
    const Booking = mongoose.model('Booking');

    const vendorPerformance = await Booking.aggregate([
      {
        $match: { createdAt: { $gte: startDate, $lte: endDate } }
      },
      {
        $lookup: {
          from: 'vendors',
          localField: 'vendor',
          foreignField: '_id',
          as: 'vendorInfo'
        }
      },
      {
        $unwind: '$vendorInfo'
      },
      {
        $group: {
          _id: '$vendor',
          vendorName: { $first: '$vendorInfo.name' },
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.vendorAmount' },
          avgRating: { $avg: '$rating' },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    return {
      title: 'Vendor Performance Report',
      period: `${startDate.toDateString()} - ${endDate.toDateString()}`,
      data: vendorPerformance,
      summary: {
        totalVendors: vendorPerformance.length,
        totalVendorEarnings: vendorPerformance.reduce((sum, v) => sum + v.totalRevenue, 0),
        avgVendorRating: vendorPerformance.reduce((sum, v) => sum + v.avgRating, 0) / vendorPerformance.length
      }
    };
  }

  /**
   * Generate custom report
   */
  static async generateCustomReport(config) {
    const { type, metrics, filters, startDate, endDate } = config;

    const report = {
      type,
      metrics,
      period: `${startDate.toDateString()} - ${endDate.toDateString()}`,
      generatedAt: new Date(),
      filters
    };

    // Add custom logic based on type
    switch (type) {
      case 'customer_segmentation':
        report.data = await this.getCustomerSegmentation(startDate, endDate, metrics);
        break;
      case 'geographic':
        report.data = await this.getGeographicReport(startDate, endDate);
        break;
      case 'promotion_analysis':
        report.data = await this.getPromotionAnalysis(startDate, endDate);
        break;
    }

    return report;
  }

  /**
   * Generate PDF report
   */
  static async generatePDFReport(report) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const filename = `report_${Date.now()}.pdf`;
        const filepath = path.join('/tmp', filename);
        const stream = fs.createWriteStream(filepath);

        doc.pipe(stream);

        // Title
        doc.fontSize(24).font('Helvetica-Bold').text(report.title, { underline: true });
        doc.fontSize(12).font('Helvetica').text(`Period: ${report.period}`).moveDown();
        doc.text(`Generated: ${report.generatedAt.toLocaleString()}`).moveDown(2);

        // Summary
        if (report.summary) {
          doc.fontSize(14).font('Helvetica-Bold').text('Summary');
          Object.entries(report.summary).forEach(([key, value]) => {
            const label = key.replace(/([A-Z])/g, ' $1').trim();
            const formattedValue = typeof value === 'number' && value > 1000 
              ? `₹${value.toLocaleString()}` 
              : value;
            doc.fontSize(11).font('Helvetica').text(`${label}: ${formattedValue}`);
          });
          doc.moveDown(2);
        }

        // Data table
        if (report.data) {
          doc.fontSize(14).font('Helvetica-Bold').text('Data');
          doc.fontSize(10).font('Helvetica');

          const data = Array.isArray(report.data) ? report.data : [report.data];
          data.forEach((row, idx) => {
            if (idx > 0) doc.moveDown(0.5);
            Object.entries(row).forEach(([key, value]) => {
              doc.text(`${key}: ${value}`);
            });
          });
        }

        doc.end();

        stream.on('finish', () => {
          resolve(filepath);
        });

        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Email scheduled report
   */
  static async emailScheduledReport(report, recipients) {
    try {
      const pdfPath = await this.generatePDFReport(report);

      const transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: recipients.join(','),
        subject: `${report.title} - ${new Date().toLocaleDateString()}`,
        html: this.generateEmailTemplate(report),
        attachments: [
          {
            filename: `${report.title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
            path: pdfPath
          }
        ]
      };

      const result = await transporter.sendMail(mailOptions);
      
      // Clean up PDF
      fs.unlinkSync(pdfPath);

      return result;
    } catch (error) {
      console.error('Email report error:', error);
      throw error;
    }
  }

  /**
   * Generate email template for report
   */
  static generateEmailTemplate(report) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1e40af; color: white; padding: 20px; border-radius: 5px; }
            .summary { margin: 20px 0; }
            .metric { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .metric-label { font-weight: bold; }
            .metric-value { color: #1e40af; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${report.title}</h1>
              <p>Period: ${report.period}</p>
            </div>
            
            <div class="summary">
              <h2>Summary</h2>
              ${Object.entries(report.summary || {})
                .map(([key, value]) => `
                  <div class="metric">
                    <span class="metric-label">${key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span class="metric-value">${value.toLocaleString()}</span>
                  </div>
                `).join('')}
            </div>

            <p>Please find the detailed report attached.</p>
            <p>Best regards,<br>Travellr Analytics Team</p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Helper methods
   */
  static async getCustomerSegmentation(startDate, endDate, metrics) {
    const Booking = mongoose.model('Booking');
    return await Booking.aggregate([
      {
        $match: { createdAt: { $gte: startDate, $lte: endDate } }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'customer',
          foreignField: '_id',
          as: 'customerInfo'
        }
      },
      {
        $group: {
          _id: '$customerInfo.role',
          count: { $sum: 1 },
          totalSpent: { $sum: '$pricing.totalPrice' }
        }
      }
    ]);
  }

  static async getGeographicReport(startDate, endDate) {
    const Booking = mongoose.model('Booking');
    return await Booking.aggregate([
      {
        $match: { createdAt: { $gte: startDate, $lte: endDate } }
      },
      {
        $lookup: {
          from: 'trips',
          localField: 'trip',
          foreignField: '_id',
          as: 'tripInfo'
        }
      },
      {
        $group: {
          _id: {
            country: '$tripInfo.location.country',
            state: '$tripInfo.location.state'
          },
          bookings: { $sum: 1 },
          revenue: { $sum: '$pricing.totalPrice' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);
  }

  static async getPromotionAnalysis(startDate, endDate) {
    const Booking = mongoose.model('Booking');
    return await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          appliedPromoCode: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$appliedPromoCode',
          usageCount: { $sum: 1 },
          totalDiscount: { $sum: '$pricing.discount' },
          revenue: { $sum: '$pricing.totalPrice' }
        }
      },
      { $sort: { usageCount: -1 } }
    ]);
  }
}

module.exports = ReportingService;
