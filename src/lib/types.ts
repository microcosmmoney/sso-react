export type SsoMode = 'oauth' | 'native' | 'native+oauth';

export interface SsoProject {
  code: string;
  name: string;
  nameZh?: string;
  homepage: string;
  logoUrl: string;
  letter: string;
  accentColor: string;
  openRegister: boolean;
  ssoEnabled: boolean;
  ssoMode: SsoMode;
  description?: string;
}

export interface SsoRegistry {
  version: string;
  updatedAt: string;
  serviceName: string;
  serviceNameEn: string;
  serviceHomepage: string;
  projects: SsoProject[];
}

export interface CheckEmailResponse {
  exists: boolean;
  projects: string[];
}
