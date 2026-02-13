

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-40-tSXrK5Jil86DNH8Z503JPr44tRUU",
  authDomain: "bsfip-platform.firebaseapp.com",
  projectId: "bsfip-platform",
  storageBucket: "bsfip-platform.firebasestorage.app",
  messagingSenderId: "858175499590",
  appId: "1:858175499590:web:9f5b49d4f7cc8ad8370947"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };