import "server-only";
import {
  initializeApp,
  getApps,
  cert,
  type App,
  applicationDefault,
} from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Firebase Admin SDK (SOLO server). Bypassa le security rules: usato per creare
 * utenti, scrivere il profilo e aggiornare lo stato billing.
 *
 * Credenziali: FIREBASE_SERVICE_ACCOUNT_JSON (intero JSON) oppure le tre var
 * FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY.
 */
function buildCredential() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) {
    const parsed = JSON.parse(json);
    return cert({
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key,
    });
  }
  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    return cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
  }
  // Fallback: credenziali di default dell'ambiente (es. Google Cloud).
  return applicationDefault();
}

let _app: App | null = null;
function adminApp(): App {
  if (!_app) {
    _app = getApps().length
      ? getApps()[0]
      : initializeApp({ credential: buildCredential() });
  }
  return _app;
}

export function adminAuth(): Auth {
  return getAuth(adminApp());
}

export function adminDb(): Firestore {
  return getFirestore(adminApp());
}
