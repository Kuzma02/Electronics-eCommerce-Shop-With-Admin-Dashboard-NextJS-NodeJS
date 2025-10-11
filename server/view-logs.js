const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, 'logs');

function viewLogs(logType = 'access', lines = 50) {
  const logFile = path.join(logsDir, `${logType}.log`);
  
  if (!fs.existsSync(logFile)) {
    console.log(`Log file ${logType}.log not found.`);
    console.log(`Looking in: ${logFile}`);
    console.log(`Logs directory exists: ${fs.existsSync(logsDir)}`);
    return;
  }
  
  const content = fs.readFileSync(logFile, 'utf8');
  const logLines = content.split('\n').filter(line => line.trim());
  const recentLines = logLines.slice(-lines);
  
  console.log(`\n=== Recent ${logType} logs (last ${lines} lines) ===\n`);
  recentLines.forEach(line => {
    if (logType === 'security') {
      try {
        const log = JSON.parse(line);
        console.log(`${log.timestamp} - ${log.type}: ${log.method} ${log.url} from ${log.ip}`);
      } catch (e) {
        console.log(line);
      }
    } else {
      console.log(line);
    }
  });
}

function analyzeSecurity() {
  const securityFile = path.join(logsDir, 'security.log');
  
  if (!fs.existsSync(securityFile)) {
    console.log('No security logs found.');
    return;
  }
  
  const content = fs.readFileSync(securityFile, 'utf8');
  const logs = content.split('\n')
    .filter(line => line.trim())
    .map(line => {
      try {
        return JSON.parse(line);
      } catch (e) {
        return null;
      }
    })
    .filter(log => log !== null);
  
  console.log('\n=== Security Analysis ===\n');
  console.log(`Total security events: ${logs.length}`);
  
  const byType = logs.reduce((acc, log) => {
    acc[log.type] = (acc[log.type] || 0) + 1;
    return acc;
  }, {});
  
  console.log('\nEvents by type:');
  Object.entries(byType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
  
  const byIP = logs.reduce((acc, log) => {
    acc[log.ip] = (acc[log.ip] || 0) + 1;
    return acc;
  }, {});
  
  console.log('\nTop suspicious IPs:');
  Object.entries(byIP)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .forEach(([ip, count]) => {
      console.log(`  ${ip}: ${count} events`);
    });
}

// Command line interface
const args = process.argv.slice(2);
const command = args[0] || 'access';
const lines = parseInt(args[1]) || 50;

switch (command) {
  case 'access':
  case 'error':
  case 'security':
    viewLogs(command, lines);
    break;
  case 'analyze':
    analyzeSecurity();
    break;
  case 'help':
  default:
    console.log(`
Usage: node view-logs.js [command] [lines]

Commands:
  access [lines]  - View access logs (default: 50 lines)
  error [lines]   - View error logs
  security [lines] - View security logs
  analyze         - Analyze security logs
  help            - Show this help

Examples:
  node view-logs.js access 100
  node view-logs.js security
  node view-logs.js analyze
    `);
}
