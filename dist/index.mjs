// src/lib/dynamodb.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
var config = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
};
var client = new DynamoDBClient(config);
var docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: true
  }
});

// src/lib/user-db.js
import { PutCommand, GetCommand as GetCommand2, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
var USERS_TABLE = "SaaSUsers";
async function getUserByEmail(email) {
  try {
    const { Item } = await docClient.send(new GetCommand2({
      TableName: USERS_TABLE,
      Key: { email }
    }));
    return Item;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
async function createUser(userData) {
  let hashedPassword = null;
  if (userData.password) {
    hashedPassword = await bcrypt.hash(userData.password, 10);
  }
  const newUserId = uuidv4();
  const params = {
    TableName: USERS_TABLE,
    Item: {
      email: userData.email,
      // PK
      userId: newUserId,
      // NEW: Unique User ID
      name: userData.name,
      password: hashedPassword,
      role: "user",
      authProvider: userData.authProvider || "email",
      // CHANGE 1: Default plan is now "none"
      plan: "none",
      credits: 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      // CHANGE 2: No expiration initially
      planExpiresAt: null
    },
    ConditionExpression: "attribute_not_exists(email)"
  };
  try {
    await docClient.send(new PutCommand(params));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
async function updateUserPlan(email, newPlan) {
  try {
    await docClient.send(new UpdateCommand({
      TableName: USERS_TABLE,
      Key: { email },
      UpdateExpression: "set plan = :p",
      ExpressionAttributeValues: { ":p": newPlan }
    }));
    return { success: true };
  } catch (error) {
    console.error("Update Plan Error:", error);
    return { success: false, error: error.message };
  }
}

// src/lib/plan-db.js
import { ScanCommand, PutCommand as PutCommand2, DeleteCommand } from "@aws-sdk/lib-dynamodb";
var TABLE_NAME = "SaaSPlans";
async function getAllPlans() {
  const result = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
  return result.Items.sort((a, b) => a.price - b.price);
}
async function getPlanById(id) {
  const result = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { id }
  }));
  return result.Item;
}
async function createPlan(plan) {
  await docClient.send(new PutCommand2({
    TableName: TABLE_NAME,
    Item: plan
  }));
  return plan;
}
async function deletePlan(id) {
  await docClient.send(new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { id }
  }));
}

// src/lib/payment-db.js
import { PutCommand as PutCommand3, ScanCommand as ScanCommand2 } from "@aws-sdk/lib-dynamodb";
var TABLE_NAME2 = "SaaSPayments";
async function recordPayment(paymentData) {
  await docClient.send(new PutCommand3({
    TableName: TABLE_NAME2,
    Item: {
      ...paymentData,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  }));
}
async function getAllPayments() {
  const result = await docClient.send(new ScanCommand2({ TableName: TABLE_NAME2 }));
  return result.Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// src/lib/auth-config.js
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import AppleProvider from "next-auth/providers/apple";
import bcrypt2 from "bcryptjs";
var authOptions = {
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    AzureADProvider({
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      tenantId: process.env.MICROSOFT_TENANT_ID
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!(credentials == null ? void 0 : credentials.email) || !(credentials == null ? void 0 : credentials.password)) throw new Error("Missing inputs");
        const user = await getUserByEmail(credentials.email);
        if (!user) throw new Error("User not found");
        if (!user.password) throw new Error("Please use your social login");
        const isValid = await bcrypt2.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");
        return { id: user.email, name: user.name, email: user.email, plan: user.plan, role: user.role };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider !== "credentials") {
        const existingUser = await getUserByEmail(user.email);
        if (!existingUser) {
          await createUser({
            name: user.name || (profile == null ? void 0 : profile.name) || "User",
            email: user.email,
            authProvider: account.provider,
            password: null
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.plan = user.plan || "none";
        token.role = user.role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.plan = token.plan;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: { signIn: "/auth/login" },
  secret: process.env.NEXTAUTH_SECRET
};
export {
  authOptions,
  createPlan,
  createUser,
  deletePlan,
  getAllPayments,
  getAllPlans,
  getPlanById,
  getUserByEmail,
  recordPayment,
  updateUserPlan
};
