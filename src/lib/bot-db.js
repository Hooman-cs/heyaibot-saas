import { docClient } from "@/lib/dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = process.env.DYNAMODB_TABLE || "Websites";

// We don't need createBotRecord anymore because the Chatbot Backend will save it.
// We only need to GET the bots.

export async function getUserBots(userId) {
  try {
    // Scan the Websites table for items that belong to this userId
    // Note: In a large production app, we would use a GSI, but Scan is fine for now.
    const params = {
      TableName: TABLE_NAME,
      FilterExpression: "userId = :uid AND #st <> :deleted",
      ExpressionAttributeValues: {
        ":uid": userId,
        ":deleted": "deleted"
      },
      ExpressionAttributeNames: {
        "#st": "status"
      }
    };

    const result = await docClient.send(new ScanCommand(params));
    return result.Items || [];
  } catch (error) {
    console.error("Error fetching bots:", error);
    return [];
  }
}




// import { docClient } from "@/lib/dynamodb";
// import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
// import { v4 as uuidv4 } from "uuid";

// const TABLE_NAME = "SaaSBots";

// // 1. Create a Bot Record
// export async function createBotRecord(userId, botName, remoteBotId, apiKey, planType) {
//   const botId = uuidv4();
  
//   const params = {
//     TableName: TABLE_NAME,
//     Item: {
//       pk: `USER#${userId}`,    // Partition Key: Groups bots by User
//       sk: `BOT#${botId}`,      // Sort Key: Unique Bot ID
//       botId: botId,
//       name: botName,
//       remoteBotId: remoteBotId,
//       apiKey: apiKey,
//       planType: planType,
//       status: "active",
//       createdAt: new Date().toISOString(),
//     },
//   };

//   await docClient.send(new PutCommand(params));
//   return { botId, name: botName, apiKey };
// }

// // 2. Get All Bots for a User
// export async function getUserBots(userId) {
//   const params = {
//     TableName: TABLE_NAME,
//     KeyConditionExpression: "pk = :pk AND begins_with(sk, :sk_prefix)",
//     ExpressionAttributeValues: {
//       ":pk": `USER#${userId}`,
//       ":sk_prefix": "BOT#",
//     },
//   };

//   const result = await docClient.send(new QueryCommand(params));
//   return result.Items || [];
// }