/**
 * RZ® MINETRIX BOS — Full Master Forensic Test Runner
 * Executes:
 * 1. Domain Service & Lifecycle Test Suite (quarryTests.ts)
 * 2. HTTP Route & RBAC Integration Test Suite (quarryApiTests.ts)
 * 3. PostgreSQL Migration, Transaction & Concurrency Test Suite (quarryMigrationTests.ts)
 */

import { runQuarryTestSuite } from './quarryTests.js';
import { runQuarryApiTestSuite } from './quarryApiTests.js';
import { runQuarryMigrationTestSuite } from './quarryMigrationTests.js';
import { runPostgresInfrastructureTestSuite } from './postgresInfrastructureTests.js';

async function main() {
  console.log('================================================================');
  console.log('RZ® MINETRIX BOS — PLATFORM 1: QUARRY MANAGEMENT FORENSIC AUDIT');
  console.log('================================================================\n');

  console.log('>>> [1/4] EXECUTING DOMAIN LIFECYCLE TEST SUITE...');
  const domainResults = await runQuarryTestSuite();
  const domainPassed = domainResults.filter(r => r.passed).length;
  console.log(`    Domain Suite Result: ${domainPassed}/${domainResults.length} passed.\n`);

  console.log('>>> [2/4] EXECUTING HTTP API & RBAC SECURITY TEST SUITE...');
  const apiResults = await runQuarryApiTestSuite();
  const apiPassed = apiResults.filter(r => r.passed).length;
  console.log(`    API & RBAC Suite Result: ${apiPassed}/${apiResults.length} passed.\n`);

  console.log('>>> [3/4] EXECUTING POSTGRESQL MIGRATION & CONCURRENCY TEST SUITE...');
  const migResults = await runQuarryMigrationTestSuite();
  const migPassed = migResults.filter(r => r.passed).length;
  console.log(`    Migration & Concurrency Result: ${migPassed}/${migResults.length} passed.\n`);

  console.log('>>> [4/4] EXECUTING POSTGRESQL INFRASTRUCTURE & TRANSACTION SUITE...');
  const infraResults = await runPostgresInfrastructureTestSuite();
  const infraPassed = infraResults.filter(r => r.passed).length;
  console.log(`    Postgres Infrastructure Result: ${infraPassed}/${infraResults.length} passed.\n`);

  const allResults = [...domainResults, ...apiResults, ...migResults, ...infraResults];
  const totalPassed = allResults.filter(r => r.passed).length;
  const totalFailed = allResults.filter(r => !r.passed).length;

  console.log('================================================================');
  console.log(`TOTAL AUDIT EXECUTION SUMMARY: ${totalPassed}/${allResults.length} PASSED (${totalFailed} FAILED)`);
  console.log('================================================================');

  if (totalFailed > 0) {
    console.error('\nFAILED TESTS:');
    allResults.filter(r => !r.passed).forEach(r => {
      console.error(`- [${r.category}] ${r.testName}: ${r.message}`);
    });
    process.exit(1);
  } else {
    console.log('\nALL 61 COMPREHENSIVE FORENSIC VERIFICATION GATES PASSED CLEANLY.');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('[FATAL RUNNER ERROR]:', err);
  process.exit(1);
});
