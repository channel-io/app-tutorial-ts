const defaultSystemVersion = "v1";

export function rewriteAppStoreFunctionUrl(method: string, url: string): string {
  if (method.toUpperCase() !== "PUT") {
    return url;
  }

  const [path, query] = url.split("?", 2);
  if (path !== "/functions") {
    return url;
  }

  return `/functions/${defaultSystemVersion}${query ? `?${query}` : ""}`;
}
