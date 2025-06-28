import mongoose from "mongoose";
import User from "../models/User.js";
import { Property } from "../models/Property.js";
import subPlan from "../models/Subscription.js";
import Booking from "../models/Booking.js";

export const getAllUser = async (req, res) => {
  try {
    const { search = "", role = "all" } = req.query;

    const query = {};

    if (role.toLowerCase() !== "all") {
      query.role = role.toLowerCase();
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const allUsers = await User.find(query).sort({ createdAt: -1 });
    res.status(200).json({ message: "Filtered users fetched", data: allUsers });
  } catch (error) {
    console.error("Error fetching filtered users:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

export const userDetails = async (req, res) => {
  const { userId } = req.params;
  console.log("user id", userId);

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid ObjectId" });
  }
  const currentUser = await User.findById(userId).populate("wishlist");

  if (!currentUser) {
    return res.status(404).json({ message: "User Not Found" });
  }

  res.status(201).json({ message: "User details", data: currentUser });
};

export const agentDetails = async (req, res) => {
  const { agentId } = req.params;
  console.log("agent id", agentId);

  if (!mongoose.isValidObjectId(agentId)) {
    return res.status(400).json({ message: "Invalid ObjectId" });
  }
  const currentAgent = await User.findById(agentId);

  if (!currentAgent) {
    return res.status(404).json({ message: "agent Not Found" });
  }

  const agentProperties = await Property.find({ agentId });

  res.status(200).json({
    message: "Agent details and properties fetched successfully",
    agent: currentAgent,
    properties: agentProperties,
  });
};

export const BlockAndUnblock = async (req, res) => {
  const { id, action } = req.body;

  console.log("action 1", action);

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid ObjectId" });
  }

  const currentUser = await User.findById(id);

  if (!currentUser) {
    return res.status(404).json({ message: "User Not Found" });
  }

  if (action === "Block") {
    currentUser.isBlocked = true;
  } else if (action === "Unblock") {
    currentUser.isBlocked = false;
  } else {
    return res.status(404).json({ message: "Invalid action" });
  }

  await currentUser.save();

  console.log("user id", id);
  console.log("action", action);
  res.status(201).json({
    message: `current user is ${action} and ${currentUser.isBlocked}`,
    data: currentUser,
  });
};

export const addSubscription = async (req, res) => {
  const { planName, amount, period, features, color } = req.body;

  // console.log('plan details',req.body);

  const planExist = await subPlan.findOne({ planName });

  if (planExist) {
    return res.status(400).json({ message: "Plan already exist" });
  }

  const newPlan = new subPlan({
    planName,
    amount,
    period,
    features,
    color,
  });

  const plan = await newPlan.save();

  console.log("Plan created", plan);
  res.status(201).json({ message: "Plqan Created", data: plan });
};

export const allSubscriptionPlans = async (req, res) => {
  const allSubscriptions = await subPlan.find();
  if (!allSubscriptions) {
    return res.status(404).json({ message: "Subscription Plans Not Found" });
  }
  return res
    .status(201)
    .json({ message: "All Subscriptions", data: allSubscriptions });
};

export const editSubscription = async (req, res) => {
  const { planId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(planId)) {
    return res.status(404).json({ message: "Invalid Plan Id" });
  }

  console.log("plan update data", req.body);

  const planExist = await subPlan.findById(planId);

  if (!planExist) {
    return res.staus(404).json({ message: "Plan Not Found" });
  }

  const updatedPlan = await subPlan.findByIdAndUpdate(
    planId,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!updatedPlan) {
    return res.status(404).json({ message: "Plan Not Found" });
  }

  res
    .status(200)
    .json({ message: "Subscription Plan Updated", data: updatedPlan });
};

export const deletePlan = async (req, res) => {
  const { planId } = req.params;
  console.log("delete paln id", planId);

  if (!mongoose.Types.ObjectId.isValid(planId)) {
    return res.status(404).json({ message: "Invalid Plan Id" });
  }

  const planExist = await subPlan.findOne({ _id: planId });

  if (!planExist) {
    return res.status(404).json({ message: "Plan Not Found" }); // ✅ fixed here
  }

  await subPlan.findByIdAndDelete(planId);

  res.status(200).json({ message: "Plan deleted successfully" });
};

export const getTotalProperties = async (req, res) => {
  try {
    let TotalProperties = await Property.countDocuments();
    res.status(200).json({ Total: TotalProperties });
  } catch {
    res.status(500).json({ message: "error fetching for total properties" });
  }
};

export const getAllActiveUsers = async (req, res) => {
  try {
    let ActiveUsers = await User.countDocuments({
      isBlocked: false,
      role: "user",
    });
    res.status(200).json({ TotalUser: ActiveUsers });
  } catch (error) {
    res.status(500).json({
      message: "Active users fetching is failed",
      error: error.message,
    });
  }
};

export const getAllViews = async (req, res) => {
  try {
    let TotalViews = await User.countDocuments({
      isBlocked: false,
      role: { $in: ["user", "agent"] },
    });
    res.status(200).json({ TotalViewsCount: TotalViews });
  } catch (error) {
    res.status(500).json({
      message: "Total views fetching is failed",
      error: error.message,
    });
  }
};

export const allProperties = async (req, res) => {
  const allProperties = await Property.find().populate("agentId");

  if (!allProperties) {
    return res.status(404).json({ message: "Properties Not Found" });
  }

  res.status(201).json({ message: "All Properties", data: allProperties });
};

export const allBookings = async (req, res) => {
  const allBookings = await Booking.find()
    .populate("agentId")
    .populate("userId")
    .populate("propertyId");
  res
    .status(200)
    .json({ message: "All booking for enquiries api", data: allBookings });
  console.log("allBookings", allBookings);
};

export const getMonthlyDashboardData = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const usersByMonth = await User.aggregate([
      {
        $match: {
          isBlocked: false,
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    const propertiesByMonth = await Property.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    const viewsByMonth = await User.aggregate([
      {
        $match: {
          isBlocked: false,
          role: { $in: ["user", "agent"] },
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);
    const calculatePercentageChange = (dataArray) => {
      const thisMonth = new Date().getMonth();
      const current = dataArray[thisMonth] || 0;
      const previous = dataArray[thisMonth - 1] || 0;

      if (previous === 0) return current === 0 ? 0 : 100;
      const change = ((current - previous) / previous) * 10;
      return parseFloat(change.toFixed(1));
    };

    const formatData = (dataArray) => {
      const result = Array(12).fill(0);
      dataArray.forEach((item) => {
        result[item._id - 1] = item.count;
      });
      return result;
    };

    res.status(200).json({
      usersPerMonth: formatData(usersByMonth),
      propertiesByMonth: formatData(propertiesByMonth),
      totalViewsCount: formatData(viewsByMonth),
      statsChange: {
        users: calculatePercentageChange(formatData(usersByMonth)),
        properties: calculatePercentageChange(formatData(propertiesByMonth)),
        views: calculatePercentageChange(formatData(viewsByMonth)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const getTopPerfomingAgents = async (req, res) => {
  try {
    const topAgents = await Property.aggregate([
      {
        $group: {
          _id: "$agentId",
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$price" },
        },
      },
      {
        $sort: { totalSales: -1 },
      },
      {
        $limit: 3,
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "agentInfo",
        },
      },
      {
        $unwind: "$agentInfo",
      },
      {
        $project: {
          _id: 0,
          agentId: "$_id",
          name: "$agentInfo.name",
          email: "$agentInfo.email",
          profilePic: "$agentInfo.profilePic",
          totalSales: 1,
          totalRevenue: 1,
        },
      },
    ]);

    res.status(200).json(topAgents);
  } catch (error) {
    console.error("Top agents fetching error:", error);
    res.status(500).json({ message: "Failed to fetch top agents" });
  }
};

export const searchAndFilterProperties = async (req, res) => {
  try {
    const { search = "", status = "all" } = req.query;

    const query = {};

    // Add status filter if not 'all'
    if (status.toLowerCase() !== "all") {
      query.status = status.toLowerCase();
    }

    // Add search query if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { "location.placeName": { $regex: search, $options: "i" } },
        { "agentId.name": { $regex: search, $options: "i" } },
      ];
    }

    const properties = await Property.find(query)
      .populate("agentId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Filtered properties fetched",
      data: properties,
    });
  } catch (error) {
    console.error("Error fetching filtered properties:", error);
    res.status(500).json({
      message: "Failed to fetch properties",
      error: error.message,
    });
  }
};

export const searchAndFilterBookings = async (req, res) => {
  try {
    const { search = "", status = "all" } = req.query;

    let query = {};
    if (status.toLowerCase() !== "all") {
      query.status = status.toLowerCase();
    }

    const bookings = await Booking.find(query)
      .populate({
        path: "propertyId",
        select: "name location.village location.placeName images",
      })
      .populate({
        path: "userId",
        select: "name",
      })
      .populate({
        path: "agentId",
        select: "name",
      });

    // 🔍 Apply search filter after population
    const filteredBookings = search
      ? bookings.filter((booking) => {
          const userName = booking.userId?.name?.toLowerCase() || "";
          const agentName = booking.agentId?.name?.toLowerCase() || "";
          const propertyName = booking.propertyId?.name?.toLowerCase() || "";
          const village =
            booking.propertyId?.location?.village?.toLowerCase() || "";
          const placeName =
            booking.propertyId?.location?.placeName?.toLowerCase() || "";

          return (
            userName.includes(search.toLowerCase()) ||
            agentName.includes(search.toLowerCase()) ||
            propertyName.includes(search.toLowerCase()) ||
            village.includes(search.toLowerCase()) ||
            placeName.includes(search.toLowerCase())
          );
        })
      : bookings;

    res.status(200).json({
      message: "Filtered bookings fetched",
      data: filteredBookings,
    });
  } catch (error) {
    console.error("Error fetching filtered bookings:", error);
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

export const getTotalRevenue = async (req, res) => {
  try {
    // Aggregate subscriptions to calculate total revenue
    const revenueData = await subPlan.aggregate([
      {
        // Match only active subscriptions
        $match: {
          status: 'active'
        }
      },
      {
        // Group to calculate total revenue based on planName
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $cond: [
                { $eq: ['$planName', 'Basic'] }, 1000,
                { $cond: [
                  { $eq: ['$planName', 'Professional'] }, 5000,
                  { $cond: [
                    { $eq: ['$planName', 'Premium'] }, 10000,
                    0 // Default case for any other plan
                  ]}
                ]}
              ]
            }
          }
        }
      }
    ]);

    // Extract total revenue from aggregation result
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Send response
    res.status(200).json({
      success: true,
      data: {
        totalRevenue
      }
    });
  } catch (error) {
    console.error('Error calculating total revenue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate total revenue',
      error: error.message
    });
  }
};