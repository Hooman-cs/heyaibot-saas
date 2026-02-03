const CHATBOT_BACKEND_URL = process.env.CHATBOT_BACKEND_URL || "http://localhost:5000";

export async function createTenantBot(userId, botName, roles) {
  try {
    const payload = {
      websiteName: botName,
      websiteUrl: `https://${userId}.heyaibot.com`, 
      role: roles,
      status: "active",
      userId: userId // <--- SENDING USER ID NOW
    };

    const response = await fetch(`${CHATBOT_BACKEND_URL}/api/websites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to create bot");
    }

    return {
      success: true,
      remoteBotId: data.item.id,
      apiKey: data.item.apiKey,
    };

  } catch (error) {
    console.error("Bot Bridge Error:", error);
    return { success: false, error: error.message };
  }
}





// // This points to your DEPLOYED Chatbot Backend (e.g. Render/Railway URL)
// // For local testing, ensure your other backend is running on port 5000
// const CHATBOT_BACKEND_URL = process.env.CHATBOT_BACKEND_URL || "http://localhost:5000";

// export async function createTenantBot(userId, botName, roles) {
//   try {
//     const payload = {
//       websiteName: botName,
//       // We generate a placeholder URL or use the user's ID
//       websiteUrl: `https://${userId}.heyaibot.com`, 
//       role: roles, // Enforcing features based on plan
//       status: "active",
//       // You can add 'systemPrompt' defaults here if you want
//     };

//     const response = await fetch(`${CHATBOT_BACKEND_URL}/api/websites`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     const data = await response.json();
    
//     if (!data.success) {
//       throw new Error(data.error || "Failed to create bot on remote server");
//     }

//     return {
//       success: true,
//       remoteBotId: data.item.id,
//       apiKey: data.item.apiKey,
//     };

//   } catch (error) {
//     console.error("Bot Bridge Error:", error);
//     return { success: false, error: error.message };
//   }
// }