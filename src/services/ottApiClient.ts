/**
 * OTT - Organise Today & Tomorrow
 * Frontend API Client & State Synchronization Service
 */

import {
  TaskItem,
  TaskRequest,
  MyDayMetrics,
  ScheduleRecommendation,
  OTTReportData,
  WorkspaceContext,
  UserRef,
  TaskStatus
} from '../types/ottTypes';

class OTTApiClient {
  private baseUrl = '/api/v1/ott';

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        ...options
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${res.status}`);
      }

      const json = await res.json();
      return json.data !== undefined ? json.data : json;
    } catch (err: any) {
      console.warn(`[OTTApiClient] Request to ${url} failed:`, err.message);
      throw err;
    }
  }

  // 1. Get My Day
  public async getMyDay(userId?: string, workspace?: WorkspaceContext): Promise<{ metrics: MyDayMetrics; schedule: ScheduleRecommendation; user: UserRef }> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (workspace && workspace !== 'ALL') params.append('workspace', workspace);
    return this.request<{ metrics: MyDayMetrics; schedule: ScheduleRecommendation; user: UserRef }>(`/my-day?${params.toString()}`);
  }

  // 2. Get Tasks with filter
  public async getTasks(params?: { userId?: string; workspace?: WorkspaceContext; filter?: string; search?: string }): Promise<TaskItem[]> {
    const q = new URLSearchParams();
    if (params?.userId) q.append('userId', params.userId);
    if (params?.workspace && params?.workspace !== 'ALL') q.append('workspace', params.workspace);
    if (params?.filter) q.append('filter', params.filter);
    if (params?.search) q.append('search', params.search);
    return this.request<TaskItem[]>(`/tasks?${q.toString()}`);
  }

  // 3. Get Task by ID
  public async getTaskById(taskId: string): Promise<TaskItem> {
    return this.request<TaskItem>(`/tasks/${taskId}`);
  }

  // 4. Create Task
  public async createTask(input: Partial<TaskItem>, userId?: string): Promise<TaskItem> {
    const q = userId ? `?userId=${userId}` : '';
    return this.request<TaskItem>(`/tasks${q}`, {
      method: 'POST',
      body: JSON.stringify(input)
    });
  }

  // 5. Update Task Status
  public async updateStatus(taskId: string, status: TaskStatus, userId?: string): Promise<TaskItem> {
    return this.request<TaskItem>(`/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, userId })
    });
  }

  // 6. Toggle Checklist
  public async toggleChecklist(taskId: string, itemId: string): Promise<TaskItem> {
    return this.request<TaskItem>(`/tasks/${taskId}/checklist/${itemId}`, {
      method: 'PATCH'
    });
  }

  // 7. Add Note
  public async addNote(taskId: string, text: string, userId?: string): Promise<TaskItem> {
    return this.request<TaskItem>(`/tasks/${taskId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ text, userId })
    });
  }

  // 8. Send Gentle Follow-up
  public async sendFollowUp(taskId: string, message?: string, userId?: string): Promise<TaskItem> {
    return this.request<TaskItem>(`/tasks/${taskId}/follow-up`, {
      method: 'POST',
      body: JSON.stringify({ message, userId })
    });
  }

  // 9. Get Requests
  public async getRequests(userId?: string): Promise<{ incoming: TaskRequest[]; outgoing: TaskRequest[] }> {
    const q = userId ? `?userId=${userId}` : '';
    return this.request<{ incoming: TaskRequest[]; outgoing: TaskRequest[] }>(`/requests${q}`);
  }

  // 10. Respond to Request
  public async respondRequest(requestId: string, action: 'ACCEPT' | 'DECLINE', note?: string, userId?: string): Promise<TaskRequest> {
    return this.request<TaskRequest>(`/requests/${requestId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ action, note, userId })
    });
  }

  // 11. Get Reports
  public async getReports(period: 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'DAILY', workspace?: WorkspaceContext): Promise<OTTReportData> {
    const q = new URLSearchParams({ period });
    if (workspace && workspace !== 'ALL') q.append('workspace', workspace);
    return this.request<OTTReportData>(`/reports?${q.toString()}`);
  }

  // 12. Get Contacts
  public async getContacts(): Promise<UserRef[]> {
    return this.request<UserRef[]>('/contacts');
  }

  // 13. Sync from Minetrix BOS
  public async syncMinetrixTask(payload: any): Promise<TaskItem> {
    return this.request<TaskItem>('/minetrix-sync', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
}

export const ottApiClient = new OTTApiClient();
