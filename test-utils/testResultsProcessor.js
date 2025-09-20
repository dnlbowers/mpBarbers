/**
 * Test Results Processor
 * 
 * @description Custom test results processor for enhanced reporting and analytics.
 * Processes Jest test results to provide additional insights, performance metrics,
 * and integration with CI/CD pipelines.
 */

const fs = require('fs');
const path = require('path');

/**
 * Processes Jest test results for custom reporting
 * 
 * @description Analyzes test results to provide enhanced reporting including
 * performance metrics, coverage analysis, and integration with external systems.
 * 
 * @param {Object} results - Jest test results object
 * @returns {Object} Processed results object
 */
module.exports = (results) => {
  const {
    numTotalTests,
    numPassedTests,
    numFailedTests,
    numPendingTests,
    testResults,
    startTime,
    success
  } = results;

  // Calculate test execution metrics
  const totalTime = Date.now() - startTime;
  const passRate = numTotalTests > 0 ? (numPassedTests / numTotalTests) * 100 : 0;
  
  // Analyze test performance
  const performanceMetrics = analyzeTestPerformance(testResults);
  
  // Generate summary report
  const summary = {
    timestamp: new Date().toISOString(),
    execution: {
      totalTests: numTotalTests,
      passedTests: numPassedTests,
      failedTests: numFailedTests,
      pendingTests: numPendingTests,
      totalTime: totalTime,
      passRate: passRate.toFixed(2),
      success: success
    },
    performance: performanceMetrics,
    coverage: extractCoverageMetrics(results),
    slowTests: findSlowTests(testResults),
    failedTests: extractFailedTests(testResults)
  };

  // Write detailed report
  writeTestReport(summary);
  
  // Log summary to console
  console.log('\n📊 Test Execution Summary:');
  console.log(`   Total Tests: ${numTotalTests}`);
  console.log(`   Passed: ${numPassedTests} (${passRate.toFixed(1)}%)`);
  console.log(`   Failed: ${numFailedTests}`);
  console.log(`   Pending: ${numPendingTests}`);
  console.log(`   Execution Time: ${(totalTime / 1000).toFixed(2)}s`);
  
  if (performanceMetrics.slowestTest) {
    console.log(`   Slowest Test: ${performanceMetrics.slowestTest.name} (${performanceMetrics.slowestTest.duration}ms)`);
  }
  
  console.log(`   Average Test Duration: ${performanceMetrics.averageDuration.toFixed(2)}ms`);
  
  if (numFailedTests > 0) {
    console.log('\n❌ Failed Tests:');
    summary.failedTests.forEach(test => {
      console.log(`   • ${test.name}: ${test.message}`);
    });
  }
  
  console.log(''); // Empty line for better readability

  return results;
};

/**
 * Analyzes test performance metrics
 * 
 * @description Calculates performance statistics from test execution data
 * including duration analysis, memory usage, and performance bottlenecks.
 * 
 * @param {Array} testResults - Array of test result objects
 * @returns {Object} Performance metrics object
 */
function analyzeTestPerformance(testResults) {
  const durations = [];
  let slowestTest = null;
  let fastestTest = null;
  let totalMemoryUsage = 0;
  let testCount = 0;

  testResults.forEach(testFile => {
    const duration = testFile.perfStats.end - testFile.perfStats.start;
    durations.push(duration);
    
    if (!slowestTest || duration > slowestTest.duration) {
      slowestTest = {
        name: testFile.testFilePath.replace(process.cwd(), ''),
        duration: duration
      };
    }
    
    if (!fastestTest || duration < fastestTest.duration) {
      fastestTest = {
        name: testFile.testFilePath.replace(process.cwd(), ''),
        duration: duration
      };
    }
    
    // Estimate memory usage (basic approximation)
    if (testFile.memoryUsage) {
      totalMemoryUsage += testFile.memoryUsage;
    }
    
    testCount += testFile.numPassingTests + testFile.numFailingTests;
  });

  const averageDuration = durations.length > 0 
    ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length 
    : 0;

  const medianDuration = durations.length > 0 
    ? durations.sort((a, b) => a - b)[Math.floor(durations.length / 2)]
    : 0;

  return {
    averageDuration,
    medianDuration,
    slowestTest,
    fastestTest,
    totalDuration: durations.reduce((sum, duration) => sum + duration, 0),
    estimatedMemoryUsage: totalMemoryUsage,
    testsPerSecond: testCount > 0 ? (testCount / (averageDuration / 1000)).toFixed(2) : 0
  };
}

/**
 * Extracts coverage metrics from test results
 * 
 * @description Processes coverage data to provide meaningful metrics
 * about code coverage across different categories.
 * 
 * @param {Object} results - Jest test results object
 * @returns {Object} Coverage metrics object
 */
function extractCoverageMetrics(results) {
  if (!results.coverageMap) {
    return {
      enabled: false,
      message: 'Coverage not collected'
    };
  }

  const coverage = results.coverageMap.getCoverageSummary();
  
  return {
    enabled: true,
    statements: {
      covered: coverage.statements.covered,
      total: coverage.statements.total,
      percentage: coverage.statements.pct
    },
    branches: {
      covered: coverage.branches.covered,
      total: coverage.branches.total,
      percentage: coverage.branches.pct
    },
    functions: {
      covered: coverage.functions.covered,
      total: coverage.functions.total,
      percentage: coverage.functions.pct
    },
    lines: {
      covered: coverage.lines.covered,
      total: coverage.lines.total,
      percentage: coverage.lines.pct
    }
  };
}

/**
 * Identifies slow-running tests
 * 
 * @description Finds tests that exceed performance thresholds
 * to help identify optimization opportunities.
 * 
 * @param {Array} testResults - Array of test result objects
 * @returns {Array} Array of slow test objects
 */
