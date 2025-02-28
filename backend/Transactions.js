import express from 'express';
import Notification from './models/Notification.js';
import Transaction from './models/Transaction.js';
import User from './models/Usermodel.js'; // Added User model import
import Usermodel from './models/Usermodel.js';
import Trip from './models/Trip.js'; // Import Trip model
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

    // Find active trip for user
    const activeTrip = await Trip.findOne({
      userId,
      status: 'active',
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    });

    const transaction = await Transaction.create({
      userId,
      tripId: activeTrip?._id, // Associate with active trip if exists
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

    // Update trip spending if transaction is part of a trip
    if (activeTrip) {
      activeTrip.spentAmount = (activeTrip.spentAmount || 0) + amount;
      await activeTrip.save();
    }

    res.status(201).json({ 
      message: "Transaction saved successfully", 
      transaction 
    });
  } catch (error) {
    console.error("Error saving transaction:", error);
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

// **Get Trip Transactions**
router.get("/trips/:tripId/transactions", async (req, res) => {
  try {
    const { tripId } = req.params;
    const transactions = await Transaction.find({ 
      tripId,
      timestamp: { 
        $gte: trip.startDate,
        $lte: trip.endDate 
      }
    }).sort({ timestamp: -1 });

    // Calculate spending by category
    const spendingByCategory = transactions.reduce((acc, trans) => {
      if (!acc[trans.category]) {
        acc[trans.category] = 0;
      }
      acc[trans.category] += trans.amount;
      return acc;
    }, {});

    res.json({
      transactions,
      spendingByCategory
    });
  } catch (error) {
    console.error("Error fetching trip transactions:", error);
    res.status(500).json({ message: "Error fetching trip transactions", error: error.message });
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

    // Find active trip
    const activeTrip = await Trip.findOne({
      userId,
      status: 'active',
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    });

    user.notifications.push({
      sender: sender || 'Unknown',
      message,
      timestamp: new Date(timestamp || Date.now()),
      location: location || null
    });

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
              "content": `You are a financial SMS parser. Analyze the following SMS and determine if it's a transaction. 
              If it is, return a JSON with:
              - 'receiver': The recipient/merchant name
              - 'amount': The transaction amount
              - 'category': Categorize the transaction into one of these categories:
                - 'food_and_dining'
                - 'transportation'
                - 'accommodation'
                - 'shopping'
                - 'entertainment'
                - 'sightseeing'
                - 'other'
              Base the category on the receiver name and any context in the message.
              If not a transaction, return an empty object.`
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
          const jsonMatch = responseContent.match(/\{.*\}/s);
          if (jsonMatch) {
            const transactionDetails = JSON.parse(jsonMatch[0]);
            console.log('Parsed Transaction Details:', transactionDetails);
            
            if (transactionDetails.amount) {
              const transaction = {
                receiver: transactionDetails.receiver || 'Unknown',
                message,
                amount: transactionDetails.amount,
                category: transactionDetails.category || 'other',
                rawMessage: message,
                timestamp: new Date(timestamp || Date.now()),
                location: location || null,
                tripId: activeTrip?._id
              };

              user.transactions.push(transaction);

              // Update trip spending if transaction is part of a trip
              if (activeTrip) {
                activeTrip.spentAmount = (activeTrip.spentAmount || 0) + transactionDetails.amount;
                
                // Update category-specific spending
                if (!activeTrip.spendingByCategory) {
                  activeTrip.spendingByCategory = {};
                }
                activeTrip.spendingByCategory[transaction.category] = 
                  (activeTrip.spendingByCategory[transaction.category] || 0) + transactionDetails.amount;
                
                await activeTrip.save();
              }
            }
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