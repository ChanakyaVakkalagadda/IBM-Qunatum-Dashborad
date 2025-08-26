import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function Dashboard() {
  const [data, setData] = useState(null); // stores single job result
  const [jobs, setJobs] = useState([]);   // stores job history
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Run a new Bell circuit
  const runBellCircuit = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/run-bell");
      if (!response.ok) {
        throw new Error("Backend error while running circuit");
      }
      const result = await response.json();
      console.log("Received job data:", result);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch last 5 jobs
  const fetchJobs = async () => {
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/jobs");
      if (!response.ok) {
        throw new Error("Backend error while fetching jobs");
      }
      const result = await response.json();
      console.log("Job history:", result);
      setJobs(result);
    } catch (err) {
      setError(err.message);
    }
  };

  // Format chart data
  const formatChartData = (counts) => {
    if (!counts) return [];
    return Object.entries(counts).map(([key, value]) => ({
      name: key,
      counts: value,
    }));
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">IBM Quantum Dashboard</h1>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={runBellCircuit}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? "Running..." : "Run Bell Circuit"}
        </button>

        <button
          onClick={fetchJobs}
          className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-800"
        >
          Fetch Job History
        </button>
      </div>

      {error && <p className="text-red-400 mt-4">❌ {error}</p>}

      {/* Job Details (latest run) */}
      {data && (
        <div className="mt-8">
          <h2 className="text-xl mb-2">Job Details</h2>
          <p><strong>Backend:</strong> {data.backend}</p>
          <p><strong>Job ID:</strong> {data.job_id}</p>
          <p><strong>Status:</strong> {data.status}</p>

          <div className="mt-6">
            <h3 className="text-lg mb-2">Measurement Counts</h3>
            <pre className="bg-black p-4 rounded">{JSON.stringify(data.counts, null, 2)}</pre>

            <BarChart width={500} height={300} data={formatChartData(data.counts)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="counts" fill="#4CAF50" />
            </BarChart>
          </div>
        </div>
      )}

      {/* Job History */}
      {jobs.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl mb-4">Recent Jobs</h2>
          <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="px-4 py-2">Job ID</th>
                <th className="px-4 py-2">Backend</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.job_id} className="border-t border-gray-600">
                  <td className="px-4 py-2">{job.job_id}</td>
                  <td className="px-4 py-2">{job.backend}</td>
                  <td className="px-4 py-2">{job.status}</td>
                  <td className="px-4 py-2">{job.creation_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}