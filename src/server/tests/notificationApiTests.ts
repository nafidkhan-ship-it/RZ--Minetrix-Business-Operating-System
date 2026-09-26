import request from 'supertest';
import { isPostgresEnabled } from '../db/postgresPool.js';
import { createErpTestApp, loginErpAdmin, loginOtherTenant, uniqueCode } from './erpTestHarness.js';
import { ModuleTestResult } from './erpProductionApiTests.js';

export async function runNotificationApiTests() {
  const executedAt = new Date().toISOString();
  if (!isPostgresEnabled()) {
    return { skipped: true, skipReason: 'DATABASE_URL is not configured', executedAt, totalTests: 0, passedCount: 0, failedCount: 0, results: [] as ModuleTestResult[] };
  }

  const app = await createErpTestApp();
  const ctx = await loginErpAdmin(app);
  const other = await loginOtherTenant(app);
  const results: ModuleTestResult[] = [];

  const created = await request(app).post('/api/v1/notifications').set(ctx.header).send({
    title: uniqueCode('NOTIF'),
    body: 'Finance invoice issued',
    type: 'INFO',
    relatedModule: 'Finance',
    relatedRecordType: 'INVOICE',
    relatedRecordId: 'test-invoice-ref'
  });
  results.push({
    testName: 'Notification creation persists',
    passed: created.status === 201 && created.body?.data?.title && !created.body?.data?.isRead,
    message: `status=${created.status}`
  });

  const list = await request(app).get('/api/v1/notifications').set(ctx.header);
  const found = list.body?.data?.notifications?.find((n: { id: string }) => n.id === created.body?.data?.id);
  results.push({
    testName: 'Notification retrieval',
    passed: list.status === 200 && found && list.body?.data?.unreadCount >= 1,
    message: `status=${list.status} unread=${list.body?.data?.unreadCount}`
  });

  const markRead = await request(app).post(`/api/v1/notifications/${created.body.data.id}/read`).set(ctx.header);
  results.push({
    testName: 'Mark notification read',
    passed: markRead.status === 200 && markRead.body?.data?.isRead === true,
    message: `status=${markRead.status}`
  });

  const second = await request(app).post('/api/v1/notifications').set(ctx.header).send({
    title: uniqueCode('NOTIF2'),
    body: 'Second notification',
    type: 'WARNING'
  });
  const markAll = await request(app).post('/api/v1/notifications/read-all').set(ctx.header);
  const afterAll = await request(app).get('/api/v1/notifications').set(ctx.header);
  results.push({
    testName: 'Mark all notifications read',
    passed: markAll.status === 200 && markAll.body?.data?.markedCount >= 1 && afterAll.body?.data?.unreadCount === 0,
    message: `status=${markAll.status} marked=${markAll.body?.data?.markedCount} unread=${afterAll.body?.data?.unreadCount}`
  });

  const otherList = await request(app).get('/api/v1/notifications').set(other.header);
  const leaked = otherList.body?.data?.notifications?.some((n: { id: string }) => n.id === created.body?.data?.id || n.id === second.body?.data?.id);
  results.push({
    testName: 'Notification tenant isolation',
    passed: otherList.status === 200 && !leaked,
    message: `status=${otherList.status} leaked=${leaked}`
  });

  const noAuth = await request(app).get('/api/v1/notifications');
  results.push({
    testName: 'Unauthorized notification access blocked',
    passed: noAuth.status === 401,
    message: `status=${noAuth.status}`
  });

  const otherMark = await request(app).post(`/api/v1/notifications/${created.body.data.id}/read`).set(other.header);
  results.push({
    testName: 'Cross-tenant cannot mark read',
    passed: otherMark.status === 404,
    message: `status=${otherMark.status}`
  });

  const passedCount = results.filter((r) => r.passed).length;
  return {
    executedAt,
    totalTests: results.length,
    passedCount,
    failedCount: results.length - passedCount,
    results
  };
}
