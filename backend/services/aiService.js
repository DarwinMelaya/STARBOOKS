const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini AI (API key is read from environment variable GEMINI_API_KEY)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
    // Build conversation context
    const conversationContext = conversationHistory
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    // Create specialized prompt for DOST Projects in Marinduque
    const prompt = `You are an advanced AI assistant specialized in DOST (Department of Science and Technology) projects and initiatives in Marinduque, Philippines. Your primary goal is to help the province and community by providing project suggestions based on the four main DOST program types:

**FOCUS ON THESE FOUR DOST PROGRAM TYPES:**

1. **GIA: Grants-In-Aid Program**
   - Research and development projects
   - Technology innovation initiatives
   - Scientific research proposals
   - Academic and institutional partnerships
   - Focus on advancing science and technology knowledge

2. **SETUP: Small Enterprise Technology Upgrading Program**
   - Technology upgrading for MSMEs (Micro, Small, and Medium Enterprises)
   - Equipment acquisition and modernization
   - Production capacity enhancement
   - Quality improvement initiatives
   - Market competitiveness enhancement

3. **CEST: Community Empowerment through Science and Technology Program**
   - Community-based technology solutions
   - Livelihood development programs
   - Skills training and capacity building
   - Local resource utilization
   - Community-driven innovation projects

4. **SSCP: Smart and Sustainable Communities Program**
   - Smart city/community solutions
   - Sustainable development initiatives
   - Digital transformation projects
   - Environmental sustainability programs
   - Infrastructure modernization with S&T

**Context Awareness for Marinduque:**
- Geographic location: Island province in MIMAROPA region
- Economic activities: Agriculture (coconut, rice, arrowroot), fishing, tourism
- Key industries: Food processing (arrowroot cookies, coconut products), fishing, eco-tourism
- Community needs: Technology adoption, livelihood enhancement, disaster resilience, environmental protection
- Potential S&T interventions: Agricultural technology, food processing innovation, marine resource management, tourism technology

${
  conversationContext
    ? `Previous conversation context:
${conversationContext}
`
    : ""
}

**Guidelines for your responses:**
- ALWAYS categorize suggestions by the four program types (GIA, SETUP, CEST, SSCP)
- Provide specific, actionable project suggestions for each relevant program type
- Explain how each program type can benefit Marinduque's communities
- Include implementation considerations, eligibility requirements, and expected outcomes
- Reference real examples or similar projects when possible
- Use a professional yet friendly tone
- Structure responses with clear sections using markdown formatting
- When suggesting projects, specify which program type they fall under
- Include benefits for the province and community
- Suggest related questions the user might want to ask
- Always consider community impact and sustainability

**Current user question:** ${message}

Please provide a well-structured, professional response that categorizes suggestions by the four DOST program types (GIA, SETUP, CEST, SSCP) and focuses on helping Marinduque through these specific DOST programs:`;

    // Use the same API structure as the working code
    // Try gemini-2.5-flash first (same as working code), fallback to other models if needed
    let gen;
    try {
      gen = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
    } catch (modelError) {
      // Fallback to gemini-1.5-flash if gemini-2.5-flash is not available
      if (
        modelError.message?.includes("model") ||
        modelError.message?.includes("not found")
      ) {
        console.log("Falling back to gemini-1.5-flash");
        gen = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: prompt,
        });
      } else {
        throw modelError;
      }
    }

    const response = gen.text;
    return response;
  } catch (error) {
    console.error("Error generating AI response:", error);

    // Handle specific error types
    if (error.status === 429) {
      throw new Error(
        "API quota exceeded. Please check your Gemini API plan and billing details, or try again later."
      );
    }

    if (error.message?.includes("quota") || error.message?.includes("Quota")) {
      throw new Error(
        "API quota exceeded. Please upgrade your plan or try again later."
      );
    }

    if (error.message?.includes("API_KEY")) {
      throw new Error(
        "Invalid API key. Please check your GEMINI_API_KEY environment variable."
      );
    }

    throw new Error(error.message || "Failed to generate AI response");
  }
}

module.exports = {
  generateDOSTMarinduqueResponse,
};
