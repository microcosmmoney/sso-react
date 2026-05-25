import type { SsoProject, SsoRegistry } from './types';

export const SSO_SERVICE_NAME = 'Microcosm \u4e00\u8bc1\u901a';
export const SSO_SERVICE_NAME_EN = 'Microcosm SSO';
export const SSO_SERVICE_HOMEPAGE = 'https://microcosm.money';
export const DEFAULT_REGISTRY_URL = 'https://microcosm.money/sso-projects.json';
export const DEFAULT_CHECK_EMAIL_URL = 'https://api.microcosm.money/v1/auth/check-email';

export const SSO_PROJECTS: SsoProject[] = [
  {
    code: 'microcosm',
    name: 'Microcosm',
    nameZh: 'Microcosm',
    homepage: 'https://microcosm.money',
    logoUrl: 'https://microcosm.money/email-logo-microcosm.png',
    letter: 'M',
    accentColor: '#06b6d4',
    openRegister: true,
    ssoEnabled: true,
    ssoMode: 'native+oauth',
    description: 'Microcosm \u4e3b\u7ad9 — \u4e00\u8bc1\u901a\u8d26\u6237\u7cfb\u7edf\u7684\u5f52\u5c5e',
  },
  {
    code: 'doublehelix',
    name: 'Double Helix',
    nameZh: 'Double Helix',
    homepage: 'https://doublehelix.money',
    logoUrl: 'https://microcosm.money/email-logo-doublehelix.png',
    letter: 'D',
    accentColor: '#006B3F',
    openRegister: true,
    ssoEnabled: true,
    ssoMode: 'oauth',
    description: '\u91cf\u5316\u4ea4\u6613\u81ea\u52a8\u5316\u5e73\u53f0',
  },
  {
    code: 'xsocial',
    name: 'xSocial',
    nameZh: 'xSocial',
    homepage: 'https://xsocial.cc',
    logoUrl: 'https://microcosm.money/email-logo-xsocial.png',
    letter: 'X',
    accentColor: '#F97316',
    openRegister: true,
    ssoEnabled: true,
    ssoMode: 'oauth',
    description: '\u793e\u533a\u5a92\u4f53\u81ea\u52a8\u64cd\u4f5c\u5e73\u53f0',
  },
  {
    code: 'typedog',
    name: 'Type.dog',
    nameZh: 'Type.dog',
    homepage: 'https://type.dog',
    logoUrl: 'https://microcosm.money/email-logo-typedog.png',
    letter: 'T',
    accentColor: '#4D739A',
    openRegister: true,
    ssoEnabled: true,
    ssoMode: 'native',
    description: '\u82f1\u6587\u5b66\u4e60\u8bad\u7ec3\u5e73\u53f0',
  },
  {
    code: 'ftwall',
    name: 'FTwall',
    nameZh: 'FTwall',
    homepage: 'https://ftwall.com',
    logoUrl: 'https://ftwall.com/email-logo.png',
    letter: 'F',
    accentColor: '#1DA1F2',
    openRegister: true,
    ssoEnabled: true,
    ssoMode: 'native',
    description: '\u63a8\u7279\u4ed8\u8d39\u8ba2\u9605\u5899\u670d\u52a1',
  },
  {
    code: 'bluv',
    name: 'BluvDog',
    nameZh: 'BluvDog',
    homepage: 'https://bluv.dog',
    logoUrl: 'https://bluv.dog/email-logo.png',
    letter: 'B',
    accentColor: '#7c3aed',
    openRegister: true,
    ssoEnabled: true,
    ssoMode: 'native',
    description: 'BluvDog \u9879\u76ee\u4e3b\u7ad9',
  },
];

export function findProject(code: string, registry: SsoProject[] = SSO_PROJECTS): SsoProject | undefined {
  return registry.find((p) => p.code === code);
}

let _cachedRegistry: SsoRegistry | null = null;
let _cachedAt = 0;
let _inflight: Promise<SsoRegistry> | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function fetchSsoProjects(opts: { url?: string; force?: boolean } = {}): Promise<SsoRegistry> {
  const url = opts.url || DEFAULT_REGISTRY_URL;
  const now = Date.now();
  if (!opts.force && _cachedRegistry && now - _cachedAt < CACHE_TTL_MS) {
    return _cachedRegistry;
  }
  if (_inflight) return _inflight;

  _inflight = (async () => {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to fetch sso registry: ${res.status}`);
      const data = (await res.json()) as SsoRegistry;
      _cachedRegistry = data;
      _cachedAt = Date.now();
      return data;
    } catch (err) {
      const fallback: SsoRegistry = {
        version: 'static-fallback',
        updatedAt: new Date(0).toISOString(),
        serviceName: SSO_SERVICE_NAME,
        serviceNameEn: SSO_SERVICE_NAME_EN,
        serviceHomepage: SSO_SERVICE_HOMEPAGE,
        projects: SSO_PROJECTS,
      };
      _cachedRegistry = fallback;
      _cachedAt = Date.now();
      return fallback;
    } finally {
      _inflight = null;
    }
  })();

  return _inflight;
}

export function _resetRegistryCache(): void {
  _cachedRegistry = null;
  _cachedAt = 0;
  _inflight = null;
}
