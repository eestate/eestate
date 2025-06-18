import React from "react";
import { Users, Home, CreditCard, TrendingUp } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  useGetAllActiveUsersQuery,
  useGetTotalPropertiesQuery,
} from "@/redux/services/AdminApi";
// import {
//   useGetAllActiveUsersQuery,
//   useGetTotalPropertiesQuery,
// } from './adminApi';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Analytics Component
const AdminDashboard = () => {
  // Fetch data from RTK Query hooks
  const {
    data: activeUsersData,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUsers,
  } = useGetAllActiveUsersQuery();

  const {
    data: propertiesData,
    isLoading: isLoadingProperties,
    isError: isErrorProperties,
    error: errorProperties,
  } = useGetTotalPropertiesQuery();

  // Chart data
  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Views",
        data: [400, 600, 450, 800, 650, 900, 750, 850, 950, 1000, 1100, 1200],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Properties Listed",
        data: [200, 300, 250, 400, 350, 500, 450, 550, 600, 650, 700, 800],
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        title: {
          display: true,
          text: "Count",
        },
        beginAtZero: true,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Analytics</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Views</p>
              <p className="text-2xl font-bold">
                {isLoadingUsers
                  ? "Loading..."
                  : isErrorUsers
                  ? "Error"
                  : activeUsersData?.TotalUser ?? "0"}
              </p>
              <p className="text-green-500 text-sm">↗ 8.5%</p>
            </div>
            <TrendingUp className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Properties</p>
              <p className="text-2xl font-bold">
                {isLoadingProperties
                  ? "Loading..."
                  : isErrorProperties
                  ? "Error"
                  : propertiesData?.Total ?? "0"}
              </p>
              <p className="text-green-500 text-sm">↗ 3.2%</p>
            </div>
            <Home className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Users</p>
              <p className="text-2xl font-bold">
                {isLoadingUsers
                  ? "Loading..."
                  : isErrorUsers
                  ? "Error"
                  : activeUsersData?.TotalUser ?? "0"}
              </p>
              <p className="text-red-500 text-sm">↘ 2.1%</p>
            </div>
            <Users className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Revenue</p>
              <p className="text-2xl font-bold">892</p>
              <p className="text-green-500 text-sm">↗ 5.7%</p>
            </div>
            <CreditCard className="text-orange-500" size={24} />
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {(isErrorUsers || isErrorProperties) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
          <strong>Error:</strong>
          {isErrorUsers && (
            <p>
              Failed to fetch active users:{" "}
              {errorUsers?.data?.message || "Unknown error"}
            </p>
          )}
          {isErrorProperties && (
            <p>
              Failed to fetch total properties:{" "}
              {errorProperties?.data?.message || "Unknown error"}
            </p>
          )}
        </div>
      )}

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Top Performing Agents */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Top Performing Agents</h3>
        <div className="space-y-4">
          {[
            { name: "Sarah Williams", sales: "23 properties", amount: "$1.2M" },
            { name: "David Wilson", sales: "18 properties", amount: "$890K" },
            { name: "Michael Brown", sales: "15 properties", amount: "$720K" },
          ].map((agent, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-sm text-gray-500">{agent.sales}</p>
                </div>
              </div>
              <span className="font-semibold">{agent.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
