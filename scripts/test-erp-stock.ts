#!/usr/bin/env tsx
import 'dotenv/config';
import { runErpStockApiTests } from '../src/server/tests/erpStockApiTests.js';

runErpStockApiTests()
  .then((report) => {
    if (report.skipped) {
      console.log(`SKIPPED: ${report.skipReason}`);
      process.exit(0);
    }
    console.log(`ERP Stock API Tests: ${report.passedCount}/${report.totalTests} passed`);
    for (const result of report.results) {
      console.log(`${result.passed ? 'PASS' : 'FAIL'} ${result.testName}`);
      if (!result.passed) console.log(`  -> ${result.message}`);
    }
    process.exit(report.failedCount > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error('ERP stock test runner failed:', error);
    process.exit(1);
  });
