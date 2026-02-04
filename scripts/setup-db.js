const { DynamoDBClient, CreateTableCommand } = require("@aws-sdk/client-dynamodb");
require("dotenv").config({ path: ".env.local" });

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function createTable(tableName, keySchema, attrDefs) {
  try {
    console.log(`Creating table: ${tableName}...`);
    await client.send(new CreateTableCommand({
      TableName: tableName,
      KeySchema: keySchema,
      AttributeDefinitions: attrDefs,
      BillingMode: "PAY_PER_REQUEST",
    }));
    console.log(`✅ Table '${tableName}' created!`);
  } catch (err) {
    if (err.name === "ResourceInUseException") {
      console.log(`⚠️  Table '${tableName}' already exists.`);
    } else {
      console.error(`❌ Error creating '${tableName}':`, err.message);
    }
  }
}

async function main() {
  // 1. SaaSPlans (Store dynamic pricing)
  await createTable(
    "SaaSPlans",
    [{ AttributeName: "id", KeyType: "HASH" }], 
    [{ AttributeName: "id", AttributeType: "S" }]
  );

  // 2. SaaSPayments (Store history)
  await createTable(
    "SaaSPayments",
    [{ AttributeName: "paymentId", KeyType: "HASH" }],
    [{ AttributeName: "paymentId", AttributeType: "S" }]
  );
  
  // Note: SaaSUsers already exists, we just add 'role' field dynamically.
}

main();

// const { DynamoDBClient, CreateTableCommand } = require("@aws-sdk/client-dynamodb");
// require("dotenv").config({ path: ".env.local" });

// const client = new DynamoDBClient({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// async function createTable() {
//   const tableName = "SaaSUsers";
  
//   try {
//     console.log(`Creating table: ${tableName}...`);
//     const command = new CreateTableCommand({
//       TableName: tableName,
//       KeySchema: [{ AttributeName: "email", KeyType: "HASH" }], // Partition Key
//       AttributeDefinitions: [{ AttributeName: "email", AttributeType: "S" }],
//       BillingMode: "PAY_PER_REQUEST",
//     });
    
//     await client.send(command);
//     console.log(`✅ Table '${tableName}' created successfully!`);
//   } catch (err) {
//     if (err.name === "ResourceInUseException") {
//       console.log(`⚠️  Table '${tableName}' already exists.`);
//     } else {
//       console.error(`❌ Error creating table:`, err.message);
//     }
//   }
// }

// createTable();