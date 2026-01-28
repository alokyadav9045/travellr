/**
 * Environment Variables Validation Script
 * Validates all required environment variables before deployment
 */

const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * Required environment variables by category
 */
const requiredEnvVars = {
  'Server Configuration': {
    NODE_ENV: {
      required: true,
      type: 'string',
      allowedValues: ['development', 'production', 'test'],
      description: 'Node environment'
    },
    PORT: {
      required: true,
      type: 'number',
      description: 'Server port'
    }
  },

  'Database': {
    MONGO_URI: {
      required: true,
      type: 'string',
      pattern: /^mongodb(\+srv)?:\/\/.+/,
      description: 'MongoDB connection string'
    }
  },

  'Redis Cache': {
    REDIS_URL: {
      required: false,
      type: 'string',
      pattern: /^redis:\/\/.+/,
      description: 'Redis connection URL'
    }
  },

  'Authentication': {
    JWT_SECRET: {
      required: true,
      type: 'string',
      minLength: 32,
      description: 'JWT secret key (min 32 chars)'
    },
    JWT_EXPIRE: {
      required: true,
      type: 'string',
      description: 'JWT expiration time'
    }
  },

  'Email Service': {
    EMAIL_HOST: {
      required: true,
      type: 'string',
      description: 'Email SMTP host'
    },
    EMAIL_PORT: {
      required: true,
      type: 'number',
      description: 'Email SMTP port'
    },
    EMAIL_USER: {
      required: true,
      type: 'string',
      description: 'Email username'
    },
    EMAIL_PASSWORD: {
      required: true,
      type: 'string',
      description: 'Email password'
    },
    EMAIL_FROM: {
      required: true,
      type: 'string',
      pattern: /^.+@.+\..+$/,
      description: 'From email address'
    }
  },

  'Stripe Payment': {
    STRIPE_SECRET_KEY: {
      required: true,
      type: 'string',
      pattern: /^sk_(test|live)_.+/,
      description: 'Stripe secret key'
    },
    STRIPE_WEBHOOK_SECRET: {
      required: true,
      type: 'string',
      description: 'Stripe webhook secret'
    }
  },

  'Cloudinary': {
    CLOUDINARY_CLOUD_NAME: {
      required: true,
      type: 'string',
      description: 'Cloudinary cloud name'
    },
    CLOUDINARY_API_KEY: {
      required: true,
      type: 'string',
      description: 'Cloudinary API key'
    },
    CLOUDINARY_API_SECRET: {
      required: true,
      type: 'string',
      description: 'Cloudinary API secret'
    }
  },

  'Client Configuration': {
    CLIENT_URL: {
      required: true,
      type: 'string',
      pattern: /^https?:\/\/.+/,
      description: 'Frontend client URL'
    }
  }
};

/**
 * Validate environment variable
 */
function validateEnvVar(name, value, rules) {
  const errors = [];

  // Check if required
  if (rules.required && !value) {
    errors.push('Required but missing');
    return errors;
  }

  // If not required and not provided, skip validation
  if (!value) {
    return errors;
  }

  // Type validation
  if (rules.type === 'number') {
    const num = parseInt(value);
    if (isNaN(num)) {
      errors.push('Must be a number');
    }
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push('Invalid format');
  }

  // Allowed values
  if (rules.allowedValues && !rules.allowedValues.includes(value)) {
    errors.push(`Must be one of: ${rules.allowedValues.join(', ')}`);
  }

  // Min length
  if (rules.minLength && value.length < rules.minLength) {
    errors.push(`Must be at least ${rules.minLength} characters`);
  }

  return errors;
}

/**
 * Check for .env file
 */
function checkEnvFile() {
  const envPath = path.join(__dirname, '../../../.env');
  
  if (!fs.existsSync(envPath)) {
    console.log(`${colors.red}❌ .env file not found!${colors.reset}`);
    console.log(`${colors.yellow}💡 Copy .env.example to .env and fill in the values${colors.reset}\n`);
    return false;
  }

  return true;
}

