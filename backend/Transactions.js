import express from 'express';
import Notification from './models/Notification.js';
import Transaction from './models/Transaction.js';
import User from './models/Usermodel.js'; // Added User model import
import Usermodel from './models/Usermodel.js';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY
});

const router = express.Router();
const messages = [];


// **Save Transaction Details**
router.post("/transactions", async (req, res) => {
  try {
    const { 
      userId, 
      type, 
      amount, 
      category, 
      description, 
      bank, 
      account, 
      recipient, 
      extractionConfidence, 
      rawMessage 
    } = req.body;

    if (!userId || !type || !amount) {
      return res.status(400).json({ message: "Missing required transaction details" });
    }

    const transaction = await Transaction.create({
      userId,
      type,
      amount,
      category,
      description,
      bank,
      account,
      recipient,
      extractionConfidence,
      rawMessage
    });

    res.status(201).json({ 
      message: "Transaction saved successfully", 
      transaction 
    });
  } catch (error) {
    console.error(" Error saving transaction:", error);
    res.status(500).json({ message: "Error saving transaction", error: error.message });
  }
});

// **Get User Transactions**
router.get("/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await Transaction.find({ userId })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(transactions);
  } catch (error) {
    console.error(" Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transactions", error: error.message });
  }
});

// **SMS Routes**
router.post("/api/sms", async (req, res) => {
  try {
    console.log(req.body);
    const { userId, message, sender, timestamp, location } = req.body;
    if (!userId || !message) return res.status(400).json({ error: "Missing required fields" });

    const user = await Usermodel.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.notifications.push({
      sender: sender || 'Unknown',
      message,
      timestamp: new Date(timestamp || Date.now()),
      location: location || null
    });
    console.log('Notification added:', user.notifications);

    try {
      const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.SITE_URL || "https://globemate.com",
          "X-Title": process.env.SITE_NAME || "GlobeMate",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-r1-distill-llama-70b:free",
          "messages": [
            {
              "role": "system",
              "content": "You are a financial SMS parser. Analyze the following SMS and determine if it's a transaction. If it is, return a JSON with 'receiver' and 'amount'. If not, return an empty object."
            },
            {
              "role": "user",
              "content": `Analyze this SMS for transaction details: ${message}`
            }
          ]
        })
      });

      const responseData = await openRouterResponse.json();
      const responseContent = responseData.choices?.[0]?.message?.content;
      console.log('OpenRouter Response:', responseContent);

      if (responseContent) {
        try {
          // Extract JSON content using regex
          const jsonMatch = responseContent.match(/\{.*\}/s);
          if (jsonMatch) {
            const transactionDetails = JSON.parse(jsonMatch[0]);
            console.log('Parsed Transaction Details:', transactionDetails);
            
            if (transactionDetails.amount) {
              user.transactions.push({
                receiver: transactionDetails.receiver || 'Unknown',
                message,
                amount: transactionDetails.amount,
                rawMessage: message,
                timestamp: new Date(timestamp || Date.now()),
                location: location || null
              });
            }
          } else {
            console.error('Error: No JSON found in OpenRouter response');
          }
        } catch (parseError) {
          console.error('Error parsing transaction details:', parseError);
        }
      }
      
    } catch (aiError) {
      console.error('OpenRouter API error:', aiError);
    }

    await user.save();
    res.status(200).json({ message: "SMS processed and saved successfully" });
  } catch (error) {
    console.error('Error processing SMS:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/sms", (req, res) => {
  res.json(messages);
});

export default router;