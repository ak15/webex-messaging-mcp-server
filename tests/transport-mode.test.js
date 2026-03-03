import { describe, it } from "node:test";
import assert from "node:assert";
import { resolveTransportMode } from "../lib/transport-mode.js";

describe("Transport mode resolution", () => {
  it("defaults to stdio when no mode is configured", () => {
    const result = resolveTransportMode([], {});
    assert.strictEqual(result.mode, "stdio");
    assert.strictEqual(result.source, "default");
  });

  it("gives CLI args highest precedence", () => {
    const result = resolveTransportMode(["--http"], {
      TRANSPORT: "stdio",
    });

    assert.strictEqual(result.mode, "http");
    assert.strictEqual(result.source, "cli");
  });

  it("uses TRANSPORT when set", () => {
    const result = resolveTransportMode([], {
      TRANSPORT: "http",
    });

    assert.strictEqual(result.mode, "http");
    assert.strictEqual(result.source, "TRANSPORT");
  });

  it("ignores legacy MCP_MODE and defaults to stdio when TRANSPORT is absent", () => {
    const result = resolveTransportMode([], { MCP_MODE: "http" });
    assert.strictEqual(result.mode, "stdio");
    assert.strictEqual(result.source, "default");
  });

  it("normalizes values and accepts bare CLI values", () => {
    const result = resolveTransportMode(["STDIO"], { TRANSPORT: "http" });
    assert.strictEqual(result.mode, "stdio");
    assert.strictEqual(result.source, "cli");
  });
});
