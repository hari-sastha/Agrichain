import { sha256 } from 'js-sha256';

/**
 * Serializes an object to a canonical JSON string (keys sorted recursively)
 * to ensure deterministic SHA-256 hash computation.
 */
export function canonicalizeJson(obj: any): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return `[${obj.map(canonicalizeJson).join(',')}]`;
  }
  const sortedKeys = Object.keys(obj).sort();
  const parts = sortedKeys.map(
    (key) => `${JSON.stringify(key)}:${canonicalizeJson(obj[key])}`
  );
  return `{${parts.join(',')}}`;
}

/**
 * Computes SHA-256 hash of canonical telemetry or shipment JSON data.
 */
export function generateSHA256(data: any): string {
  const canonicalStr = typeof data === 'string' ? data : canonicalizeJson(data);
  return sha256(canonicalStr);
}

/**
 * Verifies if the computed SHA-256 hash matches an expected hash.
 */
export function verifyDataIntegrity(data: any, expectedHash: string): boolean {
  const computedHash = generateSHA256(data);
  return computedHash.toLowerCase() === expectedHash.toLowerCase();
}
