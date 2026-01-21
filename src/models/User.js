import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  // We will link chatbots here later
  bots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bot' }]
}, { timestamps: true });

// Prevent recompilation error in Next.js
export default mongoose.models.User || mongoose.model("User", UserSchema);