/**
 * Main validation
 */
function validateEnvironment() {
  console.log(`${colors.cyan}🔍 Environment Variables Validation${colors.reset}`);
  console.log('═'.repeat(50) + '\n');

  // Check if .env file exists
  if (!checkEnvFile()) {
    process.exit(1);
  }

  // Load environment variables
  require('dotenv').config();

  let hasErrors = false;
  let hasWarnings = false;
  const summary = {
    total: 0,
    valid: 0,
    missing: 0,
    invalid: 0,
    optional: 0
  };

  // Validate each category
  Object.entries(requiredEnvVars).forEach(([category, vars]) => {
    console.log(`${colors.blue}${category}:${colors.reset}`);
    console.log('─'.repeat(50));

    Object.entries(vars).forEach(([name, rules]) => {
      summary.total++;
      const value = process.env[name];
      const errors = validateEnvVar(name, value, rules);

      if (errors.length > 0) {
        if (rules.required) {
          console.log(`${colors.red}  ❌ ${name}${colors.reset}`);
          summary.missing++;
          hasErrors = true;
        } else {
          console.log(`${colors.yellow}  ⚠️  ${name}${colors.reset}`);
          summary.optional++;
          hasWarnings = true;
        }
        
        errors.forEach(error => {
          console.log(`     ${error}`);
        });
        console.log(`     ${colors.cyan}${rules.description}${colors.reset}`);

      } else {
        console.log(`${colors.green}  ✅ ${name}${colors.reset}`);
        summary.valid++;
        
        // Show value preview (masked for sensitive data)
        if (value) {
          const isSensitive = name.includes('SECRET') || 
                            name.includes('PASSWORD') || 
                            name.includes('KEY');
          
          const preview = isSensitive 
            ? '*'.repeat(Math.min(value.length, 20))
            : value.substring(0, 50) + (value.length > 50 ? '...' : '');
          
          console.log(`     ${colors.cyan}${preview}${colors.reset}`);
        }
      }
    });

    console.log('');
  });

  // Summary
  console.log('═'.repeat(50));
  console.log(`${colors.cyan}Summary:${colors.reset}`);
  console.log(`  Total Variables: ${summary.total}`);
  console.log(`  ${colors.green}✅ Valid: ${summary.valid}${colors.reset}`);
  
  if (summary.missing > 0) {
    console.log(`  ${colors.red}❌ Missing/Invalid: ${summary.missing}${colors.reset}`);
  }
  
  if (summary.optional > 0) {
    console.log(`  ${colors.yellow}⚠️  Optional (not set): ${summary.optional}${colors.reset}`);
  }

  console.log('');

  // Environment-specific warnings
  const nodeEnv = process.env.NODE_ENV;
  
  if (nodeEnv === 'production') {
    console.log(`${colors.yellow}⚠️  Production Environment Checks:${colors.reset}`);
    
    // Check if using test Stripe keys
    if (process.env.STRIPE_SECRET_KEY?.includes('test')) {
      console.log(`  ${colors.red}❌ Using test Stripe keys in production!${colors.reset}`);
      hasErrors = true;
    }

    // Check if JWT secret is strong
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
      console.log(`  ${colors.red}❌ JWT_SECRET too short for production!${colors.reset}`);
      hasErrors = true;
    }

    // Check if using localhost URLs
    if (process.env.CLIENT_URL?.includes('localhost')) {
      console.log(`  ${colors.red}❌ CLIENT_URL points to localhost!${colors.reset}`);
      hasErrors = true;
    }

    console.log('');
  }

  // Final result
  if (hasErrors) {
    console.log(`${colors.red}❌ Validation FAILED - Fix errors before deploying!${colors.reset}\n`);
    process.exit(1);
  } else if (hasWarnings) {
    console.log(`${colors.yellow}⚠️  Validation passed with warnings${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.green}✅ All environment variables are valid!${colors.reset}\n`);
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  validateEnvironment();
}

module.exports = { validateEnvironment };
