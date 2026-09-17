export function writeSearchParams(searchParams, setSearchParams, patch, replace = true) {
  const next = new URLSearchParams(searchParams);
  Object.entries(patch).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "" || value === " ") {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
  });
  setSearchParams(next, { replace });
}
