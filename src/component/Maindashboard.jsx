import React from "react";
import Slider from "./Slider";
import Stats from "./Stats";

export default function Maindashboard() {
  const scans = [
    {
      name: "Weekly Web Scan",
      type: "Dynamic",
      status: "Completed",
      progress: 100,
      vulnerabilities: { critical: 2, high: 5, medium: 8, low: 12 },
      lastScan: "2 hours ago",
    },
    {
      name: "API Security Audit",
      type: "Static",
      status: "Scheduled",
      progress: 0,
      vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 },
      lastScan: "Tomorrow 10:00 AM",
    },
    {
      name: "Cloud Infra Scan",
      type: "Network",
      status: "Failed",
      progress: 60,
      vulnerabilities: { critical: 3, high: 4, medium: 2, low: 1 },
      lastScan: "Yesterday",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-600";
      case "Scheduled":
        return "bg-gray-200 text-gray-600";
      case "Failed":
        return "bg-red-100 text-red-600";
      default:
        return "";
    }
  };

  const badgeStyle = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-yellow-400",
    low: "bg-green-500",
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      
      <Slider/>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">

        {/* Stats Bar */}
           
           <Stats/>

        {/* Toolbar */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search scans..."
            className="border rounded-lg px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <div className="flex space-x-3">
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
              Filter
            </button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
              Columns
            </button>
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              New Scan
            </button>
          </div>
        </div>

        {/* Scan Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="p-4">Scan Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Progress</th>
                <th className="p-4">Vulnerabilities</th>
                <th className="p-4">Last Scan</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan, index) => (
                <tr key={index} className="border-t">
                  <td className="p-4 font-medium">{scan.name}</td>
                  <td className="p-4">{scan.type}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        scan.status
                      )}`}
                    >
                      {scan.status}
                    </span>
                  </td>
                  <td className="p-4 w-40">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-teal-600 h-2 rounded-full"
                        style={{ width: `${scan.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {scan.progress}%
                    </span>
                  </td>
                  <td className="p-4 space-x-2">
                    {Object.entries(scan.vulnerabilities).map(
                      ([key, value]) =>
                        value > 0 && (
                          <span
                            key={key}
                            className={`text-white text-xs px-2 py-1 rounded-full ${badgeStyle[key]}`}
                          >
                            {value}
                          </span>
                        )
                    )}
                  </td>
                  <td className="p-4 text-gray-500">{scan.lastScan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}