function findSlowTests(testResults) {
  const SLOW_TEST_THRESHOLD = 1000; // 1 second
  const slowTests = [];

  testResults.forEach(testFile => {
    const duration = testFile.perfStats.end - testFile.perfStats.start;
    
    if (duration > SLOW_TEST_THRESHOLD) {
      slowTests.push({
        file: testFile.testFilePath.replace(process.cwd(), ''),
        duration: duration,
        numTests: testFile.numPassingTests + testFile.numFailingTests
      });
    }
  });

  return slowTests.sort((a, b) => b.duration - a.duration);
}

/**
 * Extracts failed test information
 * 
 * @description Collects detailed information about failed tests
 * including error messages and stack traces for debugging.
 * 
 * @param {Array} testResults - Array of test result objects
 * @returns {Array} Array of failed test objects
 */
function extractFailedTests(testResults) {
  const failedTests = [];

  testResults.forEach(testFile => {
    testFile.testResults.forEach(test => {
      if (test.status === 'failed') {
        failedTests.push({
          file: testFile.testFilePath.replace(process.cwd(), ''),
          name: test.fullName,
          message: test.failureMessages[0] || 'Unknown error',
          duration: test.duration
        });
      }
    });
  });

  return failedTests;
}

/**
 * Writes comprehensive test report to file
 * 
 * @description Creates detailed JSON and HTML reports for test results
 * that can be used by CI/CD systems and for historical analysis.
 * 
 * @param {Object} summary - Test execution summary object
 */
function writeTestReport(summary) {
  const reportsDir = path.join(process.cwd(), 'test-reports');
  
  // Ensure reports directory exists
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // Write JSON report
  const jsonReportPath = path.join(reportsDir, 'test-summary.json');
  fs.writeFileSync(jsonReportPath, JSON.stringify(summary, null, 2));

  // Write HTML report
  const htmlReport = generateHTMLReport(summary);
  const htmlReportPath = path.join(reportsDir, 'test-summary.html');
  fs.writeFileSync(htmlReportPath, htmlReport);

  // Write performance metrics for trending
  const metricsPath = path.join(reportsDir, 'performance-metrics.json');
  const existingMetrics = fs.existsSync(metricsPath) 
    ? JSON.parse(fs.readFileSync(metricsPath, 'utf8'))
    : [];
  
  existingMetrics.push({
    timestamp: summary.timestamp,
    execution: summary.execution,
    performance: summary.performance
  });

  // Keep only last 30 runs
  const recentMetrics = existingMetrics.slice(-30);
  fs.writeFileSync(metricsPath, JSON.stringify(recentMetrics, null, 2));
}

/**
 * Gets CSS class based on pass rate
 *
 * @description Helper function to determine the appropriate CSS class
 * for pass rate display based on performance thresholds.
 *
 * @param {number} passRate - The test pass rate percentage
 * @returns {string} CSS class name
 */
function getPassRateClass(passRate) {
  if (passRate >= 90) return 'success';
  if (passRate >= 70) return 'warning';
  return 'danger';
}

/**
 * Generates HTML report from test summary
 *
 * @description Creates a formatted HTML report for easy viewing
 * of test results and metrics in web browsers.
 *
 * @param {Object} summary - Test execution summary object
 * @returns {string} HTML report string
 */
function generateHTMLReport(summary) {
  const { execution, performance, slowTests, failedTests } = summary;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Test Report - ${summary.timestamp}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .metric { display: inline-block; margin: 10px; padding: 15px; background: white; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .success { color: #28a745; }
        .warning { color: #ffc107; }
        .danger { color: #dc3545; }
        .section { margin: 20px 0; }
        .test-list { list-style: none; padding: 0; }
        .test-item { padding: 10px; border-left: 4px solid #dc3545; margin: 5px 0; background: #f8f9fa; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Test Execution Report</h1>
        <p><strong>Generated:</strong> ${new Date(summary.timestamp).toLocaleString()}</p>
        <p><strong>Status:</strong> <span class="${execution.success ? 'success' : 'danger'}">${execution.success ? 'PASSED' : 'FAILED'}</span></p>
      </div>

      <div class="section">
        <h2>Execution Summary</h2>
        <div class="metric">
          <h3>Total Tests</h3>
          <p>${execution.totalTests}</p>
        </div>
        <div class="metric">
          <h3>Pass Rate</h3>
          <p class="${getPassRateClass(execution.passRate)}">${execution.passRate}%</p>
        </div>
        <div class="metric">
          <h3>Execution Time</h3>
          <p>${(execution.totalTime / 1000).toFixed(2)}s</p>
        </div>
      </div>

      <div class="section">
        <h2>Performance Metrics</h2>
        <div class="metric">
          <h3>Average Duration</h3>
          <p>${performance.averageDuration.toFixed(2)}ms</p>
        </div>
        <div class="metric">
          <h3>Tests per Second</h3>
          <p>${performance.testsPerSecond}</p>
        </div>
      </div>

      ${failedTests.length > 0 ? `
        <div class="section">
          <h2>Failed Tests</h2>
          <ul class="test-list">
            ${failedTests.map(test => `
              <li class="test-item">
                <strong>${test.name}</strong><br>
                <small>${test.file}</small><br>
                <em>${test.message.substring(0, 200)}...</em>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      ${slowTests.length > 0 ? `
        <div class="section">
          <h2>Slow Tests</h2>
          <ul class="test-list">
            ${slowTests.map(test => `
              <li class="test-item">
                <strong>${test.file}</strong><br>
                Duration: ${test.duration}ms (${test.numTests} tests)
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}
    </body>
    </html>
  `;
}
