export default async function doFetch(url, options) {
  const response = await fetch(url, options);
  const clone = await response.clone();

  return clone.json().catch(() => response.text());
}