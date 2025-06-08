const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.deleteOldMessages = functions.pubsub
  .schedule("every 1 hours")
  .onRun(async (context) => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago

    const snapshot = await db
      .collection("messages")
      .where("timestamp", "<=", new Date(cutoff))
      .get();

    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    console.log(`Deleted ${snapshot.size} old messages.`);
    return null;
  });
