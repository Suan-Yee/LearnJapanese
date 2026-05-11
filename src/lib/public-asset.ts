function inferRuntimeBasePath() {
  if (typeof window === "undefined") return "";

  if (window.location.pathname.startsWith("/LearnJapanese")) {
    return "/LearnJapanese";
  }

  return "";
}

export function getPublicAssetUrl(path: string, basePath = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}

export function usePublicAssetBasePath() {
  return process.env.NEXT_PUBLIC_BASE_PATH || inferRuntimeBasePath();
}
