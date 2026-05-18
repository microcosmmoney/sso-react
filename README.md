# @microcosmmoney/sso-react

Shared React UI components, hooks, and project registry for **Microcosm SSO** — the single-sign-on system that connects sister projects (Microcosm, Double Helix, xSocial, Type.dog, FTwall, and future additions) under one account.

This package is **the single source of truth** for which sister projects support Microcosm SSO, their logos, homepages, and registration status. It also provides ready-to-use React components for advertising SSO support in your login/register flows and detecting when a user is already registered on another sister project.

## Install

```bash
npm install @microcosmmoney/sso-react
# or
pnpm add @microcosmmoney/sso-react
```

Peer deps: `react >= 18`, `react-dom >= 18`.

## Quick start

### Footer banner on your login page

Show users which projects already accept their Microcosm SSO account:

```tsx
import { SsoProjectsBanner } from '@microcosmmoney/sso-react';

export function LoginFooter() {
  return (
    <SsoProjectsBanner
      variant="footer"
      currentProject="xsocial"
      excludeSelf
    />
  );
}
```

### Alert on "email already registered"

When your register endpoint returns `Email already registered`, surface a friendly alert that tells the user where they actually have an account:

```tsx
import {
  SsoAlreadyRegisteredAlert,
  isAlreadyRegisteredError,
} from '@microcosmmoney/sso-react';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <form>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      {error && <ErrorBox>{error}</ErrorBox>}
      {isAlreadyRegisteredError(error) && (
        <SsoAlreadyRegisteredAlert email={email} currentProject="xsocial" />
      )}
    </form>
  );
}
```

The alert calls the Microcosm SSO `check-email` endpoint, finds which sister projects own the email, and renders one-click "Log in here" buttons.

### Programmatic lookup

```tsx
import { useExistingProjects, checkEmail } from '@microcosmmoney/sso-react';

// React hook with debounce + abort
const { loading, exists, projects } = useExistingProjects(email);

// Or one-shot
const { exists, projects } = await checkEmail('user@example.com');
```

### Live project registry

The project list is fetched at runtime from `https://microcosm.money/sso-projects.json` so new sister projects appear without you upgrading the package. A static fallback ships in the bundle.

```tsx
import { useSsoRegistry } from '@microcosmmoney/sso-react';

const { projects, registry, loading } = useSsoRegistry();
// projects: SsoProject[]
// registry.version, registry.updatedAt, registry.serviceName
```

To pin to the static list and skip the network request entirely:

```tsx
const { projects } = useSsoRegistry({ staticOnly: true });
```

## API

### Exports

```ts
// Constants
SSO_PROJECTS               // SsoProject[] — static fallback list
SSO_SERVICE_NAME           // string — display name (localized)
SSO_SERVICE_NAME_EN        // string — English display name
SSO_SERVICE_HOMEPAGE       // string — https://microcosm.money
DEFAULT_REGISTRY_URL       // string — https://microcosm.money/sso-projects.json
DEFAULT_CHECK_EMAIL_URL    // string — https://api.microcosm.money/v1/auth/check-email

// Data helpers
fetchSsoProjects(opts?: { url?: string; force?: boolean }): Promise<SsoRegistry>
findProject(code: string, registry?: SsoProject[]): SsoProject | undefined
checkEmail(email: string, opts?: CheckEmailOptions): Promise<CheckEmailResponse>
isAlreadyRegisteredError(message: unknown): boolean

// Hooks
useSsoRegistry(opts?: UseSsoRegistryOptions): UseSsoRegistryResult
useExistingProjects(email, opts?: UseExistingProjectsOptions): UseExistingProjectsResult

// Components
<SsoProjectsBanner />
<SsoProjectTile />
<SsoAlreadyRegisteredAlert />
```

### Types

