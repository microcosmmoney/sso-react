import * as React from 'react';

export interface SsoAlreadyRegisteredHintLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export interface SsoAlreadyRegisteredHintProps {
  loginHref?: string;
  loginLabel?: React.ReactNode;
  serviceName?: string;
  icon?: React.ReactNode;
  template?: React.ReactNode;
  className?: string;
  linkClassName?: string;
  LinkComponent?: React.ComponentType<SsoAlreadyRegisteredHintLinkProps>;
}

const DEFAULT_HINT_CLASS = 'mt-1.5 pt-1.5 border-t border-red-500/20 text-[11px] text-orange-300/90';
const DEFAULT_LINK_CLASS = 'underline text-orange-400 hover:text-orange-300 mx-0.5';

export function SsoAlreadyRegisteredHint({
  loginHref = '/login',
  loginLabel = '\u76f4\u63a5\u767b\u5f55',
  serviceName = 'Microcosm \u4e00\u8bc1\u901a',
  icon = '💡',
  template,
  className = DEFAULT_HINT_CLASS,
  linkClassName = DEFAULT_LINK_CLASS,
  LinkComponent,
}: SsoAlreadyRegisteredHintProps): React.ReactElement {
  const renderLink = (children: React.ReactNode) =>
    LinkComponent ? (
      <LinkComponent href={loginHref} className={linkClassName}>
        {children}
      </LinkComponent>
    ) : (
      <a href={loginHref} className={linkClassName}>
        {children}
      </a>
    );

  if (template !== undefined) {
    return (
      <div className={className} data-microcosm-sso-already-registered-hint>
        {template}
      </div>
    );
  }

  return (
    <div className={className} data-microcosm-sso-already-registered-hint>
      {icon} \u6b64\u90ae\u7bb1\u53ef\u80fd\u5df2\u5728\u5176\u4ed6\u63a5\u5165 {serviceName} \u7684\u9879\u76ee\u6ce8\u518c\u8fc7, \u53ef
      {renderLink(loginLabel)}
      , \u65e0\u9700\u91cd\u590d\u6ce8\u518c\u3002
    </div>
  );
}
