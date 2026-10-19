/**
 * Created by 11Hopem
 * Copyright (c) 2026 11Hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

// Rule 18: Cloud Firestore Telemetry & Non-blocking Logger
const FIREBASE_PROJECT_ID = 'hopem-software-cloud';
const APP_ID = '11aicreate-web';

export async function logTelemetry(event, data = {}) {
  const payload = {
    appId: APP_ID,
    event,
    timestamp: new Date().toISOString(),
    metadata: {
      ...data,
      platform: typeof window !== 'undefined' ? 'browser' : 'server'
    }
  };

  // Keep local copy
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const logs = JSON.parse(localStorage.getItem('11aicreate_telemetry') || '[]');
      logs.unshift(payload);
      if (logs.length > 50) logs.pop();
      localStorage.setItem('11aicreate_telemetry', JSON.stringify(logs));
    } catch (e) {
      // Safe fallback
    }
  }

  // Non-blocking fire-and-forget to Firestore REST
  try {
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/telemetry_logs`;
    // We don't await so the UI stays ultra-fast
    fetch(firestoreUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          appId: { stringValue: APP_ID },
          event: { stringValue: event.substring(0, 100) },
          timestamp: { stringValue: payload.timestamp },
          metadata: { stringValue: JSON.stringify(data) }
        }
      })
    }).catch(() => {
      // Non-blocking zero-crash guarantee
    });
  } catch (err) {
    // Zero disruption
  }
}
