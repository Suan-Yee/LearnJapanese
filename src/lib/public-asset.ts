export function getPublicAssetUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  let basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  // Runtime fallback for static GitHub Pages builds if the env var is missing.
  if (typeof window !== "undefined" && !basePath) {
    if (window.location.pathname.startsWith("/LearnJapanese")) {
      basePath = "/LearnJapanese";
    }
  }

  return `${basePath}${normalizedPath}`;
}
