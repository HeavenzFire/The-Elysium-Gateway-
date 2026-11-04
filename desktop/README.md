# HeavenzFire Desktop (development shell)

This folder contains the native Electron host for the existing Elysium Gateway UI.

## Requirements

- Node.js 24 or newer.
- Windows 10/11 (the initial desktop target).
- The repository dependencies installed with `npm ci`.

## Run

From the repository root:

```powershell
npm ci
npm run desktop:dev
```

The script builds the existing React/Express application, launches a native Electron window, and starts the gateway as a private child process. The gateway binds only to `127.0.0.1` on an OS-assigned ephemeral port. Its control-plane token is generated at startup and remains in the Electron main process; it is not exposed to renderer JavaScript.

Registry state is stored under `%LOCALAPPDATA%\HeavenzFire`. Project registrations store references only and do not scan or modify linked repositories.

## Renderer bridge

The preload exposes only the following narrow methods as `window.heavenzfireDesktop`:

- `getDesktopInfo()`
- `getRegistry()`
- `selectWorkspace()` — opens a native directory picker
- `registerProject(input)` — stores a user-confirmed project link only
- `verifyRegistry()`
- `listEvidence(limit)`
- `verifyEvidence()`
- `appendEvidence(record)`

No Node integration, arbitrary IPC channel, filesystem access, or shell execution is exposed to the renderer.

## Current scope

This is the native application host and restricted control-plane bridge. The existing React screens remain the primary application surface; the Codex drawer now includes a registry dashboard with project registration through a native folder picker. GitHub OAuth, Termux enrollment, signed node identities, task dispatch, installer packaging, and auto-update are separate stages.
