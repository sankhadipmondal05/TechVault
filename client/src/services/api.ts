import axios from 'axios';
import { ICategory, ISubject, ICourse, IOneShot } from '../types';

const apiBaseUrl = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// In-memory cache & request deduplication for ultra-fast database pulls
const cache = new Map<string, { data: any; expiry: number }>();
const pendingRequests = new Map<string, Promise<any>>();
const CACHE_TTL_MS = 45 * 1000; // 45 seconds

async function cachedGet<T>(url: string, params?: any): Promise<T> {
  const cacheKey = `${url}:${params ? JSON.stringify(params) : ''}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);

  if (cached && cached.expiry > now) {
    return cached.data as T;
  }

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey) as Promise<T>;
  }

  const promise = api
    .get<T>(url, { params })
    .then((res) => {
      cache.set(cacheKey, { data: res.data, expiry: Date.now() + CACHE_TTL_MS });
      pendingRequests.delete(cacheKey);
      return res.data;
    })
    .catch((err) => {
      pendingRequests.delete(cacheKey);
      throw err;
    });

  pendingRequests.set(cacheKey, promise);
  return promise;
}

export const apiService = {
  // Categories
  getCategories: async () => {
    const res = await cachedGet<{ success: boolean; data: ICategory[] }>('/categories');
    return res.data;
  },

  // Subjects
  getSubjects: async (params?: { category?: string; featured?: boolean; search?: string }) => {
    const res = await cachedGet<{ success: boolean; count: number; data: ISubject[] }>('/subjects', params);
    return res.data;
  },
  getSubjectBySlug: async (slug: string) => {
    const res = await cachedGet<{ success: boolean; data: ISubject }>(`/subjects/${slug}`);
    return res.data;
  },

  // Courses
  getCourses: async (params?: {
    subject?: string;
    subjectSlug?: string;
    level?: string;
    language?: string;
    featured?: boolean;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    return cachedGet<{
      success: boolean;
      count: number;
      total: number;
      totalPages: number;
      currentPage: number;
      data: ICourse[];
    }>('/courses', params);
  },
  getCourseBySlug: async (slug: string) => {
    const res = await cachedGet<{ success: boolean; data: ICourse }>(`/courses/${slug}`);
    return res.data;
  },
  getCoursesBySubject: async (subjectSlug: string) => {
    const res = await cachedGet<{ success: boolean; count: number; data: ICourse[] }>(`/courses/subject/${subjectSlug}`);
    return res.data;
  },

  // One-Shots
  getOneShots: async (params?: {
    subject?: string;
    subjectSlug?: string;
    level?: string;
    language?: string;
    featured?: boolean;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    return cachedGet<{
      success: boolean;
      count: number;
      total: number;
      totalPages: number;
      currentPage: number;
      data: IOneShot[];
    }>('/one-shots', params);
  },
  getOneShotBySlug: async (slug: string) => {
    return cachedGet<{ success: boolean; data: IOneShot; related: IOneShot[] }>(`/one-shots/${slug}`);
  },
  getOneShotsBySubject: async (subjectSlug: string) => {
    const res = await cachedGet<{ success: boolean; count: number; data: IOneShot[] }>(`/one-shots/subject/${subjectSlug}`);
    return res.data;
  },

  // Global Search
  search: async (params: { q: string; type?: 'all' | 'course' | 'one-shot' | 'subject'; subject?: string; level?: string }) => {
    return cachedGet<{
      success: boolean;
      query: string;
      counts: { total: number; courses: number; oneShots: number; subjects: number };
      data: { courses: ICourse[]; oneShots: IOneShot[]; subjects: ISubject[] };
    }>('/search', params);
  }
};
