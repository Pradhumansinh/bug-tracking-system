import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import crypto from "crypto"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["Admin", "Developer", "Tester"],
      default: "Tester"
    },

    // 🔐 RESET PASSWORD FIELDS
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  { timestamps: true }
)

/* 🔒 HASH PASSWORD BEFORE SAVE */
userSchema.pre("save", async function () {
  if (!this.isModified("password"))
    return 
 this.password = await bcrypt.hash(this.password, 10)
  
})
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex")

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000 // 15 min

  return resetToken
}
export default mongoose.model("User",userSchema)