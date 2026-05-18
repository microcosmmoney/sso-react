import { DEFAULT_CHECK_EMAIL_URL } from './projects';
import type { CheckEmailResponse } from './types';

const ALREADY_REGISTERED_PATTERNS: RegExp[] = [
  /email\s+(is\s+)?already\s+(registered|in\s+use|exists)/i,
  /account\s+(is\s+)?already\s+(registered|exists)/i,
  /already\s+have\s+an?\s+account/i,
  /\u90ae\u7bb1.*(\u5df2\u6ce8\u518c|\u5df2\u5b58\u5728|\u5df2\u88ab\u4f7f\u7528)/,
  /\u8d26\u53f7.*(\u5df2\u6ce8\u518c|\u5df2\u5b58\u5728)/,
  /\u30e1\u30fc\u30eb.*(\u65e2\u306b|\u767b\u9332\u6e08)/,
  /이미\s+(가입|등록)/,
];

export function isAlreadyRegisteredError(message: unknown): boolean {
  if (typeof message !== 'string' || !message) return false;
  return ALREADY_REGISTERED_PATTERNS.some((re) => re.test(message));
}

export interface CheckEmailOptions {
  endpoint?: string;
  signal?: AbortSignal;
}

export async function checkEmail(email: string, opts: CheckEmailOptions = {}): Promise<CheckEmailResponse> {
  const endpoint = opts.endpoint || DEFAULT_CHECK_EMAIL_URL;
  const trimmed = (email || '').trim().toLowerCase();
  if (!trimmed || !trimmed.includes('@')) {
    return { exists: false, projects: [] };
  }
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: trimmed }),
      signal: opts.signal,
    });
    if (!res.ok) return { exists: false, projects: [] };
    const data = await res.json();
    if (data && typeof data === 'object' && 'data' in data) {
      const payload = (data as { data: CheckEmailResponse }).data;
      return {
        exists: !!payload?.exists,
        projects: Array.isArray(payload?.projects) ? payload.projects : [],
      };
    }
    return {
      exists: !!data?.exists,
      projects: Array.isArray(data?.projects) ? data.projects : [],
    };
  } catch {
    return { exists: false, projects: [] };
  }
}
