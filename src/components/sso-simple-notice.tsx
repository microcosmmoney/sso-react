import * as React from 'react';
import { useSsoRegistry } from '../hooks/use-sso-registry';
import type { SsoProject } from '../lib/types';

export interface SsoSimpleNoticeProps {
  currentProject?: string;
  excludeSelf?: boolean;
  serviceName?: string;
  intro?: React.ReactNode;
  separator?: React.ReactNode;
  showServiceLink?: boolean;
  serviceHomepage?: string;
  registryUrl?: string;
  staticOnly?: boolean;
  className?: string;
  introClassName?: string;
  linksRowClassName?: string;
  linkClassName?: string;
  separatorClassName?: string;
  serviceLinkClassName?: string;
  onProjectClick?: (project: SsoProject) => void;
}

const DEFAULT_WRAPPER_CLASS = 'border-t border-neutral-800/60 pt-3 space-y-1';
const DEFAULT_INTRO_CLASS = 'text-center text-[10px] text-neutral-400 leading-relaxed';
const DEFAULT_LINKS_ROW_CLASS = 'text-center text-[11px] leading-relaxed';
const DEFAULT_LINK_CLASS =
  'text-orange-400/90 hover:text-orange-300 hover:underline underline-offset-2 transition-colors';
const DEFAULT_SEPARATOR_CLASS = 'mx-1.5 text-neutral-600';

export function SsoSimpleNotice({
  currentProject,
  excludeSelf = true,
  serviceName,
  intro,
  separator = '·',
  showServiceLink = false,
  serviceHomepage,
  registryUrl,
  staticOnly = false,
  className = DEFAULT_WRAPPER_CLASS,
  introClassName = DEFAULT_INTRO_CLASS,
  linksRowClassName = DEFAULT_LINKS_ROW_CLASS,
  linkClassName = DEFAULT_LINK_CLASS,
  separatorClassName = DEFAULT_SEPARATOR_CLASS,
  serviceLinkClassName,
  onProjectClick,
}: SsoSimpleNoticeProps): React.ReactElement | null {
  const { registry, loading } = useSsoRegistry({ url: registryUrl, staticOnly });

  let projects = registry.projects.filter((p) => p.ssoEnabled);
  if (excludeSelf && currentProject) {
    projects = projects.filter((p) => p.code !== currentProject);
  }

  if (loading && projects.length === 0) return null;
  if (projects.length === 0) return null;

  const resolvedServiceName = serviceName || registry.serviceName || 'Microcosm \u4e00\u8bc1\u901a';
  const resolvedHomepage = serviceHomepage || registry.serviceHomepage || 'https://microcosm.money';

  const serviceNameNode = showServiceLink ? (
    <a
      href={resolvedHomepage}
      target="_blank"
      rel="noopener noreferrer"
      className={serviceLinkClassName || linkClassName}
    >
      {resolvedServiceName}
    </a>
  ) : (
    resolvedServiceName
  );

  const introNode =
    intro !== undefined ? (
      intro
    ) : (
      <>
        \u672c\u7ad9\u4f7f\u7528 {serviceNameNode} · \u4ee5\u4e0b\u4efb\u4e00\u9879\u76ee\u5df2\u6ce8\u518c\u53ef\u76f4\u63a5\u767b\u5f55
      </>
    );

  return (
    <div className={className} data-microcosm-sso-simple-notice>
      <p className={introClassName}>{introNode}</p>
      <p className={linksRowClassName}>
        {projects.map((p, i) => (
          <React.Fragment key={p.code}>
            {i > 0 && <span className={separatorClassName}>{separator}</span>}
            <a
              href={p.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
              onClick={onProjectClick ? () => onProjectClick(p) : undefined}
            >
              {p.name}
            </a>
          </React.Fragment>
        ))}
      </p>
    </div>
  );
}
