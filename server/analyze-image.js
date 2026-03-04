import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createWorker } from 'tesseract.js';

const upload = multer({ storage: multer.memoryStorage() });
const app = express();
app.use(cors());
app.use(express.json());

// Simple analyzer logic copied/adapted from src/lib/analyzer.ts
const fraudPatterns = [
  { keywords: ["upi", "gpay", "phonepe", "paytm", "send money", "transfer", "account number", "ifsc"], type: "UPI Fraud", weight: 20 },
  { keywords: ["job", "hiring", "salary", "registration fee", "work from home", "part time", "income", "earning"], type: "Job Scam", weight: 18 },
  { keywords: ["lottery", "prize", "winner", "congratulations", "won", "jackpot", "lucky draw", "reward"], type: "Lottery Scam", weight: 22 },
  { keywords: ["click", "link", "verify", "update", "login", "password", "otp", "kyc", "pan", "aadhar", "aadhaar"], type: "Phishing", weight: 18 },
  { keywords: ["urgent", "immediately", "expire", "block", "suspend", "last chance", "hurry", "act now", "limited time"], type: "Urgency Manipulation", weight: 15 },
];

const suspiciousIndicators = [
  "free", "guaranteed", "risk free", "100%", "no cost", "claim", "offer",
  "deal", "discount", "cashback", "refund", "whatsapp", "telegram",
  "contact", "call now", "dear customer", "dear user",
];

function analyzeText(message) {
  const lower = (message || '').toLowerCase();
  let score = 0;
  const foundKeywords = [];
  const matchedTypes = {};

  for (const pattern of fraudPatterns) {
    for (const kw of pattern.keywords) {
      if (lower.includes(kw)) {
        score += pattern.weight;
        foundKeywords.push(kw);
        matchedTypes[pattern.type] = (matchedTypes[pattern.type] || 0) + pattern.weight;
      }
    }
  }

  for (const ind of suspiciousIndicators) {
    if (lower.includes(ind)) {
      score += 5;
      foundKeywords.push(ind);
    }
  }

  if (/https?:\/\//i.test(message) || /www\./i.test(message)) {
    score += 15;
    foundKeywords.push('suspicious link');
  }

  if (/\+?\d{10,}/.test(message)) {
    score += 5;
  }

  score = Math.min(score, 100);

  const classification = score < 30 ? 'safe' : score < 65 ? 'suspicious' : 'high_risk';
  const topType = Object.entries(matchedTypes).sort((a, b) => b[1] - a[1])[0];
  const fraudType = topType ? topType[0] : score > 0 ? 'Others' : 'None Detected';

  const explanationParts = [];
  if (foundKeywords.length > 0) {
    explanationParts.push(`Contains suspicious words: "${[...new Set(foundKeywords)].slice(0,5).join('", "')}".`);
  }
  if (/https?:\/\/|www\./i.test(message)) {
    explanationParts.push('Contains a suspicious URL link.');
  }
  if (/urgent|immediately|expire|hurry/i.test(message)) {
    explanationParts.push('Uses urgency tactics to pressure the reader.');
  }
  if (explanationParts.length === 0) {
    explanationParts.push('No significant fraud indicators detected in this message.');
  }

  return {
    message,
    risk_score: score,
    spam_score: null,
    fraud_confidence: null,
    risk_level: classification === 'high_risk' ? 'high_risk' : classification === 'suspicious' ? 'suspicious' : 'safe',
    fraud_type: fraudType,
    entities_detected: [...new Set(foundKeywords)],
    reasoning: explanationParts,
    safety_advice: 'Do not share OTPs or sensitive information. Verify with your bank directly.',
    helpline: '1930',
    timestamp: new Date().toISOString(),
  };
}

// OCR worker is heavy; create one worker and reuse
const worker = createWorker({ logger: m => {} });
let workerInitialized = false;
async function ensureWorker() {
  if (!workerInitialized) {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    workerInitialized = true;
  }
}

app.post('/api/analyze-image', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'file is required' });

    const buffer = req.file.buffer;

    await ensureWorker();
    const { data: { text } } = await worker.recognize(buffer);

    // fall back to empty string if OCR failed
    const extracted = (text || '').trim();

    // analyze extracted text
    const result = analyzeText(extracted);

    return res.json(result);
  } catch (err) {
    console.error('analyze-image error', err);
    return res.status(500).json({ error: String(err) });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Analyze-image server listening on ${PORT}`));
