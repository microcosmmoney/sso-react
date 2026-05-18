import { useEffect, useState } from 'react';
import { fetchSsoProjects, SSO_PROJECTS, SSO_SERVICE_NAME, SSO_SERVICE_NAME_EN, SSO_SERVICE_HOMEPAGE } from '../lib/projects';
import type { SsoProject, SsoRegistry } from '../lib/types';

export interface UseSsoRegistryOptions {
  url?: string;
  staticOnly?: boolean;
}

export interface UseSsoRegistryResult {
  loading: boolean;
  registry: SsoRegistry;
  projects: SsoProject[];
}

const STATIC_REGISTRY: SsoRegistry = {
  version: 'static',
  updatedAt: new Date(0).toISOString(),
  serviceName: SSO_SERVICE_NAME,
  serviceNameEn: SSO_SERVICE_NAME_EN,
  serviceHomepage: SSO_SERVICE_HOMEPAGE,
  projects: SSO_PROJECTS,
};

export function useSsoRegistry(opts: UseSsoRegistryOptions = {}): UseSsoRegistryResult {
  const [registry, setRegistry] = useState<SsoRegistry>(STATIC_REGISTRY);
  const [loading, setLoading] = useState(!opts.staticOnly);

  useEffect(() => {
    if (opts.staticOnly) {
      setLoading(false);
      return;
    }
    let alive = true;
    fetchSsoProjects({ url: opts.url })
      .then((data) => {
        if (alive) setRegistry(data);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [opts.url, opts.staticOnly]);

  return { loading, registry, projects: registry.projects };
}
