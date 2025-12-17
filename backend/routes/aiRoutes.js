const express = require("express");
const router = express.Router();
const {
  chatWithAI,
  resetConversation,
  getConversation,
} = require("../controllers/aiController");

// Chat with AI about DOST Projects in Marinduque
router.post("/chat", chatWithAI);

// Reset conversation history
router.post("/reset-conversation", resetConversation);

// Get conversation history
router.get("/conversation", getConversation);

module.exports = router;
