import { useEffect, useRef, useState } from 'react';
import { checkEmail } from '../lib/check-email';
import { findProject, SSO_PROJECTS } from '../lib/projects';
import type { SsoProject } from '../lib/types';

export interface UseExistingProjectsOptions {
  endpoint?: string;
  registry?: SsoProject[];
  debounceMs?: number;
  minEmailLength?: number;
}

export interface UseExistingProjectsResult {
  loading: boolean;
  exists: boolean;
  projects: SsoProject[];
  unknownCodes: string[];
  refresh: () => void;
}

export function useExistingProjects(
  email: string | null | undefined,
  opts: UseExistingProjectsOptions = {}
): UseExistingProjectsResult {
  const { endpoint, registry = SSO_PROJECTS, debounceMs = 400, minEmailLength = 5 } = opts;
  const [loading, setLoading] = useState(false);
  const [exists, setExists] = useState(false);
  const [codes, setCodes] = useState<string[]>([]);
  const [bump, setBump] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = (email || '').trim().toLowerCase();
    if (!trimmed || trimmed.length < minEmailLength || !trimmed.includes('@')) {
      if (abortRef.current) abortRef.current.abort();
      setLoading(false);
      setExists(false);
      setCodes([]);
      return;
    }

    setLoading(true);

    const handle = setTimeout(() => {
      if (abortRef.current) abortRef.current.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      checkEmail(trimmed, { endpoint, signal: ctrl.signal })
        .then((res) => {
          if (ctrl.signal.aborted) return;
          setExists(res.exists);
          setCodes(res.projects);
        })
        .finally(() => {
          if (!ctrl.signal.aborted) setLoading(false);
        });
    }, debounceMs);

    return () => {
      clearTimeout(handle);
    };
  }, [email, endpoint, debounceMs, minEmailLength, bump]);

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const projects: SsoProject[] = [];
  const unknown: string[] = [];
  for (const code of codes) {
    const p = findProject(code, registry);
    if (p) projects.push(p);
    else unknown.push(code);
  }

  return {
    loading,
    exists,
    projects,
    unknownCodes: unknown,
    refresh: () => setBump((n) => n + 1),
  };
}
