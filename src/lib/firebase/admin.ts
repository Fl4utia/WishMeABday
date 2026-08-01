import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getPrivateKey(): string | undefined {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (!privateKey) {
    return undefined;
  }

  return privateKey.replace(/\\n/g, "\n");
}

function getAdminApp() {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export function getAdminFirestore() {
  const app = getAdminApp();
  if (!app) {
    return null;
  }

  const firestore = getFirestore(app);
  try {
    // Allow writes that omit optional fields (don't error on undefined properties)
    // This prevents Firestore from rejecting documents when some optional fields are absent.
    // The method `settings` is safe to call; if the runtime doesn't support it this will be a no-op.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (firestore as any).settings?.({ ignoreUndefinedProperties: true });
  } catch (err) {
    // If settings call fails for any reason, proceed without throwing — the API will still work.
    console.warn("Unable to set Firestore settings ignoreUndefinedProperties:", err);
  }

  return firestore;
}
