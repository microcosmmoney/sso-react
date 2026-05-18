import * as React from 'react';
import { useSsoRegistry } from '../hooks/use-sso-registry';
import { SsoProjectTile } from './sso-project-tile';
import type { SsoProject } from '../lib/types';

export type SsoBannerVariant = 'footer' | 'compact' | 'card';

export interface SsoProjectsBannerProps {
  variant?: SsoBannerVariant;
  currentProject?: string;
  excludeSelf?: boolean;
  registryUrl?: string;
  staticOnly?: boolean;
  tileSize?: number;
  showNames?: boolean;
  serviceLabel?: string;
  serviceLabelHref?: string;
  className?: string;
  style?: React.CSSProperties;
  onProjectClick?: (project: SsoProject) => void;
}

export function SsoProjectsBanner({
  variant = 'footer',
  currentProject,
  excludeSelf = true,
  registryUrl,
  staticOnly = false,
  tileSize,
  showNames,
  serviceLabel,
  serviceLabelHref = 'https://microcosm.money',
  className = '',
  style,
  onProjectClick,
}: SsoProjectsBannerProps): React.ReactElement | null {
  const { registry, loading } = useSsoRegistry({ url: registryUrl, staticOnly });

  let projects = registry.projects.filter((p) => p.ssoEnabled);
  if (excludeSelf && currentProject) {
    projects = projects.filter((p) => p.code !== currentProject);
  }

  if (loading && projects.length === 0) return null;
  if (projects.length === 0) return null;

  const label = serviceLabel ?? `\u672c\u7ad9\u652f\u6301 ${registry.serviceName}`;
  const resolvedSize = tileSize ?? (variant === 'card' ? 40 : variant === 'compact' ? 24 : 32);
  const resolvedShowNames = showNames ?? variant !== 'compact';

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: variant === 'card' ? 'column' : 'row',
    alignItems: variant === 'card' ? 'flex-start' : 'center',
    flexWrap: 'wrap',
    gap: variant === 'compact' ? 8 : 12,
    padding: variant === 'card' ? 16 : variant === 'compact' ? 4 : 8,
    fontSize: variant === 'compact' ? 12 : 13,
    color: 'inherit',
    ...(variant === 'card'
      ? {
          border: '1px solid rgba(127,127,127,0.2)',
          borderRadius: 12,
          background: 'rgba(127,127,127,0.04)',
        }
      : {}),
    ...style,
  };

  return (
    <div className={className} style={wrapperStyle} data-microcosm-sso-banner={variant}>
      <a
        href={serviceLabelHref}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: 'inherit',
          opacity: 0.75,
          textDecoration: 'none',
          fontWeight: 500,
          flex: variant === 'card' ? '0 0 auto' : '0 0 auto',
        }}
      >
        {label}
      </a>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: variant === 'compact' ? 8 : 12,
        }}
      >
        {projects.map((p) => (
          <SsoProjectTile
            key={p.code}
            project={p}
            size={resolvedSize}
            showName={resolvedShowNames}
            asLink
            onClick={onProjectClick}
          />
        ))}
      </div>
    </div>
  );
}
