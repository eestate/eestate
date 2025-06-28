// import React, { useEffect, useState } from "react";
// import {
//   BarChart3,
//   Users,
//   Home,
//   CreditCard,
//   Calendar,
//   Bell,
//   User,
//   TrendingUp,
//   Eye,
//   MoreHorizontal,
//   Filter,
//   Search,
//   Plus,
//   Trash2,
// } from "lucide-react";
// import {
//   useAddSubscriptionMutation,
//   useDeleteSubscriptionMutation,
//   useEditSubscriptionMutation,
//   useGetAllSubscriptionsQuery,
// } from "@/redux/services/AdminApi";
// import LoadingSpinner from "@/components/LoadingSpinner";
// import { Toaster, toast } from "sonner";

// // Subscription Management Component
// const AdminSubscription = () => {
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [showPlanDropdown, setShowPlanDropdown] = useState(false);
//   const [selectedFilterPlan, setSelectedFilterPlan] = useState("All Plans");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [addFormData, setAddFormData] = useState({
//     planName: "",
//     amount: "",
//     period: "per month",
//     features: [],
//     color: "gray",
//     newFeature: "",
//   });
//   const [editFormData, setEditFormData] = useState({
//     planName: "",
//     amount: "",
//     period: "per month",
//     features: [],
//     color: "gray",
//     newFeature: "",
//   });

//   // Initialize the mutation hook
//   const [addSubscription, { isLoading: isAdding }] =
//     useAddSubscriptionMutation();
//   const {
//     data: subscriptionsData,
//     refetch,
//     isLoading: isLoadingSubscriptions,
//   } = useGetAllSubscriptionsQuery();

//   const [editSubscription] = useEditSubscriptionMutation();
//   const [deleteSubscription] = useDeleteSubscriptionMutation();

//   // Get plans from API data
//   const plans = subscriptionsData?.data || [];

//   useEffect(() => {
//     console.log("all subs ", subscriptionsData);
//   }, [subscriptionsData]);

//   const subscribers = [
//     {
//       name: "Sarah Williams",
//       email: "sarah@example.com",
//       plan: "Premium",
//       status: "Active",
//       nextPayment: "Feb 15, 2024",
//       amount: "$24.99",
//     },
//     {
//       name: "Michael Brown",
//       email: "michael@example.com",
//       plan: "Professional",
//       status: "Active",
//       nextPayment: "Feb 20, 2024",
//       amount: "$9.99",
//     },
//     {
//       name: "David Wilson",
//       email: "david@example.com",
//       plan: "Premium",
//       status: "Active",
//       nextPayment: "Feb 18, 2024",
//       amount: "$24.99",
//     },
//     {
//       name: "Emma Johnson",
//       email: "emma@example.com",
//       plan: "Professional",
//       status: "Cancelled",
//       nextPayment: "Expired",
//       amount: "$9.99",
//     },
//   ];

//   const filteredSubscribers = subscribers
//     .filter(
//       (subscriber) =>
//         selectedFilterPlan === "All Plans" ||
//         subscriber.plan === selectedFilterPlan
//     )
//     .filter(
//       (subscriber) =>
//         subscriber.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         subscriber.email.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//   const handleAddClick = () => {
//     setAddFormData({
//       planName: "",
//       amount: "",
//       period: "per month",
//       features: [],
//       color: "gray",
//       newFeature: "",
//     });
//     setIsAddModalOpen(true);
//   };

//   const handleEditClick = (plan) => {
//     console.log("Editing plan with ID:", plan._id);
//     setSelectedPlan(plan);
//     setEditFormData({
//       planName: plan.planName,
//       amount: plan.amount,
//       period: plan.period,
//       features: plan.features || [],
//       color: plan.color,
//       newFeature: "",
//     });
//     setIsEditModalOpen(true);
//   };

//   const handleAddSubmit = async (e) => {
//     e.preventDefault();
//     const newPlan = {
//       planName: addFormData.planName,
//       amount: addFormData.amount,
//       period: addFormData.period,
//       features: addFormData.features,
//       color: addFormData.color,
//     };

//     try {
//       await addSubscription(newPlan).unwrap();
//       await refetch();
//       setIsAddModalOpen(false);
//       console.log("New plan added:", newPlan);
//     } catch (error) {
//       console.error("Failed to add plan:", error);
//     }
//   };

//   const handleEditSubmit = async (e) => {
//     // console.log("Edit PLan id ", selectedPlan._id);

//     e.preventDefault();
//     const updatedPlan = {
//       _id: selectedPlan._id,
//       planName: editFormData.planName,
//       amount: editFormData.amount,
//       period: editFormData.period,
//       features: editFormData.features,
//       color: editFormData.color,
//     };

