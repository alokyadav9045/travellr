#!/usr/bin/env node

/**
 * Performance Monitoring Script
 * Monitors application performance metrics in real-time
 */

const os = require('os');
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000';
const INTERVAL = parseInt(process.env.MONITOR_INTERVAL) || 5000; // 5 seconds

// Colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * Get system metrics
 */
function getSystemMetrics() {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  // Calculate CPU usage
  let totalIdle = 0;
  let totalTick = 0;

  cpus.forEach(cpu => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });

  const cpuUsage = 100 - ~~(100 * totalIdle / totalTick);

  return {
    cpuUsage,
    memoryUsage: ((usedMem / totalMem) * 100).toFixed(2),
    totalMemory: (totalMem / 1024 / 1024 / 1024).toFixed(2),
    usedMemory: (usedMem / 1024 / 1024 / 1024).toFixed(2),
    freeMemory: (freeMem / 1024 / 1024 / 1024).toFixed(2),
    loadAverage: os.loadavg(),
    uptime: os.uptime()
  };
}

/**
 * Check API health
 */
async function checkAPIHealth() {
  try {
    const start = Date.now();
    const response = await axios.get(`${API_URL}/api/health`, {
      timeout: 5000
    });
    const duration = Date.now() - start;

    return {
      status: 'healthy',
      responseTime: duration,
      data: response.data
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
}

/**
 * Test API endpoints
 */
async function testEndpoints() {
  const endpoints = [
    { method: 'GET', path: '/api/v1/trips', name: 'Trips List' },
    { method: 'GET', path: '/api/v1/search?query=mountain', name: 'Search' },
    { method: 'GET', path: '/api/health', name: 'Health Check' }
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      const start = Date.now();
      await axios({
        method: endpoint.method,
        url: `${API_URL}${endpoint.path}`,
        timeout: 5000
      });
      const duration = Date.now() - start;

      results.push({
        name: endpoint.name,
        status: 'ok',
        responseTime: duration
      });
    } catch (error) {
      results.push({
        name: endpoint.name,
        status: 'error',
        error: error.message
      });
    }
  }

  return results;
}

/**
 * Format uptime
 */
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  return `${days}d ${hours}h ${minutes}m`;
}

/**
 * Get color for metric
 */
function getMetricColor(value, thresholds) {
  if (value < thresholds.good) return colors.green;
  if (value < thresholds.warning) return colors.yellow;
  return colors.red;
}

/**
 * Display dashboard
 */
async function displayDashboard() {
  // Clear screen
  console.clear();

  console.log(`${colors.cyan}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}   📊 Travellr Performance Monitor${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════${colors.reset}\n`);

  console.log(`${colors.blue}⏰ ${new Date().toLocaleString()}${colors.reset}\n`);

  // System Metrics
  const system = getSystemMetrics();
  
  console.log(`${colors.cyan}💻 System Metrics:${colors.reset}`);
  console.log('─'.repeat(50));
  
  const cpuColor = getMetricColor(system.cpuUsage, { good: 50, warning: 80 });
  console.log(`  CPU Usage:     ${cpuColor}${system.cpuUsage}%${colors.reset}`);
  
  const memColor = getMetricColor(parseFloat(system.memoryUsage), { good: 60, warning: 80 });
  console.log(`  Memory Usage:  ${memColor}${system.memoryUsage}%${colors.reset} (${system.usedMemory}GB / ${system.totalMemory}GB)`);
  
  console.log(`  Load Average:  ${system.loadAverage.map(l => l.toFixed(2)).join(', ')}`);
  console.log(`  Uptime:        ${formatUptime(system.uptime)}`);
  console.log('');

  // API Health
  console.log(`${colors.cyan}🏥 API Health:${colors.reset}`);
  console.log('─'.repeat(50));
  
  const health = await checkAPIHealth();
  
  if (health.status === 'healthy') {
    const rtColor = getMetricColor(health.responseTime, { good: 100, warning: 500 });
    console.log(`  Status:        ${colors.green}✅ Healthy${colors.reset}`);
    console.log(`  Response Time: ${rtColor}${health.responseTime}ms${colors.reset}`);
    
    if (health.data) {
      console.log(`  Uptime:        ${formatUptime(health.data.uptime || 0)}`);
    }
  } else {
    console.log(`  Status:        ${colors.red}❌ Unhealthy${colors.reset}`);
    console.log(`  Error:         ${health.error}`);
  }
  console.log('');

  // Endpoint Tests
  console.log(`${colors.cyan}🔗 API Endpoints:${colors.reset}`);
  console.log('─'.repeat(50));
  
  const endpoints = await testEndpoints();
  
  endpoints.forEach(endpoint => {
    if (endpoint.status === 'ok') {
      const color = getMetricColor(endpoint.responseTime, { good: 200, warning: 1000 });
      console.log(`  ${colors.green}✅${colors.reset} ${endpoint.name.padEnd(20)} ${color}${endpoint.responseTime}ms${colors.reset}`);
    } else {
      console.log(`  ${colors.red}❌${colors.reset} ${endpoint.name.padEnd(20)} ${colors.red}${endpoint.error}${colors.reset}`);
    }
  });

  console.log('\n' + '═'.repeat(50));
  console.log(`${colors.yellow}Press Ctrl+C to stop monitoring${colors.reset}\n`);
}

/**
 * Start monitoring
 */
async function startMonitoring() {
  console.log(`${colors.cyan}Starting performance monitor...${colors.reset}`);
  console.log(`${colors.cyan}Monitoring ${API_URL} every ${INTERVAL / 1000}s${colors.reset}\n`);

  // Initial display
  await displayDashboard();

  // Update periodically
  setInterval(async () => {
    await displayDashboard();
  }, INTERVAL);
}

/**
 * Generate report
 */
async function generateReport() {
  console.log(`${colors.cyan}Generating Performance Report...${colors.reset}\n`);

  const metrics = {
    timestamp: new Date().toISOString(),
    system: getSystemMetrics(),
    api: await checkAPIHealth(),
    endpoints: await testEndpoints()
  };

  console.log(JSON.stringify(metrics, null, 2));
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'watch':
      case 'monitor':
        await startMonitoring();
        break;

      case 'report':
        await generateReport();
        break;

      case 'once':
        await displayDashboard();
        process.exit(0);
        break;

      default:
        console.log(`
Performance Monitor
===================

Usage:
  npm run monitor          - Start real-time monitoring
  npm run monitor once     - Show current metrics
  npm run monitor report   - Generate JSON report

Environment Variables:
  API_URL              - API URL to monitor (default: http://localhost:5000)
  MONITOR_INTERVAL     - Update interval in ms (default: 5000)

Examples:
  API_URL=http://api.travellr.com npm run monitor
  MONITOR_INTERVAL=10000 npm run monitor
        `);
        process.exit(0);
    }
  } catch (error) {
    console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(`\n\n${colors.cyan}👋 Monitoring stopped${colors.reset}\n`);
  process.exit(0);
});

// Run
main();
