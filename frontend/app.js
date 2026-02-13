import { saveFinancialAssessment, saveLoanAssessment, saveSME } from "../backend/database.js";
import { getAdvisoryText } from "../backend/aiService.js";

// Debug: Check if functions are loaded
console.log("App.js loaded successfully");
console.log("saveSME function available:", typeof saveSME);

// SME Test Function
window.submitSME = async function () {
  console.log("submitSME function called");
  
  const name = document.getElementById("name").value;
  const revenue = document.getElementById("revenue").value;

  // Validation
  if (!name || !revenue) {
    alert("Please fill in both business name and revenue fields");
    return;
  }

  if (isNaN(revenue) || parseFloat(revenue) <= 0) {
    alert("Please enter a valid revenue amount");
    return;
  }

  const data = {
    name: name.trim(),
    revenue: parseFloat(revenue),
    createdAt: new Date(),
    testTimestamp: new Date().toISOString()
  };

  console.log("Prepared data:", data);

  try {
    const docId = await saveSME(data);
    console.log("Save successful, document ID:", docId);
    
    // Clear form after successful save
    document.getElementById("name").value = "";
    document.getElementById("revenue").value = "";
    
  } catch (error) {
    console.error("Save failed:", error);
  }
};

// Direct Test Function for Console Testing
window.testDirectSave = async function () {
  console.log("Direct test save called");
  try {
    const testData = {
      name: "Direct Test",
      revenue: 10000,
      test: true,
      timestamp: new Date().toISOString()
    };
    console.log("Testing direct save with data:", testData);
    const docId = await saveSME(testData);
    console.log("Direct test successful! Document ID:", docId);
    alert(`Direct test successful! Document ID: ${docId}`);
  } catch (error) {
    console.error("Direct test failed:", error);
    alert(`Direct test failed: ${error.message}`);
  }
};

// Alternative direct import test (copy this to console)
console.log("To test directly, paste this in console:");
console.log("testDirectSave();");
console.log("Or paste: import { saveSME } from '../backend/database.js'; saveSME({name: 'Direct Test', revenue: 10000, test: true});");

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded, checking for submitSME function...");
  console.log("window.submitSME available:", typeof window.submitSME);
});

/* ================= SME FIN-HEALTH ================= */

const financeForm = document.getElementById("financeForm");

if (financeForm) {
  financeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const revenue = Number(document.getElementById("revenue").value);
    const expenses = Number(document.getElementById("expenses").value);
    const debt = Number(document.getElementById("debt").value);

    const profit = revenue - expenses;
    const profitMargin = profit / revenue;
    const debtRatio = debt / revenue;

    let risk = "Low Risk";
    if (profitMargin < 0.1 && debtRatio > 0.5) risk = "High Risk";
    else if (profitMargin < 0.1 || debtRatio > 0.5) risk = "Medium Risk";

    await saveFinancialAssessment({ revenue, expenses, debt, profit, risk });

    const resultBox = document.getElementById("results");
    resultBox.className = "output";
    if (risk === "High Risk") resultBox.classList.add("high");
    else if (risk === "Medium Risk") resultBox.classList.add("medium");
    else resultBox.classList.add("low");

    resultBox.innerHTML = `
      <h3>Assessment Result</h3>
      <p><strong>Profit:</strong> BWP ${profit}</p>
      <p><strong>Risk Level:</strong> ${risk}</p>
    `;

    const prompt = `
    Explain this SME financial assessment in simple language.
    Revenue: ${revenue}, Expenses: ${expenses}, Debt: ${debt}, Risk: ${risk}.
    Provide one practical suggestion.
    `;

    const advice = await getAdvisoryText(prompt);

    resultBox.innerHTML += `
      <div class="ai-advice">
        <h4>Advisor Notes</h4>
        <p>${advice}</p>
      </div>
    `;
  });
}

/* ================= MICRO-LOAN RISK ================= */

const loanForm = document.getElementById("loanForm");

if (loanForm) {
  loanForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let score = 0;
    const age = Number(document.getElementById("age").value);
    const debt = document.getElementById("debtLevel").value;
    const history = document.getElementById("history").value;

    if (age >= 2) score += 2;
    if (history === "good") score += 2;
    if (history === "average") score += 1;
    if (debt === "high") score -= 2;

    let decision = "High Risk";
    if (score >= 5) decision = "Low Risk";
    else if (score >= 3) decision = "Medium Risk";

    await saveLoanAssessment({ age, debt, history, score, decision });

    const resultBox = document.getElementById("loanResult");
    resultBox.className = "output";
    if (decision === "High Risk") resultBox.classList.add("high");
    else if (decision === "Medium Risk") resultBox.classList.add("medium");
    else resultBox.classList.add("low");

    resultBox.innerHTML = `
      <h3>Loan Evaluation</h3>
      <p><strong>Risk Score:</strong> ${score}</p>
      <p><strong>Decision:</strong> ${decision}</p>
    `;

    const prompt = `
    Explain this loan risk evaluation in simple terms.
    Business age: ${age}, Debt level: ${debt}, Repayment history: ${history}.
    Decision: ${decision}. Give one recommendation.
    `;

    const advice = await getAdvisoryText(prompt);

    resultBox.innerHTML += `
      <div class="ai-advice">
        <h4>Advisor Notes</h4>
        <p>${advice}</p>
      </div>
    `;
  });
}
