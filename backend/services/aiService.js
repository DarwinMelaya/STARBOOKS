const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate AI response focused on DOST Projects in Marinduque, Philippines
 * @param {string} message - User's message/question
 * @param {Array} conversationHistory - Previous conversation messages
 * @returns {Promise<string>} AI generated response
 */
async function generateDOSTMarinduqueResponse(
  message,
  conversationHistory = []
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" }); // Using gemini-2.0-flash-exp, can be changed to gemini-2.5-flash if available

    // Build conversation context
    const conversationContext = conversationHistory
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    // Create specialized prompt for DOST Projects in Marinduque
    const prompt = `You are an advanced AI assistant specialized in DOST (Department of Science and Technology) projects and initiatives in Marinduque, Philippines. Your primary goal is to help the province and community by providing:

1. **Project Suggestions**: Recommend relevant DOST projects that can benefit Marinduque's communities, focusing on:
   - Agricultural development and food security
   - Technology transfer and innovation
   - Community-based projects
   - Environmental sustainability
   - Disaster resilience
   - Livelihood programs
   - Science and technology education

2. **Context Awareness**: You understand Marinduque's:
   - Geographic location (island province in MIMAROPA region)
   - Economic activities (agriculture, fishing, tourism)
   - Community needs and challenges
   - Potential for S&T interventions

${
  conversationContext
    ? `Previous conversation context:
${conversationContext}
`
    : ""
}

**Guidelines for your responses:**
- Focus specifically on DOST projects applicable to Marinduque, Philippines
- Provide actionable suggestions that help the province and community
- Reference DOST programs like SETUP, CEST, STARBOOKS, etc. when relevant
- Use a professional yet friendly tone
- Structure responses with clear sections (use markdown formatting)
- Include specific project names, benefits, and implementation considerations
- When using general knowledge: Clearly mark it as "Additional Context: [explanation]"
- Suggest related questions the user might want to ask
- Always consider community impact and sustainability

**Current user question:** ${message}

Please provide a well-structured, professional response focused on helping Marinduque through DOST projects:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response");
  }
}

module.exports = {
  generateDOSTMarinduqueResponse,
};
