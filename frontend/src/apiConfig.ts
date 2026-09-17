type RuntimeEnv = {
  API_URL?: string;
  API_TOKEN?: string;
};

declare global {
  interface Window {
    __ENV__?: RuntimeEnv;
  }
}

export function getApiUrl(): string {
  return window.__ENV__?.API_URL || import.meta.env.VITE_API_URL || "/messages";
}

export function getApiToken(): string {
  return window.__ENV__?.API_TOKEN || import.meta.env.VITE_API_TOKEN || "";
}
