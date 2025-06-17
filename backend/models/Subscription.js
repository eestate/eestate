import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      enum: ["per month", "per year"],
      default: "per month",
    },
    features: {
      type: [String],
      default: [],
    },
    color: {
      type: String,
      enum: ["gray", "blue", "purple"],
      default: "gray",
    },
    buyers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const subPlan = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
export default subPlan;
