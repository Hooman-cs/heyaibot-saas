import { docClient } from "@/lib/dynamodb";
import { PutCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

const USERS_TABLE = "SaaSUsers";

export async function getUserByEmail(email) {
  try {
    const { Item } = await docClient.send(new GetCommand({
      TableName: USERS_TABLE,
      Key: { email: email }
    }));
    return Item;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function createUser(userData) {
  let hashedPassword = null;
  if (userData.password) {
    hashedPassword = await bcrypt.hash(userData.password, 10);
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      email: userData.email, // PK
      name: userData.name,
      password: hashedPassword,
      authProvider: userData.authProvider || "email",
      plan: "starter", 
      credits: 0,
      createdAt: new Date().toISOString(),
    },
    ConditionExpression: "attribute_not_exists(email)",
  };

  try {
    await docClient.send(new PutCommand(params));
    return { success: true };
  } catch (error) {
    // If user already exists, that's fine, just return success false
    return { success: false, error: error.message };
  }
}

// Function to update plan after payment
export async function updateUserPlan(email, newPlan) {
  try {
    await docClient.send(new UpdateCommand({
      TableName: USERS_TABLE,
      Key: { email: email },
      UpdateExpression: "set plan = :p",
      ExpressionAttributeValues: { ":p": newPlan },
    }));
    return { success: true };
  } catch (error) {
    console.error("Update Plan Error:", error);
    return { success: false, error: error.message };
  }
}