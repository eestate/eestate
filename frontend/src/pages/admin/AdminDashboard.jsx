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
  useGetAllviewsQuery,
  useGetMonthlyDashboardStatsQuery,
  useGetTopPerfomingAgentsQuery,
  useGetTotalPropertiesQuery,
  useGetTotalRevenueQuery,
} from "@/redux/services/AdminApi";

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
    data: revenueData,
    isLoading: isLoadingRevenue,
    isError: isErrorRevenue,
    error: errorRevenue,
  } = useGetTotalRevenueQuery();

  const {
    data: activeUsersData,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUsers,
  } = useGetAllActiveUsersQuery();

  const {
    data: TotalViewsData,
    isLoading: isLoadingViews,
    isError: isErrorViews,
    error: errorViews,
  } = useGetAllviewsQuery();

  const {
    data: propertiesData,
    isLoading: isLoadingProperties,
    isError: isErrorProperties,
    error: errorProperties,
  } = useGetTotalPropertiesQuery();

  const {
    data: monthlyStats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    error: errorStats,
  } = useGetMonthlyDashboardStatsQuery();

  const {
    data: topAgents,
    isLoading: isLoadingTopAgents,
    isError: isErrorTopAgents,
    error: errorTopAgents,
  } = useGetTopPerfomingAgentsQuery();


  
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
        data: monthlyStats?.totalViewsCount || [],
        borderColor: "rgb(243, 16, 194)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Active Users",
        data: monthlyStats?.usersPerMonth || [],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Property",
        data: monthlyStats?.propertiesByMonth || [],
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const renderChange = (value) => {
    const isPositive = value >= 0;
    const arrow = isPositive ? "↗" : "↘";
    const color = isPositive ? "text-green-500" : "text-red-500";
    return (
      <p className={`${color} text-sm`}>
        {arrow} {Math.abs(value)}%
      </p>
    );
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
                {isLoadingViews
                  ? "Loading..."
                  : isErrorViews
                  ? "Error"
                  : TotalViewsData?.TotalViewsCount ?? "0"}
              </p>
              {monthlyStats && renderChange(monthlyStats?.statsChange?.views)}
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
              {monthlyStats &&
                renderChange(monthlyStats?.statsChange?.properties)}
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
              {monthlyStats && renderChange(monthlyStats?.statsChange?.users)}
            </div>
            <Users className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Revenue</p>
              <p className="text-2xl font-bold">
                {isLoadingRevenue
                  ? "Loading..."
                  : isErrorRevenue
                  ? "Error"
                  : revenueData?.data?.totalRevenue?.toLocaleString() ?? "0"}
              </p>
              {/* You might want to add a renderChange for revenue if you have comparison data */}
              <p className="text-green-500 text-sm">↗ 5.7%</p>
            </div>
            <CreditCard className="text-orange-500" size={24} />
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {(isErrorUsers || isErrorProperties || isErrorViews) && (
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
          {isErrorViews && (
            <p>
              Failed to fetch Total viwers:{" "}
              {errorViews?.data?.message || "unknown Error"}
            </p>
          )}
              {isErrorRevenue && (
            <p>
              Failed to fetch revenue:{" "}
              {errorRevenue?.data?.message || "Unknown error"}
            </p>
          )}
        </div>
      )}

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
        <div className="h-64">
          {isLoadingStats ? (
            <p>Loadingchart..</p>
          ) : isErrorStats ? (
            <p className="text-red-500">
              Chart Error: {errorStats?.data?.message || "Unknown Error"}
            </p>
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>
      </div>

      {/* Top Performing Agents */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Top Performing Agents</h3>

        {isLoadingTopAgents ? (
          <p>Loading...</p>
        ) : isErrorTopAgents ? (
          <p className="text-red-500">
            Error: {errorTopAgents?.data?.message || "Unknown error"}
          </p>
        ) : (
          <div className="space-y-4">
            {topAgents?.map((agent, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={agent.profilePic || "/default-user.png"} // fallback image
                    alt={agent.name}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-sm text-gray-500">
                      {agent.totalSales} properties
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-blue-500">
                  ${agent.totalRevenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