//     try {
//       console.log("Edit plan data and id sending....");
//       await editSubscription(updatedPlan);
//       await refetch();
//       setIsEditModalOpen(false);
//       toast.success("Plan Updated Successfully");
//       // console.log("Plan updated:", updatedPlan);
//     } catch (error) {
//       console.error("Failed to update plan:", error);
//     }
//   };

//   const handleAddInputChange = (e) => {
//     const { name, value } = e.target;
//     setAddFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleEditInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddFeature = (formType) => {
//     if (formType === "add" && addFormData.newFeature.trim()) {
//       setAddFormData((prev) => ({
//         ...prev,
//         features: [...prev.features, prev.newFeature.trim()],
//         newFeature: "",
//       }));
//     } else if (formType === "edit" && editFormData.newFeature.trim()) {
//       setEditFormData((prev) => ({
//         ...prev,
//         features: [...prev.features, prev.newFeature.trim()],
//         newFeature: "",
//       }));
//     }
//   };

//   const handleRemoveFeature = (index, formType) => {
//     if (formType === "add") {
//       setAddFormData((prev) => ({
//         ...prev,
//         features: prev.features.filter((_, i) => i !== index),
//       }));
//     } else {
//       setEditFormData((prev) => ({
//         ...prev,
//         features: prev.features.filter((_, i) => i !== index),
//       }));
//     }
//   };

//   const handlePlanFilterSelect = (planName) => {
//     setSelectedFilterPlan(planName);
//     setShowPlanDropdown(false);
//   };

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleDelete = async () => {
//     let a = window.confirm("are you sure");
//     console.log("window", a);

//     if (a == true) {
//       console.log("delete Plan id send.....", selectedPlan._id);
//       deleteSubscription(selectedPlan._id);
//       refetch();
//       toast.success("Plan Deleted Successfully");
//       setIsEditModalOpen(false);
//     } else {
//       console.log(" delete Plan id not send", selectedPlan._id);
//     }
//   };

//   if (isLoadingSubscriptions) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="p-6">
//       <Toaster position="top-right" richColors expand={true} />
//       <h1 className="text-2xl font-semibold mb-6">Subscription Management</h1>

//       {/* Plans */}
//       <div className="grid grid-cols-3 gap-6 mb-8">
//         {plans.map((plan, index) => (
//           <div
//             key={plan._id || index}
//             className="bg-white p-6 rounded-lg shadow-sm border"
//           >
//             <div className="text-center mb-4">
//               <h3 className="text-lg font-semibold">{plan.planName}</h3>
//               <div className="mt-2">
//                 <span className="text-3xl font-bold">
//                   {plan.amount === "0" || plan.amount === 0
//                     ? "Free"
//                     : `$${plan.amount}`}
//                 </span>
//                 <span className="text-gray-500"> {plan.period}</span>
//               </div>
//             </div>
//             <ul className="space-y-2 mb-6">
//               {plan.features?.map((feature, idx) => (
//                 <li key={idx} className="text-sm text-gray-600">
//                   ✓ {feature}
//                 </li>
//               ))}
//             </ul>
//             <div className="text-center mb-4">
//               <p className="text-sm text-gray-500">
//                 {plan.buyers?.length || 0} subscribers
//               </p>
//             </div>
//             <button
//               className={`w-full py-2 px-4 rounded ${
//                 plan.color === "blue"
//                   ? "bg-blue-500 text-white"
//                   : plan.color === "purple"
//                   ? "bg-purple-500 text-white"
//                   : "bg-gray-500 text-white"
//               }`}
//               onClick={() => handleEditClick(plan)}
//             >
//               Edit Plan
//             </button>
//           </div>
//         ))}
//         <button
//           className="bg-gray-100 p-6 rounded-lg shadow-sm border text-center text-gray-600 hover:bg-gray-200"
//           onClick={handleAddClick}
//         >
//           + Add New Plan
//         </button>
//       </div>

//       {/* Add Plan Modal */}
//       {isAddModalOpen && (
//         <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h2 className="text-xl font-semibold mb-4">Add New Plan</h2>
//             <form onSubmit={handleAddSubmit}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Plan Name
//                 </label>
//                 <input
//                   type="text"
//                   name="planName"
//                   value={addFormData.planName}
//                   onChange={handleAddInputChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2 border"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Amount (enter 0 for free plan)
//                 </label>
//                 <input
//                   type="number"
//                   name="amount"
//                   value={addFormData.amount}
//                   onChange={handleAddInputChange}
//                   min="0"
//                   step="0.01"
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2 border"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Period
//                 </label>
//                 <select
//                   name="period"
//                   value={addFormData.period}
//                   onChange={handleAddInputChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2 border"
//                 >
//                   <option value="per month">per month</option>
//                   <option value="per year">per year</option>
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Features
//                 </label>
//                 <div className="flex items-center space-x-2 mb-2">
//                   <input
//                     type="text"
//                     name="newFeature"
//                     value={addFormData.newFeature}
//                     onChange={handleAddInputChange}
//                     placeholder="Enter a feature"
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2 border"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => handleAddFeature("add")}
//                     className="mt-1 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                   >
//                     <Plus size={16} />
//                   </button>
//                 </div>
//                 <ul className="space-y-2 max-h-40 overflow-y-auto">
//                   {addFormData.features.map((feature, index) => (
//                     <li
//                       key={index}
//                       className="flex justify-between items-center text-sm text-gray-600 bg-gray-100 p-2 rounded"
//                     >
//                       <span>{feature}</span>
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveFeature(index, "add")}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Button Color
//                 </label>
//                 <select
//                   name="color"
//                   value={addFormData.color}
//                   onChange={handleAddInputChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2 border"
//                 >
//                   <option value="gray">Gray</option>
//                   <option value="blue">Blue</option>
//                   <option value="purple">Purple</option>
//                 </select>
//               </div>
//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsAddModalOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                   disabled={isAdding}
//                 >
//                   {isAdding ? "Processing..." : "Add Plan"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Edit Plan Modal */}
//       {isEditModalOpen && selectedPlan && (
//         <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h2 className="text-xl font-semibold mb-4">Edit Plan</h2>
//             <form onSubmit={handleEditSubmit}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Plan Name
//                 </label>
//                 <input
//                   type="text"
//                   name="planName"
//                   value={editFormData.planName}
//                   onChange={handleEditInputChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2 border"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Amount (enter 0 for free plan)
//                 </label>
//                 <input
//                   type="number"
//                   name="amount"
//                   value={editFormData.amount}
//                   onChange={handleEditInputChange}
//                   min="0"
//                   step="0.01"
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2 border"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Period
//                 </label>
//                 <select
//                   name="period"
//                   value={editFormData.period}
//                   onChange={handleEditInputChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2 border"
//                 >
//                   <option value="per month">per month</option>
//                   <option value="per year">per year</option>
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Features
//                 </label>
//                 <div className="flex items-center space-x-2 mb-2">
//                   <input
//                     type="text"
//                     name="newFeature"
//                     value={editFormData.newFeature}
//                     onChange={handleEditInputChange}
//                     placeholder="Enter a feature"
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2 border"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => handleAddFeature("edit")}
//                     className="mt-1 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                   >
//                     <Plus size={16} />
//                   </button>
//                 </div>
//                 <ul className="space-y-2 max-h-40 overflow-y-auto">
//                   {editFormData.features.map((feature, index) => (
//                     <li
//                       key={index}
//                       className="flex justify-between items-center text-sm text-gray-600 bg-gray-100 p-2 rounded"
//                     >
//                       <span>{feature}</span>
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveFeature(index, "edit")}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Button Color
//                 </label>
//                 <select
//                   name="color"
//                   value={editFormData.color}
//                   onChange={handleEditInputChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2 border"
//                 >
//                   <option value="gray">Gray</option>
//                   <option value="blue">Blue</option>
//                   <option value="purple">Purple</option>
//                 </select>
//               </div>
//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   className="px-4 py-2 border rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 w-full sm:w-auto"
//                   onClick={() => handleDelete()}
//                 >
//                   Delete
//                 </button>

