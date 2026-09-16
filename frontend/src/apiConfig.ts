type RuntimeEnv = {
  API_URL?: string;
  API_TOKEN?: string;
};

declare global {
  interface Window {
    __ENV__?: RuntimeEnv;
  }
}

export const API_URL =
  window.__ENV__?.API_URL || import.meta.env.VITE_API_URL || "/messages";

export const API_TOKEN =
  window.__ENV__?.API_TOKEN || import.meta.env.VITE_API_TOKEN || "";
