// index.js
export * from './src/lib/user-db';
export * from './src/lib/plan-db';
export * from './src/lib/subscription-db';
export { authOptions } from './src/lib/auth-config';





// // Import modules
// const userDb = require('./src/lib/user-db');
// const planDb = require('./src/lib/plan-db');
// const paymentDb = require('./src/lib/payment-db');
// // We need to use 'import' style for next-auth config usually, but standard require works if transpiled. 
// // However, since auth-config uses ES6 exports, your friend might import it directly from the file path.

// module.exports = {
//   // Database Functions
//   ...userDb,
//   ...planDb,
//   ...paymentDb,
// };

// // Re-exporting the logic so it can be used by other apps
// const userDb = require('./src/lib/user-db');
// const planDb = require('./src/lib/plan-db');
// const paymentDb = require('./src/lib/payment-db');

// // You can also export the DB client if they need raw access
// // const { docClient } = require('./src/lib/dynamodb');

// module.exports = {
//   // User Management
//   getUserByEmail: userDb.getUserByEmail,
//   createUser: userDb.createUser,
//   updateUserPlan: userDb.updateUserPlan,

//   // Plan Management
//   getAllPlans: planDb.getAllPlans,
//   getPlanById: planDb.getPlanById,
//   createPlan: planDb.createPlan,

//   // Payment Management
//   recordPayment: paymentDb.recordPayment,
//   getAllPayments: paymentDb.getAllPayments,
// };