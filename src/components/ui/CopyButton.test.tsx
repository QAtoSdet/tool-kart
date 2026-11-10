import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CopyButton } from "./CopyButton";

// jsdom does not implement the async Clipboard API, so we stub
// navigator.clipboard.writeText with a controllable mock that always resolves.
const writeText = vi
  .fn<(text: string) => Promise<void>>()
  .mockResolvedValue(undefined);

beforeEach(() => {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
    writable: true,
  });
  // Fake timers so the 1.5s reset timeout never leaks into other tests.
  vi.useFakeTimers();
});

afterEach(() => {
  writeText.mockClear();
  vi.useRealTimers();
});

// Helper: flush the microtask that fires when copy() awaits the clipboard
// promise, plus the resulting React state update. Two awaits guard against an
// extra native-promise hop.
async function flushClipboard() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe("CopyButton", () => {
  it("renders the default label and is enabled when a value is provided", () => {
    render(<CopyButton value="hello" />);
    expect(screen.getByRole("button", { name: "Copy" })).toBeEnabled();
  });

  it("is disabled when the value is empty", () => {
    render(<CopyButton value="" />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not call the clipboard when disabled (empty value)", () => {
    render(<CopyButton value="" />);
    fireEvent.click(screen.getByRole("button"));
    expect(writeText).not.toHaveBeenCalled();
  });

  it("copies the value to the clipboard and shows the copied label", async () => {
    render(<CopyButton value="abc123" />);
    fireEvent.click(screen.getByRole("button"));
    expect(writeText).toHaveBeenCalledWith("abc123");
    // copy() awaits the clipboard promise; flush it, then the label flips.
    await flushClipboard();
    expect(screen.getByRole("button")).toHaveTextContent("Copied!");
  });

  it("restores the original label after the reset timeout", async () => {
    render(<CopyButton value="abc123" />);
    fireEvent.click(screen.getByRole("button"));
    await flushClipboard();
    expect(screen.getByRole("button")).toHaveTextContent("Copied!");
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByRole("button")).toHaveTextContent("Copy");
  });

  it("calls onCopied after a successful copy", async () => {
    const onCopied = vi.fn();
    render(<CopyButton value="x" onCopied={onCopied} />);
    fireEvent.click(screen.getByRole("button"));
    await flushClipboard();
    expect(onCopied).toHaveBeenCalledTimes(1);
  });

  it("announces the copied state even when a custom aria-label is set", async () => {
    render(<CopyButton value="x" aria-label="Copy result" />);
    const btn = screen.getByRole("button", { name: "Copy result" });
    fireEvent.click(btn);
    await flushClipboard();
    expect(screen.getByRole("button", { name: "Copied!" })).toBeInTheDocument();
  });

  it("renders custom labels", () => {
    render(<CopyButton value="x" label="Copy total" copiedLabel="Total copied" />);
    expect(screen.getByRole("button", { name: "Copy total" })).toBeInTheDocument();
  });
});
