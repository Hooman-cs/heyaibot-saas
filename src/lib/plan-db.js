import { docClient } from "./lib/dynamodb";
import { ScanCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = "SaaSPlans";

export async function getAllPlans() {
  const result = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
  // Sort by price usually makes sense
  return result.Items.sort((a, b) => a.price - b.price);
}

// NEW: Get single plan
export async function getPlanById(id) {
  const result = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { id }
  }));
  return result.Item;
}

export async function createPlan(plan) {
  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: plan
  }));
  return plan;
}

export async function deletePlan(id) {
  await docClient.send(new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { id }
  }));
}