import { execSync } from 'node:child_process';

// netlify dev leaves child processes (the Deno edge runtime, the -c no-op) that
// don't reliably die when Playwright stops the webServer, so the proxy can
// linger on 8888. Free the ports explicitly after the run.
export default function globalTeardown() {
  for (const port of [8888, 4321]) {
    try {
      execSync(
        `pids=$(lsof -ti tcp:${port} 2>/dev/null); [ -n "$pids" ] && kill -9 $pids 2>/dev/null; exit 0`,
        { stdio: 'ignore' }
      );
    } catch {
    }
  }
}
