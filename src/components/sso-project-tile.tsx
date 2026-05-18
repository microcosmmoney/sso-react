import * as React from 'react';
import type { SsoProject } from '../lib/types';

export interface SsoProjectTileProps {
  project: SsoProject;
  size?: number;
  showName?: boolean;
  showDescription?: boolean;
  asLink?: boolean;
  className?: string;
  onClick?: (project: SsoProject) => void;
}

export function SsoProjectTile({
  project,
  size = 32,
  showName = true,
  showDescription = false,
  asLink = true,
  className = '',
  onClick,
}: SsoProjectTileProps): React.ReactElement {
  const [imgError, setImgError] = React.useState(false);

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
            width: size,
            height: size,
            borderRadius: size / 4,
            background: project.accentColor,
            color: '#fff',
            fontWeight: 600,
            fontSize: Math.max(10, size * 0.45),
            flex: '0 0 auto',
          }}
        >
          {project.letter}
        </span>
      ) : (
        <img
          src={project.logoUrl}
          alt={project.name}
          width={size}
          height={size}
          loading="lazy"
          onError={() => setImgError(true)}
          style={{
            width: size,
            height: size,
            borderRadius: size / 6,
            objectFit: 'cover',
            display: 'block',
            flex: '0 0 auto',
          }}
        />
      )}
      {(showName || showDescription) && (
        <span style={{ display: 'inline-flex', flexDirection: 'column', minWidth: 0 }}>
          {showName && (
            <span style={{ fontWeight: 500, fontSize: Math.max(12, size * 0.4), whiteSpace: 'nowrap' }}>
              {project.name}
            </span>
          )}
          {showDescription && project.description && (
            <span
              style={{
                fontSize: Math.max(10, size * 0.32),
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
      title={project.description || project.name}
    >
      {inner}
    </a>
  );
}
