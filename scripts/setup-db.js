const { DynamoDBClient, CreateTableCommand } = require("@aws-sdk/client-dynamodb");
require("dotenv").config({ path: ".env.local" });

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function createTable(tableName, keySchema, attrDefs, gsis = []) {
  try {
    console.log(`Creating table: ${tableName}...`);
    const params = {
      TableName: tableName,
      KeySchema: keySchema,
      AttributeDefinitions: attrDefs,
      BillingMode: "PAY_PER_REQUEST",
    };

    if (gsis.length > 0) {
      params.GlobalSecondaryIndexes = gsis;
    }

    await client.send(new CreateTableCommand(params));
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
  // 1. Users (New Schema)
  // PK: user_id, GSI: email (for login lookup)
  await createTable(
    "Users",
    [{ AttributeName: "user_id", KeyType: "HASH" }],
    [
      { AttributeName: "user_id", AttributeType: "S" },
      { AttributeName: "user_email", AttributeType: "S" }
    ],
    [{
      IndexName: "EmailIndex",
      KeySchema: [{ AttributeName: "user_email", KeyType: "HASH" }],
      Projection: { ProjectionType: "ALL" }
    }]
  );

  // 2. Plans
  // PK: plan_id
  await createTable(
    "Plans",
    [{ AttributeName: "plan_id", KeyType: "HASH" }],
    [{ AttributeName: "plan_id", AttributeType: "S" }]
  );

  // 3. Features (New Table)
  // PK: plan_id (Groups features by plan), SK: feature_id
  await createTable(
    "Features",
    [
      { AttributeName: "plan_id", KeyType: "HASH" },
      { AttributeName: "feature_id", KeyType: "RANGE" }
    ],
    [
      { AttributeName: "plan_id", AttributeType: "S" },
      { AttributeName: "feature_id", AttributeType: "S" }
    ]
  );

  // 4. Subscriptions (Renamed from SaaSPayments)
  // PK: payment_id, GSI: user_id (To find a user's subscription)
  await createTable(
    "Subscriptions",
    [{ AttributeName: "payment_id", KeyType: "HASH" }],
    [
      { AttributeName: "payment_id", AttributeType: "S" },
      { AttributeName: "user_id", AttributeType: "S" }
    ],
    [{
      IndexName: "UserIndex",
      KeySchema: [{ AttributeName: "user_id", KeyType: "HASH" }],
      Projection: { ProjectionType: "ALL" }
    }]
  );
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

// async function createTable(tableName, keySchema, attrDefs) {
//   try {
//     console.log(`Creating table: ${tableName}...`);
//     await client.send(new CreateTableCommand({
//       TableName: tableName,
//       KeySchema: keySchema,
//       AttributeDefinitions: attrDefs,
//       BillingMode: "PAY_PER_REQUEST",
//     }));
//     console.log(`✅ Table '${tableName}' created!`);
//   } catch (err) {
//     if (err.name === "ResourceInUseException") {
//       console.log(`⚠️  Table '${tableName}' already exists.`);
//     } else {
//       console.error(`❌ Error creating '${tableName}':`, err.message);
//     }
//   }
// }

// async function main() {
//   // 1. SaaSPlans (Store dynamic pricing)
//   await createTable(
//     "SaaSPlans",
//     [{ AttributeName: "id", KeyType: "HASH" }], 
//     [{ AttributeName: "id", AttributeType: "S" }]
//   );

//   // 2. SaaSPayments (Store history)
//   await createTable(
//     "SaaSPayments",
//     [{ AttributeName: "paymentId", KeyType: "HASH" }],
//     [{ AttributeName: "paymentId", AttributeType: "S" }]
//   );
  
//   // Note: SaaSUsers already exists, we just add 'role' field dynamically.
// }

// main();

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