//                 <button
//                   type="button"
//                   className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
//                   onClick={() => setIsEditModalOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                   disabled={isAdding}
//                 >
//                   {isAdding ? "Processing..." : "Update Plan"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Subscribers */}
//       <div className="bg-white rounded-lg shadow-sm border">
//         <div className="p-4 border-b">
//           <div className="flex justify-between items-center">
//             <h3 className="text-lg font-semibold">Current Subscribers</h3>
//             <div className="flex items-center space-x-4">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search by name or email..."
//                   value={searchQuery}
//                   onChange={handleSearchChange}
//                   className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <Search
//                   size={16}
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                 />
//               </div>
//               <div className="relative">
//                 <button
//                   className="flex items-center space-x-2 px-4 py-2 border rounded-lg"
//                   onClick={() => setShowPlanDropdown(!showPlanDropdown)}
//                 >
//                   <Filter size={16} />
//                   <span>{selectedFilterPlan}</span>
//                 </button>
//                 {showPlanDropdown && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
//                     <button
//                       className="w-full text-left px-4 py-2 hover:bg-gray-100"
//                       onClick={() => handlePlanFilterSelect("All Plans")}
//                     >
//                       All Plans
//                     </button>
//                     {plans.map((plan, index) => (
//                       <button
//                         key={plan._id || index}
//                         className="w-full text-left px-4 py-2 hover:bg-gray-100"
//                         onClick={() => handlePlanFilterSelect(plan.planName)}
//                       >
//                         {plan.planName}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="border-b">
//               <tr>
//                 <th className="text-left p-4">User</th>
//                 <th className="text-left p-4">Plan</th>
//                 <th className="text-left p-4">Status</th>
//                 <th className="text-left p-4">Next Payment</th>
//                 <th className="text-left p-4">Amount</th>
//                 <th className="text-left p-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredSubscribers.map((user, index) => (
//                 <tr key={index} className="border-b hover:bg-gray-50">
//                   <td className="p-4">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
//                       <div>
//                         <p className="font-medium">{user.name}</p>
//                         <p className="text-sm text-gray-500">{user.email}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="p-4">
//                     <span
//                       className={`px-2 py-1 rounded text-sm ${
//                         user.plan === "Premium"
//                           ? "bg-purple-100 text-purple-800"
//                           : user.plan === "Professional"
//                           ? "bg-blue-100 text-blue-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {user.plan}
//                     </span>
//                   </td>
//                   <td className="p-4">
//                     <span
//                       className={`px-2 py-1 rounded text-sm ${
//                         user.status === "Active"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {user.status}
//                     </span>
//                   </td>
//                   <td className="p-4 text-gray-600">{user.nextPayment}</td>
//                   <td className="p-4 font-medium">{user.amount}</td>
//                   <td className="p-4">
//                     <button className="text-gray-400 hover:text-gray-600">
//                       <MoreHorizontal size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminSubscription;


