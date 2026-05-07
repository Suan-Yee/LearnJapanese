const PATH_CACHE_TTL_MS = 3 * 60 * 60 * 1000;

function timestampKey(pathKey: string) {
  return `${pathKey}_ts`;
}

export function setCachedPath(pathKey: string, pathValue: string) {
  localStorage.setItem(pathKey, pathValue);
  localStorage.setItem(timestampKey(pathKey), String(Date.now()));
}

export function getCachedPath(pathKey: string) {
  const storedPath = localStorage.getItem(pathKey);
  const storedTs = localStorage.getItem(timestampKey(pathKey));
  if (!storedPath || !storedTs) {
    clearCachedPath(pathKey);
    return null;
  }

  const age = Date.now() - Number(storedTs);
  if (!Number.isFinite(age) || age > PATH_CACHE_TTL_MS) {
    clearCachedPath(pathKey);
    return null;
  }

  return storedPath;
}

export function clearCachedPath(pathKey: string) {
  localStorage.removeItem(pathKey);
  localStorage.removeItem(timestampKey(pathKey));
}

