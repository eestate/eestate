import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  Home,
  CreditCard,
  Calendar,
  Bell,
  User,
  TrendingUp,
  Eye,
  MoreHorizontal,
  Filter,
  Search,
  Plus,
  Trash2,
} from "lucide-react";
import {
  useAddSubscriptionMutation,
  useGetAllSubscriptionsQuery,
} from "@/redux/services/AdminApi";
import LoadingSpinner from "@/components/LoadingSpinner";

// Subscription Management Component
const AdminSubscription = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanDropdown, setShowPlanDropdown] = useState(false);
  const [selectedFilterPlan, setSelectedFilterPlan] = useState("All Plans");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    planName: "",
    amount: "",
    period: "per month",
    features: [],
    color: "gray",
    newFeature: "",
  });

  // Initialize the mutation hook
  const [addSubscription, { isLoading }] = useAddSubscriptionMutation();
  const {
    data: subscriptionsData,
    refetch,
    isLoading: isLoadingSubscriptions,
  } = useGetAllSubscriptionsQuery();

  // Get plans from API data
  const plans = subscriptionsData?.data || [];

  useEffect(() => {
    console.log("all subs ", subscriptionsData);
  }, [subscriptionsData]);

  const subscribers = [
    {
      name: "Sarah Williams",
      email: "sarah@example.com",
      plan: "Premium",
      status: "Active",
      nextPayment: "Feb 15, 2024",
      amount: "$24.99",
    },
    {
      name: "Michael Brown",
      email: "michael@example.com",
      plan: "Professional",
      status: "Active",
      nextPayment: "Feb 20, 2024",
      amount: "$9.99",
    },
    {
      name: "David Wilson",
      email: "david@example.com",
      plan: "Premium",
      status: "Active",
      nextPayment: "Feb 18, 2024",
      amount: "$24.99",
    },
    {
      name: "Emma Johnson",
      email: "emma@example.com",
      plan: "Professional",
      status: "Cancelled",
      nextPayment: "Expired",
      amount: "$9.99",
    },
  ];

  const filteredSubscribers = subscribers
    .filter(
      (subscriber) =>
        selectedFilterPlan === "All Plans" ||
        subscriber.plan === selectedFilterPlan
    )
    .filter(
      (subscriber) =>
        subscriber.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subscriber.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleEditClick = (plan = null) => {
    if (plan) {
      setSelectedPlan(plan);
      setFormData({
        planName: plan.planName,
        amount: plan.amount,
        period: plan.period,
        features: plan.features || [],
        color: plan.color,
        newFeature: "",
      });
    } else {
      setSelectedPlan(null);
      setFormData({
        planName: "",
        amount: "",
        period: "per month",
        features: [],
        color: "gray",
        newFeature: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newPlan = {
      _id: selectedPlan?._id,
      planName: formData.planName,
      amount: formData.amount,
      period: formData.period,
      features: formData.features,
      color: formData.color,
    };

    try {
      // Call the mutation to add/update the subscription
      await addSubscription(newPlan).unwrap();
      await refetch();
      setIsModalOpen(false);
      console.log("Plan data submitted:", newPlan);
    } catch (error) {
      console.error("Failed to submit plan:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFeature = () => {
    if (formData.newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, prev.newFeature.trim()],
        newFeature: "",
      }));
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handlePlanFilterSelect = (planName) => {
    setSelectedFilterPlan(planName);
    setShowPlanDropdown(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (isLoadingSubscriptions) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Subscription Management</h1>

      {/* Plans */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {plans.map((plan, index) => (
          <div
            key={plan._id || index}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">{plan.planName}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">
                  {plan.amount === "0" || plan.amount === 0
                    ? "Free"
                    : `$${plan.amount}`}
                </span>
                <span className="text-gray-500"> {plan.period}</span>
              </div>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features?.map((feature, idx) => (
                <li key={idx} className="text-sm text-gray-600">
                  ✓ {feature}
                </li>
              ))}
            </ul>
            <div className="text-center mb-4">
              <p className="text-sm text-gray-500">
                {plan.buyers?.length || 0} subscribers
              </p>
            </div>
            <button
              className={`w-full py-2 px-4 rounded ${
                plan.color === "blue"
                  ? "bg-blue-500 text-white"
                  : plan.color === "purple"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
              onClick={() => handleEditClick(plan)}
            >
              Edit Plan
            </button>
          </div>
        ))}
        <button
          className="bg-gray-100 p-6 rounded-lg shadow-sm border text-center text-gray-600 hover:bg-gray-200"
          onClick={() => handleEditClick()}
        >
          + Add New Plan
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {selectedPlan ? "Edit Plan" : "Add New Plan"}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Plan Name
                </label>
                <input
                  type="text"
                  name="planName"
                  value={formData.planName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2 border"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Amount (enter 0 for free plan)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2 border"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Period
                </label>
                <select
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2 border"
                >
                  <option value="per month">per month</option>
                  <option value="per year">per year</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Features
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    name="newFeature"
                    value={formData.newFeature}
                    onChange={handleInputChange}
                    placeholder="Enter a feature"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2 border"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="mt-1 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {formData.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center text-sm text-gray-600 bg-gray-100 p-2 rounded"
                    >
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Button Color
                </label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2 border"
                >
                  <option value="gray">Gray</option>
                  <option value="blue">Blue</option>
                  <option value="purple">Purple</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Processing..."
                    : selectedPlan
                    ? "Update Plan"
                    : "Add Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscribers */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Current Subscribers</h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
              <div className="relative">
                <button
                  className="flex items-center space-x-2 px-4 py-2 border rounded-lg"
                  onClick={() => setShowPlanDropdown(!showPlanDropdown)}
                >
                  <Filter size={16} />
                  <span>{selectedFilterPlan}</span>
                </button>
                {showPlanDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => handlePlanFilterSelect("All Plans")}
                    >
                      All Plans
                    </button>
                    {plans.map((plan, index) => (
                      <button
                        key={plan._id || index}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handlePlanFilterSelect(plan.planName)}
                      >
                        {plan.planName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4">User</th>
                <th className="text-left p-4">Plan</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Next Payment</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.map((user, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        user.plan === "Premium"
                          ? "bg-purple-100 text-purple-800"
                          : user.plan === "Professional"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.plan}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{user.nextPayment}</td>
                  <td className="p-4 font-medium">{user.amount}</td>
                  <td className="p-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSubscription;
