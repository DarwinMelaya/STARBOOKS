const { generateDOSTMarinduqueResponse } = require("../services/aiService");

// Store conversation history in memory (in production, use a proper database)
let conversationHistory = [];

/**
 * Chat with AI about DOST Projects in Marinduque
 * POST /api/ai/chat
 */
const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    // Add user message to conversation history
    conversationHistory.push({ role: "user", content: message });

    // Generate AI response
    const response = await generateDOSTMarinduqueResponse(
      message,
      conversationHistory
    );

    // Add assistant response to conversation history
    conversationHistory.push({ role: "assistant", content: response });

    // Keep conversation history to a reasonable size (last 10 messages)
    if (conversationHistory.length > 10) {
      conversationHistory = conversationHistory.slice(-10);
    }

    res.json({
      success: true,
      response: response,
    });
  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate response",
      message: error.message,
    });
  }
};

/**
 * Reset conversation history
 * POST /api/ai/reset-conversation
 */
const resetConversation = (req, res) => {
  conversationHistory = [];
  res.json({
    success: true,
    message: "Conversation history reset",
  });
};

/**
 * Get conversation history
 * GET /api/ai/conversation
 */
const getConversation = (req, res) => {
  res.json({
    success: true,
    conversation: conversationHistory,
  });
};

module.exports = {
  chatWithAI,
  resetConversation,
  getConversation,
};
