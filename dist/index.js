var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.js
var index_exports = {};
__export(index_exports, {
  authOptions: () => authOptions,
  createPlan: () => createPlan,
  createUser: () => createUser,
  deletePlan: () => deletePlan,
  getAllPayments: () => getAllPayments,
  getAllPlans: () => getAllPlans,
  getPlanById: () => getPlanById,
  getUserByEmail: () => getUserByEmail,
  recordPayment: () => recordPayment,
  updateUserPlan: () => updateUserPlan
});
module.exports = __toCommonJS(index_exports);

// src/lib/dynamodb.js
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_lib_dynamodb = require("@aws-sdk/lib-dynamodb");
var config = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
};
var client = new import_client_dynamodb.DynamoDBClient(config);
var docClient = import_lib_dynamodb.DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: true
  }
});

// src/lib/user-db.js
var import_lib_dynamodb2 = require("@aws-sdk/lib-dynamodb");
var import_bcryptjs = __toESM(require("bcryptjs"));
var import_uuid = require("uuid");
var USERS_TABLE = "SaaSUsers";
async function getUserByEmail(email) {
  try {
    const { Item } = await docClient.send(new import_lib_dynamodb2.GetCommand({
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
    hashedPassword = await import_bcryptjs.default.hash(userData.password, 10);
  }
  const newUserId = (0, import_uuid.v4)();
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
    await docClient.send(new import_lib_dynamodb2.PutCommand(params));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
async function updateUserPlan(email, newPlan) {
  try {
    await docClient.send(new import_lib_dynamodb2.UpdateCommand({
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
var import_lib_dynamodb3 = require("@aws-sdk/lib-dynamodb");
var TABLE_NAME = "SaaSPlans";
async function getAllPlans() {
  const result = await docClient.send(new import_lib_dynamodb3.ScanCommand({ TableName: TABLE_NAME }));
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
  await docClient.send(new import_lib_dynamodb3.PutCommand({
    TableName: TABLE_NAME,
    Item: plan
  }));
  return plan;
}
async function deletePlan(id) {
  await docClient.send(new import_lib_dynamodb3.DeleteCommand({
    TableName: TABLE_NAME,
    Key: { id }
  }));
}

// src/lib/payment-db.js
var import_lib_dynamodb4 = require("@aws-sdk/lib-dynamodb");
var TABLE_NAME2 = "SaaSPayments";
async function recordPayment(paymentData) {
  await docClient.send(new import_lib_dynamodb4.PutCommand({
    TableName: TABLE_NAME2,
    Item: {
      ...paymentData,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  }));
}
async function getAllPayments() {
  const result = await docClient.send(new import_lib_dynamodb4.ScanCommand({ TableName: TABLE_NAME2 }));
  return result.Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// src/lib/auth-config.js
var import_credentials = __toESM(require("next-auth/providers/credentials"));
var import_google = __toESM(require("next-auth/providers/google"));
var import_azure_ad = __toESM(require("next-auth/providers/azure-ad"));
var import_apple = __toESM(require("next-auth/providers/apple"));
var import_bcryptjs2 = __toESM(require("bcryptjs"));
var authOptions = {
  session: { strategy: "jwt" },
  providers: [
    (0, import_google.default)({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    (0, import_azure_ad.default)({
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      tenantId: process.env.MICROSOFT_TENANT_ID
    }),
    (0, import_apple.default)({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET
    }),
    (0, import_credentials.default)({
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
        const isValid = await import_bcryptjs2.default.compare(credentials.password, user.password);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
