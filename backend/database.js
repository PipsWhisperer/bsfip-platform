import { db } from "./firebaseConfig.js";
import { collection, addDoc, serverTimestamp } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function saveFinancialAssessment(data) {
  return await addDoc(collection(db, "financialRecords"), {
    ...data,
    createdAt: serverTimestamp()
  });
}

export async function saveLoanAssessment(data) {
  return await addDoc(collection(db, "loanApplications"), {
    ...data,
    createdAt: serverTimestamp()
  });
}

// Save SME data
export async function saveSME(data) {
  try {
    console.log("Attempting to save SME data:", data);
    const docRef = await addDoc(collection(db, "smeData"), data);
    console.log("Document successfully written with ID:", docRef.id);
    alert(`Data saved successfully! Document ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("Error saving data:", error);
    console.error("Error details:", error.code, error.message);
    alert(`Error saving data: ${error.message}`);
    throw error;
  }
}
