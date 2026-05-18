import * as React from 'react';
import type { SsoProject } from '../lib/types';

export interface SsoProjectTileProps {
  project: SsoProject;
  height?: number;
  size?: number;
  maxWidth?: number;
  showName?: boolean;
  showDescription?: boolean;
  asLink?: boolean;
  className?: string;
  onClick?: (project: SsoProject) => void;
}

export function SsoProjectTile({
  project,
  height,
  size,
  maxWidth = 160,
  showName = false,
  showDescription = false,
  asLink = true,
  className = '',
  onClick,
}: SsoProjectTileProps): React.ReactElement {
  const [imgError, setImgError] = React.useState(false);
  const h = height ?? size ?? 32;

  const inner = (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        textDecoration: 'none',
        color: 'inherit',
        lineHeight: 1.2,
      }}
    >
      {imgError ? (
        <span
          aria-hidden
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: h,
            height: h,
            borderRadius: h / 4,
            background: project.accentColor,
            color: '#fff',
            fontWeight: 600,
            fontSize: Math.max(10, h * 0.45),
            flex: '0 0 auto',
          }}
        >
          {project.letter}
        </span>
      ) : (
        <img
          src={project.logoUrl}
          alt={project.name}
          loading="lazy"
          onError={() => setImgError(true)}
          style={{
            height: h,
            width: 'auto',
            maxWidth: maxWidth,
            objectFit: 'contain',
            display: 'block',
            flex: '0 0 auto',
          }}
        />
      )}
      {(showName || showDescription) && (
        <span style={{ display: 'inline-flex', flexDirection: 'column', minWidth: 0 }}>
          {showName && (
            <span style={{ fontWeight: 500, fontSize: Math.max(12, h * 0.4), whiteSpace: 'nowrap' }}>
              {project.name}
            </span>
          )}
          {showDescription && project.description && (
            <span
              style={{
                fontSize: Math.max(10, h * 0.32),
                opacity: 0.7,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {project.description}
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (!asLink) {
    return (
      <span
        role={onClick ? 'button' : undefined}
        onClick={onClick ? () => onClick(project) : undefined}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
        title={project.name}
      >
        {inner}
      </span>
    );
  }

  return (
    <a
      href={project.homepage}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick ? (e) => { e.preventDefault(); onClick(project); } : undefined}
      style={{ textDecoration: 'none', color: 'inherit' }}
      title={project.name}
    >
      {inner}
    </a>
  );
}
