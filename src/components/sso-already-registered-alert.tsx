import * as React from 'react';
import { useExistingProjects } from '../hooks/use-existing-projects';
import { useSsoRegistry } from '../hooks/use-sso-registry';
import { SsoProjectTile } from './sso-project-tile';
import type { SsoProject } from '../lib/types';

function resolveSafeTarget(target: string, homepageBase: string, safeDefault: string): string {
  try {
    const homeOrigin = new URL(homepageBase).origin;
    const resolved = new URL(target, homepageBase);
    if (resolved.protocol !== 'https:' && resolved.protocol !== 'http:') return safeDefault;
    if (resolved.origin !== homeOrigin) return safeDefault;
    return resolved.toString();
  } catch {
    return safeDefault;
  }
}

export interface SsoAlreadyRegisteredAlertProps {
  email: string;
  currentProject?: string;
  loginUrl?: string | ((project: SsoProject) => string);
  endpoint?: string;
  registryUrl?: string;
  staticOnly?: boolean;
  title?: string;
  subtitle?: string;
  loginCtaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  renderEmpty?: () => React.ReactNode;
  onLoginClick?: (project: SsoProject) => void;
}

export function SsoAlreadyRegisteredAlert({
  email,
  currentProject,
  loginUrl,
  endpoint,
  registryUrl,
  staticOnly,
  title,
  subtitle,
  loginCtaLabel = '\u53bb\u767b\u5f55',
  className = '',
  style,
  renderEmpty,
  onLoginClick,
}: SsoAlreadyRegisteredAlertProps): React.ReactElement | null {
  const { registry } = useSsoRegistry({ url: registryUrl, staticOnly });
  const { loading, exists, projects } = useExistingProjects(email, {
    endpoint,
    registry: registry.projects,
  });

  if (loading) return null;
  if (!exists) return null;

  const filtered = currentProject ? projects.filter((p) => p.code !== currentProject) : projects;

  if (filtered.length === 0) {
    if (renderEmpty) return <>{renderEmpty()}</>;
    return null;
  }

  const wrapperStyle: React.CSSProperties = {
    border: '1px solid rgba(249,115,22,0.4)',
    background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(245,158,11,0.04))',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    ...style,
  };

  const resolvedTitle = title ?? '\u8be5\u90ae\u7bb1\u5df2\u901a\u8fc7 Microcosm \u4e00\u8bc1\u901a\u6ce8\u518c\u8fc7';
  const resolvedSubtitle =
    subtitle ?? `\u4f60\u4e4b\u524d\u5728\u4ee5\u4e0b ${filtered.length} \u4e2a\u9879\u76ee\u7528\u540c\u4e00\u90ae\u7bb1\u6ce8\u518c\u8fc7,\u53ef\u4ee5\u76f4\u63a5\u767b\u5f55:`;

  const handleClick = (p: SsoProject): void => {
    if (onLoginClick) {
      onLoginClick(p);
      return;
    }
    const base = p.homepage.replace(/\/+$/, '');
    const safeDefault = `${base}/login?email=${encodeURIComponent(email)}`;
    let target: string;
    if (typeof loginUrl === 'function') {
      target = loginUrl(p);
    } else if (typeof loginUrl === 'string' && loginUrl.length > 0) {
      target = loginUrl;
    } else {
      target = safeDefault;
    }
    if (typeof window !== 'undefined') {
      window.open(resolveSafeTarget(target, base, safeDefault), '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={className} style={wrapperStyle} role="alert" data-microcosm-sso-alert="already-registered">
      <div style={{ fontWeight: 600, fontSize: 15 }}>{resolvedTitle}</div>
      <div style={{ opacity: 0.85 }}>{resolvedSubtitle}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {filtered.map((p) => (
          <button
            key={p.code}
            type="button"
            onClick={() => handleClick(p)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 14px',
              border: `1px solid ${p.accentColor}40`,
              borderRadius: 999,
              background: `${p.accentColor}14`,
              color: 'inherit',
              cursor: 'pointer',
              font: 'inherit',
              fontSize: 13,
            }}
          >
            <SsoProjectTile project={p} height={24} maxWidth={120} showName asLink={false} />
            <span style={{ opacity: 0.7, fontSize: 12 }}>{loginCtaLabel} →</span>
          </button>
        ))}
      </div>
    </div>
  );
}
