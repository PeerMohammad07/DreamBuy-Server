import * as admin from "firebase-admin";
import serviceAccount from "../config/dream-buy-6afd3-firebase-adminsdk-mjeny-54e32ed8c7.json";

const serviceAccountConfig = serviceAccount as admin.ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountConfig),
});

export default admin;