```ts
type SsoMode = 'oauth' | 'native' | 'native+oauth';

interface SsoProject {
  code: string;
  name: string;
  nameZh?: string;
  homepage: string;
  logoUrl: string;
  letter: string;        // single character fallback when logo fails to load
  accentColor: string;   // hex color for fallback tile
  openRegister: boolean;
  ssoEnabled: boolean;
  ssoMode: SsoMode;
  description?: string;
}

interface SsoRegistry {
  version: string;
  updatedAt: string;
  serviceName: string;
  serviceNameEn: string;
  serviceHomepage: string;
  projects: SsoProject[];
}

interface CheckEmailResponse {
  exists: boolean;
  projects: string[];   // array of project `code` values
}
```

### Component props

#### `<SsoProjectsBanner>`

| prop                | type                                  | default      | notes |
|---------------------|---------------------------------------|--------------|-------|
| `variant`           | `'footer' \| 'compact' \| 'card'`     | `'footer'`   | Visual density preset. |
| `currentProject`    | `string`                              | —            | The project `code` of the host site (e.g. `'xsocial'`). |
| `excludeSelf`       | `boolean`                             | `true`       | Hide the host project tile. |
| `registryUrl`       | `string`                              | CDN          | Override the JSON registry URL. |
| `staticOnly`        | `boolean`                             | `false`      | Skip network fetch; use bundled list. |
| `tileSize`          | `number`                              | auto         | Logo size in px. |
| `showNames`         | `boolean`                             | auto         | Hide names in compact mode by default. |
| `serviceLabel`      | `string`                              | localized    | The label preceding tiles. |
| `serviceLabelHref`  | `string`                              | homepage     | Anchor target for the label. |
| `style`             | `CSSProperties`                       | —            | Inline overrides. |
| `onProjectClick`    | `(p: SsoProject) => void`             | —            | Intercept tile clicks (replaces default `_blank` link). |

#### `<SsoAlreadyRegisteredAlert>`

| prop                | type                                   | default                  | notes |
|---------------------|----------------------------------------|--------------------------|-------|
| `email`             | `string`                               | **required**             | The address to look up. |
| `currentProject`    | `string`                               | —                        | Excluded from the result. |
| `endpoint`          | `string`                               | DEFAULT_CHECK_EMAIL_URL  | Override the lookup endpoint. |
| `loginUrl`          | `string`                               | `{homepage}/login`       | Where the CTA buttons take the user. |
| `title`             | `string`                               | localized                | Override the headline. |
| `subtitle`          | `string`                               | localized                | Override the subline. |
| `loginCtaLabel`     | `string`                               | localized                | Button text. |
| `onLoginClick`      | `(p: SsoProject) => void`              | —                        | Intercept the CTA (replaces default `window.open`). |

#### `<SsoProjectTile>`

| prop               | type                          | default | notes |
|--------------------|-------------------------------|---------|-------|
| `project`          | `SsoProject`                  | **required** | |
| `size`             | `number`                      | `32`    | Logo size in px. |
| `showName`         | `boolean`                     | `true`  | Render the project name beside the logo. |
| `showDescription`  | `boolean`                     | `false` | Second line under the name. |
| `asLink`           | `boolean`                     | `true`  | Wrap in `<a>` to homepage. |
| `onClick`          | `(p: SsoProject) => void`     | —       | Custom handler. |

## Backend endpoint

The package's lookup helpers hit `POST https://api.microcosm.money/v1/auth/check-email`:

```http
POST /v1/auth/check-email
Content-Type: application/json

{ "email": "user@example.com" }
```

Response:

```json
{
  "success": true,
  "data": {
    "exists": true,
    "projects": ["typedog"]
  }
}
```

Rate limits: 30 lookups/hour per IP and 10 lookups/hour per target email. Throttled responses return either HTTP 429 or `exists: false` (no leakage about whether the throttle hit). Always returns 200 with the standard envelope when the IP limit is not exceeded.

## How sister projects integrate

1. Add the dep:
   ```bash
   npm install @microcosmmoney/sso-react
   ```
2. Drop `<SsoProjectsBanner currentProject="..." excludeSelf />` into your login/register layout.
3. (Optional) Use `<SsoAlreadyRegisteredAlert>` next to your register-form error block.
4. Done — when new sister projects come online, they appear automatically via the CDN registry.

## License

MIT — see [LICENSE](./LICENSE).
