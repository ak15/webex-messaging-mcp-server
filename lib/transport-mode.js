const SUPPORTED_MODES = new Set(["stdio", "http", "sse"]);

function normalizeMode(value) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase().replace(/^--/, "");
  if (!normalized) {
    return null;
  }

  return SUPPORTED_MODES.has(normalized) ? normalized : null;
}

/**
 * Resolve transport mode with deterministic precedence:
 * CLI > TRANSPORT > stdio(default)
 */
export function resolveTransportMode(args = [], env = process.env) {
  for (const arg of args) {
    const mode = normalizeMode(arg);
    if (mode) {
      return { mode, source: "cli" };
    }
  }

  const transportMode = normalizeMode(env.TRANSPORT);

  if (transportMode) {
    return { mode: transportMode, source: "TRANSPORT" };
  }

  return { mode: "stdio", source: "default" };
}
