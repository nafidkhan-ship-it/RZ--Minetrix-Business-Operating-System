/**
 * OTT - Organise Today & Tomorrow
 * Express REST API Router (/api/v1/ott/*)
 */

import { Router, Request, Response } from 'express';
import { ottService, OTT_DEMO_USERS } from '../services/ottService.js';
import { WorkspaceContext, TaskStatus } from '../../types/ottTypes.js';

export const ottRouter = Router();

// Helper to get active user
function getUserId(req: Request): string {
  return (req.query.userId as string) || (req as any).user?.id || 'USR-1001';
}

// 1. Get My Day Metrics
ottRouter.get('/my-day', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const workspace = (req.query.workspace as WorkspaceContext) || 'ALL';
    const metrics = ottService.getMyDayMetrics(userId, workspace);
    const schedule = ottService.getScheduleRecommendation(userId);
    res.json({
      success: true,
      data: {
        metrics,
        schedule,
        user: OTT_DEMO_USERS.find(u => u.id === userId) || OTT_DEMO_USERS[0]
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Get Schedule Recommendations
ottRouter.get('/schedule', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const schedule = ottService.getScheduleRecommendation(userId);
    res.json({ success: true, data: schedule });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Get Tasks with Filters
ottRouter.get('/tasks', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const workspace = req.query.workspace as WorkspaceContext;
    const filter = req.query.filter as any;
    const search = req.query.search as string;

    const tasks = ottService.getTasks({
      userId,
      workspace,
      filter,
      search
    });

    res.json({ success: true, data: tasks });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Get Task by ID
ottRouter.get('/tasks/:id', (req: Request, res: Response) => {
  try {
    const task = ottService.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, data: task });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Create Task (with auto-request generation if assigned to others)
ottRouter.post('/tasks', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const result = ottService.createTask(req.body, userId);
    res.status(201).json({
      success: true,
      data: result.task,
      request: result.request,
      message: result.request
        ? `Task assignment request sent to ${result.task.assignedTo.name}`
        : 'Task created successfully'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Update Task Status
ottRouter.patch('/tasks/:id/status', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, error: 'Status is required' });

    const task = ottService.updateTaskStatus(req.params.id, status as TaskStatus, userId);
    res.json({ success: true, data: task, message: `Status updated to ${status}` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Toggle Checklist Item
ottRouter.patch('/tasks/:id/checklist/:itemId', (req: Request, res: Response) => {
  try {
    const task = ottService.toggleChecklistItem(req.params.id, req.params.itemId);
    res.json({ success: true, data: task });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Add Note
ottRouter.post('/tasks/:id/notes', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, error: 'Note text required' });

    const task = ottService.addNote(req.params.id, text, userId);
    res.json({ success: true, data: task });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Send Gentle Follow-up
ottRouter.post('/tasks/:id/follow-up', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { message } = req.body;
    const result = ottService.sendFollowUp(req.params.id, userId, message);
    res.json({
      success: true,
      data: result.task,
      message: `Gentle reminder sent to ${result.task.assignedTo.name}. Follow-up count: ${result.task.followUpCount}`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. Get Assignment Requests (Incoming & Outgoing)
ottRouter.get('/requests', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const requests = ottService.getRequests(userId);
    res.json({ success: true, data: requests });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. Respond to Assignment Request (Accept / Decline)
ottRouter.post('/requests/:id/respond', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { action, note } = req.body;
    if (!action || (action !== 'ACCEPT' && action !== 'DECLINE')) {
      return res.status(400).json({ success: false, error: 'Action must be ACCEPT or DECLINE' });
    }

    const request = ottService.respondToRequest(req.params.id, action, note, userId);
    res.json({
      success: true,
      data: request,
      message: action === 'ACCEPT' ? 'Task assignment accepted' : 'Task assignment declined'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 12. Productivity Reports & Time Allocation
ottRouter.get('/reports', (req: Request, res: Response) => {
  try {
    const period = (req.query.period as any) || 'DAILY';
    const workspace = (req.query.workspace as WorkspaceContext) || 'ALL';
    const reports = ottService.getReports(period, workspace);
    res.json({ success: true, data: reports });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 13. Minetrix BOS Integration Sync
ottRouter.post('/minetrix-sync', (req: Request, res: Response) => {
  try {
    const task = ottService.syncFromMinetrixBOS(req.body);
    res.status(201).json({
      success: true,
      data: task,
      message: `Task synchronized from Minetrix ${req.body.module} module`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 14. Get Contacts & Relationships
ottRouter.get('/contacts', (_req: Request, res: Response) => {
  res.json({ success: true, data: OTT_DEMO_USERS });
});
