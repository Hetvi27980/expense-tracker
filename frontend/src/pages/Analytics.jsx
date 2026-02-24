import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import Plot from "react-plotly.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axiosInstance.get("/analytics");
      if (response.status === 200) {
        setAnalyticsData(response.data);
      }
    } catch (error) {
      toast.error("Failed to load analytics data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl">Loading analytics...</div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="glass-card">
        <p className="text-gray-400">Failed to load analytics data.</p>
      </div>
    );
  }

  const { category_breakdown, monthly_trends, forecast } = analyticsData;

  // Prepare bar chart data
  const barCategories = category_breakdown ? Object.keys(category_breakdown) : [];
  const barAmounts = category_breakdown ? Object.values(category_breakdown) : [];

  // Prepare monthly trends data
  const monthlyData = monthly_trends
    ? Object.entries(monthly_trends)
    .map(([month, data]) => ({
      month,
      expense: data.expense,
      income: data.income,
    }))
    .sort((a, b) => b.expense - a.expense)
    : [];

  return (
    <div className="space-y-6">
      <div className="glass-card">
        <h2 className="text-2xl font-semibold mb-6">
          📊 Expense & Income Analytics
        </h2>

        {!category_breakdown || Object.keys(category_breakdown).length === 0 ? (
          <div className="text-gray-400">
            Not enough data to show analytics. Add some transactions first.
          </div>
        ) : (
          <>
            {/* Category-wise Charts */}
            {barCategories.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Pie Chart */}
                <div className="bg-gray-900/50 rounded-xl p-5 h-full flex flex-col">
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    Category-wise Expense (Pie)
                  </h3>
                  <div className="flex-1 min-h-80">
                    <Plot
                      data={[
                        {
                          type: "pie",
                          labels: barCategories,
                          values: barAmounts,
                          hole: 0.45,
                          textinfo: "percent",
                          hoverinfo: "label+value+percent",
                        },
                      ]}
                      layout={{
                        autosize: true,
                        margin: { t: 20, b: 20, l: 20, r: 20 },
                        paper_bgcolor: "transparent",
                        plot_bgcolor: "transparent",
                        font: { color: "#e5e7eb" },
                        showlegend: true,
                      }}
                      useResizeHandler
                      style={{ width: "100%", height: "100%" }}
                      config={{ displayModeBar: false }}
                    />
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-gray-900/50 rounded-xl p-5 h-full flex flex-col">
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    Category-wise Expense (Bar)
                  </h3>
                  <div className="flex-1 min-h-80">
                    <Plot
                      data={[
                        {
                          type: "bar",
                          x: barCategories,
                          y: barAmounts,
                          marker: { color: "#8b5cf6" },
                        },
                      ]}
                      layout={{
                        autosize: true,
                        margin: { t: 20, b: 60, l: 60, r: 20 },
                        paper_bgcolor: "transparent",
                        plot_bgcolor: "transparent",
                        font: { color: "#e5e7eb" },
                        xaxis: { title: "Category" },
                        yaxis: { title: "Amount (₹)" },
                      }}
                      useResizeHandler
                      style={{ width: "100%", height: "100%" }}
                      config={{ displayModeBar: false }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Monthly Trends */}
            {monthlyData.length > 0 && (
              <div className="bg-gray-900/50 rounded-xl p-5 mb-8">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Monthly Income vs Expense
                </h3>
                <div className="min-h-90">
                  <Plot
                    data={[
                      {
                        type: "scatter",
                        mode: "lines+markers",
                        name: "Expense",
                        x: monthlyData.map((d) => d.month),
                        y: monthlyData.map((d) => d.expense),
                        marker: { color: "#ef4444" },
                      },
                      {
                        type: "scatter",
                        mode: "lines+markers",
                        name: "Income",
                        x: monthlyData.map((d) => d.month),
                        y: monthlyData.map((d) => d.income),
                        marker: { color: "#22c55e" },
                      },
                    ]}
                    layout={{
                      autosize: true,
                      margin: { t: 20, b: 60, l: 60, r: 20 },
                      paper_bgcolor: "transparent",
                      plot_bgcolor: "transparent",
                      font: { color: "#e5e7eb" },
                      xaxis: {
                        title: "Month",
                        type: "date",
                        tickformat: "%b %Y",
                      },
                      yaxis: { title: "Amount (₹)" },
                      legend: { orientation: "h", x: 0.8, y: -0.2 },
                    }}
                    useResizeHandler
                    style={{ width: "100%", height: "100%" }}
                    config={{ displayModeBar: false }}
                  />
                </div>
              </div>
            )}

            {/* Forecast */}
            {forecast !== null && forecast !== undefined && (
              <div className="bg-gray-900/50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  📈 Next Month Expense Forecast (Simple Trend)
                </h3>
                <div className="text-lg">
                  Estimated expense for next month:{" "}
                  <strong className="text-purple-400">
                    ₹{" "}
                    {forecast.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </strong>{" "}
                  (simple linear trend)
                </div>
              </div>
            )}

            {/* Download PDF Report */}
            <div className="mt-6">
              <button
                onClick={async () => {
                  try {
                    const response = await axiosInstance.get("/reports/pdf", {
                      responseType: "blob",
                    });
                    const blob = new Blob([response.data]);
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "expense_report.pdf";
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    toast.success("PDF report downloaded");
                  } catch (error) {
                    toast.error("Failed to download PDF report");
                  }
                }}
                className="btn-primary"
              >
                <FontAwesomeIcon icon={faFileArrowDown} />
                &nbsp;Download PDF Report
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

