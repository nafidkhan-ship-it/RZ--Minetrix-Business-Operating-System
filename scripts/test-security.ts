#!/usr/bin/env tsx
import 'dotenv/config';
import { runSecurityTests } from '../src/server/tests/securityTests.js';

runSecurityTests()
  .then((report) => {
    console.log(`Security Tests: ${report.passedCount}/${report.totalTests} passed`);
    for (const result of report.results) {
      console.log(`${result.passed ? 'PASS' : 'FAIL'} [${result.category}] ${result.testName}`);
      if (!result.passed) {
        console.log(`  -> ${result.message}`);
      }
    }
    process.exit(report.failedCount > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error('Security test runner failed:', error);
    process.exit(1);
  });
