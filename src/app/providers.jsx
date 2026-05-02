"use client";

import { useEffect } from "react";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://server.betopiagroup.com/api"
).replace(/\/+$/, "");

function resolveApiUrl(url) {
  if (typeof url !== "string") return url;
  if (!url.startsWith("/api")) return url;

  // Keep non-admin local API routes on the current app.
  // Only rewrite admin API paths to the external backend service.
  if (!isAdminApiPath(url)) {
    return url;
  }

  const suffix = url.replace(/^\/api/, "");
  return `${API_BASE_URL}${suffix}`;
}

function isAdminApiPath(url) {
  try {
    const parsed = new URL(
      url,
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost",
    );
    return /^\/api\/admin(?:\/|$)/.test(parsed.pathname);
  } catch {
    return url.startsWith("/api/admin/") || url === "/api/admin";
  }
}

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setTokenCookie(token) {
  const isHttps =
    typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = `token=${encodeURIComponent(token)}; Path=/; SameSite=Lax${isHttps ? "; Secure" : ""}`;
}

function clearTokenCookie() {
  const isHttps =
    typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = `token=; Path=/; Max-Age=0; SameSite=Lax${isHttps ? "; Secure" : ""}`;
}

export default function Providers({ children }) {
  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input, init = {}) => {
      const url = typeof input === "string" ? input : input?.url || "";
      const requestUrl = resolveApiUrl(url);
      const method = (init.method || "GET").toUpperCase();
      const isAdminApi = isAdminApiPath(requestUrl);

      if (!isAdminApi && requestUrl === url) {
        return originalFetch(input, init);
      }

      const token = (() => {
        try {
          return localStorage.getItem("token");
        } catch {
          return null;
        }
      })();

      const headers = new Headers(init.headers || {});
      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      const response = await originalFetch(requestUrl, {
        ...init,
        credentials: init.credentials || "include",
        headers,
      });

      if (response.status === 401 || response.status === 403) {
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } catch {
          // ignore storage failures
        }
        clearTokenCookie();
      }

      return response;
    };

    try {
      const lsToken = localStorage.getItem("token");
      const cookieToken = getCookie("token");

      if (lsToken && !cookieToken) {
        setTokenCookie(lsToken);
      }

      if (!lsToken && cookieToken) {
        localStorage.setItem("token", cookieToken);
      }
    } catch {
      // ignore (e.g. disabled storage)
    }

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return children;
}
