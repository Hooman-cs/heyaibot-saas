import { docClient } from "./lib/dynamodb";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = "SaaSPayments";

export async function recordPayment(paymentData) {
  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      ...paymentData,
      createdAt: new Date().toISOString()
    }
  }));
}

export async function getAllPayments() {
  // In a real app, use Query with Index. For now, Scan is fine for Admin view.
  const result = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
  return result.Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}