const admin = require("firebase-admin");

// Load Firebase credentials (replace with your actual service account key)
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
