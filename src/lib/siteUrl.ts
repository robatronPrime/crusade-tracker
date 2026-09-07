export function getSiteUrl(): string {
  const value = process.env.SITE_URL;
  if (!value) {
    throw new Error("SITE_URL is not set");
  }
  return value.replace(/\/$/, "");
}

export function getApiUrl(): string {
  const value = process.env.API_URL;
  if (!value) {
    throw new Error("API_URL is not set");
  }
  return value.replace(/\/$/, "");
}
