// pages/api/chatbot.js

export default async function handler(req, res) {
    if (req.method === "POST") {
      const { prompt } = req.body;
  
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }
  
      try {
        // Replace the URL with the LemmeBuild API endpoint
        const response = await fetch("https://api.lemmebuild.com/v1/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LEMMEBUILD_API_KEY}`, // Use your API key
          },
          body: JSON.stringify({
            query: prompt, // The prompt sent by the user
            model: "claude-v1", // Assuming you're using Claude, replace with the correct model name if needed
            max_tokens: 100, // Adjust token limit as per your requirement
          }),
        });
  
        const data = await response.json();
  
        if (data.error) {
          return res.status(500).json({ error: data.error.message });
        }
  
        return res.status(200).json({ response: data.reply });
      } catch (error) {
        return res.status(500).json({ error: "Something went wrong" });
      }
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  }
  