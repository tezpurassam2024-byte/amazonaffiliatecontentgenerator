import { ConvexReactClient } from 'convex/react';
import { Article, UserProfile, AppointmentBooking } from '../types';
import { api } from '../../convex/_generated/api';

export const CONVEX_CLOUD_URL = 'https://fantastic-koala-937.convex.cloud';

const envConvexUrl = import.meta.env.VITE_CONVEX_URL;
const convexUrl = (envConvexUrl && envConvexUrl.trim()) ? envConvexUrl.trim() : CONVEX_CLOUD_URL;

export const isConvexConfigured = Boolean(convexUrl && convexUrl.startsWith('http'));

export const convexClient = isConvexConfigured
  ? new ConvexReactClient(convexUrl)
  : null;

// Local persistent state manager for offline/demo/unconfigured modes
const STORAGE_KEYS = {
  USER: 'amz_affiliate_user',
  ARTICLES: 'amz_affiliate_articles',
  SETTINGS: 'amz_affiliate_settings',
  LOGS: 'amz_affiliate_logs',
  APPOINTMENTS: 'amz_affiliate_appointments',
};

const DEFAULT_USER: UserProfile = {
  id: 'usr_demo_101',
  email: 'creator@example.com',
  name: 'Alex Rivera',
  plan: 'pro',
  generations_used: 3,
  generations_limit: 50,
  amazon_associate_tag: 'affiliate-20',
  default_marketplace: 'com',
  is_admin: true,
  created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
};

export const localDb = {
  getUser(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (stored) return JSON.parse(stored);
    } catch {}
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
    return DEFAULT_USER;
  },

  updateUser(updates: Partial<UserProfile>): UserProfile {
    const current = this.getUser();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));

    // If Convex is connected, push update in background
    if (convexClient && updated.email) {
      try {
        convexClient.mutation(api.users.update, {
          email: updated.email,
          name: updated.name,
          plan: updated.plan,
          generations_used: updated.generations_used,
          generations_limit: updated.generations_limit,
          amazon_associate_tag: updated.amazon_associate_tag,
          default_marketplace: updated.default_marketplace,
        }).catch((err: any) => console.warn('Convex background sync note:', err.message));
      } catch {}
    }

    return updated;
  },

  getArticles(): Article[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  },

  saveArticle(article: Article): Article {
    const list = this.getArticles();
    const index = list.findIndex((a) => a.id === article.id);
    const updatedArticle = {
      ...article,
      updated_at: new Date().toISOString(),
      created_at: article.created_at || new Date().toISOString(),
    };

    if (index >= 0) {
      list[index] = updatedArticle;
    } else {
      list.unshift(updatedArticle);
    }
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(list));

    // If Convex is connected, push article save mutation in background
    if (convexClient) {
      try {
        const user = this.getUser();
        convexClient.mutation(api.articles.save, {
          user_id: user.id || 'anonymous',
          title: updatedArticle.title,
          status: updatedArticle.status,
          product: updatedArticle.product,
          content: updatedArticle.content,
          options: updatedArticle.options,
        }).catch((err: any) => console.warn('Convex save background note:', err.message));
      } catch {}
    }

    return updatedArticle;
  },

  deleteArticle(id: string): void {
    const list = this.getArticles().filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(list));
  },

  incrementGenerationCount(): void {
    const user = this.getUser();
    this.updateUser({ generations_used: user.generations_used + 1 });

    if (convexClient && user.email) {
      try {
        convexClient.mutation(api.users.incrementUsage, { email: user.email })
          .catch((err: any) => console.warn('Convex increment background note:', err.message));
      } catch {}
    }
  },

  addLog(type: 'info' | 'warn' | 'error', message: string): void {
    try {
      const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
      const newLog = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        type,
        message,
      };
      logs.unshift(newLog);
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs.slice(0, 50)));

      if (convexClient) {
        convexClient.mutation(api.logs.add, { type, message })
          .catch(() => {});
      }
    } catch {}
  },

  getLogs() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
    } catch {
      return [];
    }
  },

  getAppointments(): AppointmentBooking[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  },

  saveAppointment(appointment: AppointmentBooking): AppointmentBooking {
    const list = this.getAppointments();
    const index = list.findIndex((a) => (a.id && a.id === appointment.id) || (a._id && a._id === appointment._id));
    if (index >= 0) {
      list[index] = appointment;
    } else {
      list.unshift(appointment);
    }
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
    return appointment;
  },

  updateAppointmentStatus(id: string, status: AppointmentBooking['status']): void {
    const list = this.getAppointments();
    const found = list.find((a) => a.id === id || a._id === id);
    if (found) {
      found.status = status;
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
    }

    if (convexClient && id.startsWith('k')) {
      try {
        convexClient.mutation(api.appointments.updateStatus, {
          id: id as any,
          status,
        }).catch((err: any) => console.warn('Convex update appointment status note:', err.message));
      } catch {}
    }
  },

  deleteAppointment(id: string): void {
    const list = this.getAppointments().filter((a) => a.id !== id && a._id !== id);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));

    if (convexClient && id.startsWith('k')) {
      try {
        convexClient.mutation(api.appointments.remove, { id: id as any })
          .catch((err: any) => console.warn('Convex delete appointment note:', err.message));
      } catch {}
    }
  },
};

/**
 * Submit appointment booking directly to Convex backend tables
 */
export async function submitAppointmentBooking(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service_type: string;
  date: string;
  time_slot: string;
  timezone?: string;
  notes?: string;
}): Promise<{ success: boolean; id: string; savedInConvex: boolean; message: string }> {
  const localId = `apt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  let convexId: string | null = null;
  let savedInConvex = false;

  if (convexClient) {
    try {
      const res: any = await convexClient.mutation(api.appointments.book, {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        company: data.company || undefined,
        service_type: data.service_type,
        date: data.date,
        time_slot: data.time_slot,
        timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        notes: data.notes || undefined,
      });

      if (res && res.appointmentId) {
        convexId = res.appointmentId;
        savedInConvex = true;
      }
    } catch (err: any) {
      console.error('Failed to save in Convex appointment table:', err);
    }
  }

  const finalId = convexId || localId;
  const savedAppointment: AppointmentBooking = {
    id: finalId,
    _id: convexId || undefined,
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    service_type: data.service_type,
    date: data.date,
    time_slot: data.time_slot,
    timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    notes: data.notes,
    status: 'pending',
    created_at: now,
  };

  localDb.saveAppointment(savedAppointment);
  localDb.addLog(
    'info',
    `Appointment scheduled: ${data.name} for ${data.service_type} on ${data.date} (Convex synced: ${savedInConvex})`
  );

  return {
    success: true,
    id: finalId,
    savedInConvex,
    message: savedInConvex
      ? 'Appointment successfully booked and saved to Convex backend table!'
      : 'Appointment saved locally (will sync with Convex once reconnected)',
  };
}


