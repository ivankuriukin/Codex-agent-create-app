import "@testing-library/jest-dom";
import { jest } from "@jest/globals";

Object.defineProperty(globalThis, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  value: ResizeObserverMock,
});

jest.mock("@config/env", () => ({
  apiBaseUrl: "http://localhost:4000",
  telegramBotName: "demo_bot",
  telegramBotId: "123456",
}));
