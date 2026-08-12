/**
 * Einfacher In-Memory-Store für getrackte Tokens & Alert-Historie.
 * Für Phase 1 bewusst ohne Datenbank – reicht für ein Single-Instance-Setup.
 * Bei Neustart des Prozesses ist der Verlauf weg; wenn das stört, ist eine
 * kleine SQLite-Anbindung hier der naheliegende nächste Schritt.
 */
const tokens = new Map(); // mintAddress -> { token, analysis }
const alerts = []; // chronologische Liste, neueste zuerst
const MAX_ALERTS = 200;

export function upsertToken(token, analysis) {
  tokens.set(token.mintAddress, { token, analysis, updatedAt: new Date().toISOString() });
}

export function getToken(mintAddress) {
  return tokens.get(mintAddress) || null;
}

export function listTokens({ limit = 50 } = {}) {
  return Array.from(tokens.values())
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, limit);
}

export function recordAlert(token, analysis) {
  alerts.unshift({ token, analysis, sentAt: new Date().toISOString() });
  if (alerts.length > MAX_ALERTS) alerts.length = MAX_ALERTS;
}

export function listAlerts({ limit = 50 } = {}) {
  return alerts.slice(0, limit);
}