import React from "react";
import { DollarSign } from "lucide-react";
import {
  useGetStripeProductsQuery,
  useGetActiveSubscriptionsQuery,
} from "@/redux/services/SubscriptionApi";

const AdminSubscription = () => {
  const {
    data: products,
    isLoading: isLoadingProducts,
    error: productsError,
    refetch: refetchProducts,
  } = useGetStripeProductsQuery();

  const {
    data: subscriptions,
    isLoading: isLoadingSubscriptions,
    error: subscriptionsError,
    refetch: refetchSubscriptions,
  } = useGetActiveSubscriptionsQuery();

  const renderDescriptionPoints = (description) => {
    if (!description) return null;
    const points = description.split(",").filter((point) => point.trim() !== "");
    return (
      <ul className="flex-grow space-y-2 mb-6 text-gray-700">
        {points.map((point, idx) => (
          <li key={idx} className="flex items-start">
            <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-2"></span>
            <span>{point.trim()}</span>
          </li>
        ))}
      </ul>
    );
  };

  if (isLoadingProducts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading products: {productsError.data?.error || productsError.message}
          <button
            onClick={refetchProducts}
            className="ml-4 bg-gray-900 text-white px-4 py-1 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Subscription Plans</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {products?.map((product) => {
            const price = product.price;
            return (
              <div
                key={product.id}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col border-2 border-transparent transition-all hover:shadow-lg"
              >
                {product.images?.[0] ? (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-32 object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="mb-4 flex justify-center items-center h-32 bg-gray-200 rounded-lg">
                    <DollarSign className="w-12 h-12 text-gray-400" />
                  </div>
                )}

                <div className="flex items-center justify-center mb-4">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                </div>

                {renderDescriptionPoints(product.description)}

                {price && (
  <p className="text-2xl font-bold text-center mb-4">
    ₹{(price.unit_amount / 100).toFixed(2)} /{" "}
    {price.recurring?.interval_count > 1
      ? `${price.recurring.interval_count} ${price.recurring.interval}s`
      : price.recurring?.interval}
  </p>
)}


                {product.metadata?.features && (
                  <ul className="flex-grow space-y-2 mb-6 text-gray-700">
                    {product.metadata.features.split(",").map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="w-2 h-2 bg-gray-900 rounded-full mr-2"></span>
                        {feature.trim()}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <h2 className="text-3xl font-bold text-center mb-12">Active Subscribers</h2>

        {isLoadingSubscriptions ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : subscriptionsError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
            Error loading subscriptions:{" "}
            {subscriptionsError.data?.error || subscriptionsError.message}
            <button
              onClick={refetchSubscriptions}
              className="ml-4 bg-gray-900 text-white px-4 py-1 rounded"
            >
              Retry
            </button>
          </div>
        ) : subscriptions?.data?.length === 0 ? (
          <div className="text-center text-gray-700">No active subscriptions found.</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-4">Agents</th>
                    <th className="text-left p-4">Plan</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Subscribed On</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.data.map((sub) => (
                    <tr key={sub.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{sub.user.name}</p>
                          <p className="text-sm text-gray-500">{sub.user.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded text-sm bg-gray-100 text-gray-800">
                          {sub.planName}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubscription;