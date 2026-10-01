import { Response, NextFunction } from 'express';
import { CustomRequest } from './authMiddleware.js';

const SAFE_ID = /^[a-zA-Z0-9._-]{1,128}$/;
const CODE = /^[A-Z0-9._-]{2,64}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function bad(res: Response, message: string) {
  return res.status(400).json({ success: false, error: 'BAD_REQUEST', message });
}

export function validateCreateAccountBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (typeof body.code !== 'string' || !CODE.test(body.code.trim().toUpperCase())) return bad(res, 'code must be 2-64 characters.');
  if (typeof body.name !== 'string' || body.name.trim().length < 2) return bad(res, 'name is required.');
  const categories = new Set(['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE']);
  if (!categories.has(body.category)) return bad(res, 'category must be ASSET, LIABILITY, EQUITY, REVENUE, or EXPENSE.');
  req.body = { code: body.code.trim().toUpperCase(), name: body.name.trim(), category: body.category, parentAccountId: body.parentAccountId, description: body.description };
  next();
}

export function validateCreateFinanceTransactionBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (typeof body.transactionNumber !== 'string' || !CODE.test(body.transactionNumber.trim().toUpperCase())) return bad(res, 'transactionNumber is required.');
  req.body = { transactionNumber: body.transactionNumber.trim().toUpperCase() };
  next();
}

export function validateCreateInvoiceBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (typeof body.invoiceNumber !== 'string' || !CODE.test(body.invoiceNumber.trim().toUpperCase())) return bad(res, 'invoiceNumber is required.');
  if (typeof body.customerId !== 'string' || !SAFE_ID.test(body.customerId)) return bad(res, 'Invalid customerId.');
  if (!DATE.test(body.invoiceDate)) return bad(res, 'invoiceDate must be YYYY-MM-DD.');
  if (!DATE.test(body.dueDate)) return bad(res, 'dueDate must be YYYY-MM-DD.');
  if (!Array.isArray(body.lines) || body.lines.length === 0) return bad(res, 'lines must be a non-empty array.');
  for (const line of body.lines) {
    if (!line || typeof line.description !== 'string' || line.description.trim().length < 1) return bad(res, 'Each line requires description.');
    if (typeof line.quantity !== 'number' || line.quantity <= 0) return bad(res, 'Each line quantity must be positive.');
    if (typeof line.unitPrice !== 'number' || line.unitPrice < 0) return bad(res, 'Each line unitPrice must be non-negative.');
  }
  req.body = {
    invoiceNumber: body.invoiceNumber.trim().toUpperCase(),
    customerId: body.customerId,
    orderId: body.orderId,
    invoiceDate: body.invoiceDate,
    dueDate: body.dueDate,
    lines: body.lines,
    discountAmount: body.discountAmount,
    notes: body.notes,
    issueImmediately: body.issueImmediately
  };
  next();
}

export function validateCreatePaymentBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (typeof body.paymentNumber !== 'string' || !CODE.test(body.paymentNumber.trim().toUpperCase())) return bad(res, 'paymentNumber is required.');
  if (typeof body.invoiceId !== 'string' || !SAFE_ID.test(body.invoiceId)) return bad(res, 'Invalid invoiceId.');
  if (typeof body.amount !== 'number' || body.amount <= 0) return bad(res, 'amount must be positive.');
  if (!DATE.test(body.paymentDate)) return bad(res, 'paymentDate must be YYYY-MM-DD.');
  const methods = new Set(['CASH', 'BANK_TRANSFER', 'CHEQUE', 'UPI', 'CARD', 'OTHER']);
  if (!methods.has(body.paymentMethod)) return bad(res, 'Invalid paymentMethod.');
  req.body = {
    paymentNumber: body.paymentNumber.trim().toUpperCase(),
    invoiceId: body.invoiceId,
    amount: body.amount,
    paymentDate: body.paymentDate,
    paymentMethod: body.paymentMethod,
    paymentReference: body.paymentReference,
    notes: body.notes
  };
  next();
}

export function validateCreateExpenseBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (typeof body.expenseNumber !== 'string' || !CODE.test(body.expenseNumber.trim().toUpperCase())) return bad(res, 'expenseNumber is required.');
  if (typeof body.category !== 'string' || body.category.trim().length < 2) return bad(res, 'category is required.');
  if (typeof body.amount !== 'number' || body.amount <= 0) return bad(res, 'amount must be positive.');
  if (!DATE.test(body.expenseDate)) return bad(res, 'expenseDate must be YYYY-MM-DD.');
  req.body = {
    expenseNumber: body.expenseNumber.trim().toUpperCase(),
    category: body.category.trim(),
    amount: body.amount,
    expenseDate: body.expenseDate,
    vendorName: body.vendorName,
    reference: body.reference,
    attachmentRef: body.attachmentRef,
    notes: body.notes
  };
  next();
}
