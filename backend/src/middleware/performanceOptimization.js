// Performance optimization middleware
const compression = require('compression');

/**
 * Gzip compression middleware
 */
const gzipMiddleware = compression({
  level: 6, // Balanced compression level
  threshold: 1024, // Compress responses larger than 1KB
  filter: (req, res) => {
    // Don't compress these types
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
});

/**
 * Cache headers middleware for static assets
 */
const setCacheHeaders = (req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';
  
  if (isProd) {
    // Cache static assets for 1 year
    if (req.path.match(/\.(js|css|jpg|jpeg|png|gif|svg|woff|woff2)$/)) {
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
      res.set('ETag', 'W/"' + Date.now() + '"');
    }
    // Cache API responses strategically
    else if (req.path.startsWith('/api/v1/trips')) {
      res.set('Cache-Control', 'public, max-age=1800'); // 30 minutes
    }
    // Don't cache sensitive endpoints
    else {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
    }
  }
  
  next();
};

/**
 * Content Security Policy headers
 */
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
};

/**
 * Image optimization with Cloudinary
 */
class ImageOptimizer {
  static getOptimizedUrl(cloudinaryUrl, options = {}) {
    const {
      width = 800,
      height = 600,
      quality = 'auto',
      format = 'auto',
      dpr = 'auto'
    } = options;

    // Replace /upload/ with /upload/{transformations}
    const transformations = `w_${width},h_${height},c_fill,q_${quality},f_${format},dpr_${dpr}`;
    
    return cloudinaryUrl.replace(
      '/upload/',
      `/upload/${transformations}/`
    );
  }

  /**
   * Generate responsive image URL
   */
  static getResponsiveImageUrl(cloudinaryUrl, size = 'medium') {
    const sizes = {
      thumbnail: { width: 150, height: 150 },
      small: { width: 300, height: 300 },
      medium: { width: 600, height: 600 },
      large: { width: 1200, height: 900 },
      xlarge: { width: 1920, height: 1440 }
    };

    return this.getOptimizedUrl(cloudinaryUrl, sizes[size] || sizes.medium);
  }

  /**
   * Generate srcset for responsive images
   */
  static generateSrcSet(cloudinaryUrl) {
    return [
      { size: 300, dpr: '1x' },
      { size: 600, dpr: '2x' },
      { size: 900, dpr: '3x' }
    ].map(({ size, dpr }) => 
      `${this.getOptimizedUrl(cloudinaryUrl, { width: size })} ${dpr}`
    ).join(', ');
  }
}

/**
 * Next.js optimization middleware
 */
const nextJsOptimizations = (req, res, next) => {
  // Enable HTTP/2 Server Push for critical resources
  if (req.path === '/') {
    res.setHeader('Link', '</js/main.js>; rel=preload; as=script');
    res.setHeader('Link', '</css/main.css>; rel=preload; as=style');
  }

  next();
};

/**
 * Bundle size optimization hints
 */
class BundleOptimizer {
  /**
   * Get recommended bundle split points for Next.js
   */
  static getNextJsConfig() {
    return {
      experimental: {
        granularChunks: true,
        esmExternals: true
      },
      swcMinify: true,
      productionBrowserSourceMaps: false,
      compress: true,
      poweredByHeader: false,
      optimizeFonts: true,
      images: {
        deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 31536000
      }
    };
  }

  /**
   * Dynamic import recommendations
   */
  static getDynamicImports() {
    return {
      heavy_charts: 'dynamic(() => import("@/components/Analytics/Charts"))',
      map_component: 'dynamic(() => import("@/components/Map"))',
      pdf_generator: 'dynamic(() => import("@/lib/pdfGenerator"))',
      payment_modal: 'dynamic(() => import("@/components/Payment/Modal"))'
    };
  }
}

module.exports = {
  gzipMiddleware,
  setCacheHeaders,
  securityHeaders,
  nextJsOptimizations,
  ImageOptimizer,
  BundleOptimizer
};
