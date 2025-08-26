import React, { useState, useEffect } from 'react';
import {
  Activity, Cpu, Clock, Users, Zap, CheckCircle, AlertCircle, XCircle,
  RefreshCw, BarChart3, TrendingUp, PieChart, LineChart
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

export default function QuantumDashboard() {
  const [jobs, setJobs] = useState([]);
  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0, runningJobs: 0, queuedJobs: 0, completedJobs: 0, avgWaitTime: 0
  });
  const [selectedDevice, setSelectedDevice] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [queueHistory, setQueueHistory] = useState([]);
  const [deviceUtilization, setDeviceUtilization] = useState([]);

  const mockDevices = [
    { name: 'ibm_brisbane', qubits: 127, status: 'online', pending_jobs: 23, avg_queue_time: '2.5 hrs' },
    { name: 'ibm_kyoto', qubits: 127, status: 'online', pending_jobs: 18, avg_queue_time: '1.8 hrs' },
    { name: 'ibm_osaka', qubits: 127, status: 'maintenance', pending_jobs: 0, avg_queue_time: 'N/A' },
    { name: 'ibm_sherbrooke', qubits: 127, status: 'online', pending_jobs: 31, avg_queue_time: '3.2 hrs' },
    { name: 'ibm_cleveland', qubits: 127, status: 'online', pending_jobs: 15, avg_queue_time: '1.2 hrs' },
    { name: 'ibm_torino', qubits: 133, status: 'online', pending_jobs: 42, avg_queue_time: '4.1 hrs' }
  ];

  const generateQueueHistory = () =>
    Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      running: Math.floor(Math.random() * 30) + 10,
      queued: Math.floor(Math.random() * 50) + 20,
      completed: Math.floor(Math.random() * 40) + 15
    }));

  const generateDeviceUtilization = () =>
    mockDevices.map(d => ({
      name: d.name.replace('ibm_', ''),
      utilization: Math.floor(Math.random() * 80) + 20,
      jobs: d.pending_jobs,
      efficiency: Math.floor(Math.random() * 20) + 80
    }));

  const generateMockJobs = () => {
    const statuses = ['running', 'queued', 'completed', 'failed'];
    const jobTypes = ['VQE', 'QAOA', 'Grover', 'Shor', 'Circuit', 'Noise Study'];
    const users = ['researcher_1', 'student_42', 'lab_team_a', 'quantum_dev', 'university_x'];
    return Array.from({ length: 50 }, (_, i) => ({
      id: `job_${String(i + 1).padStart(3, '0')}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      device: mockDevices[Math.floor(Math.random() * mockDevices.length)].name,
      type: jobTypes[Math.floor(Math.random() * jobTypes.length)],
      user: users[Math.floor(Math.random() * users.length)],
      qubits_used: Math.floor(Math.random() * 50) + 5,
      shots: Math.pow(10, Math.floor(Math.random() * 4) + 2),
      submitted: new Date(Date.now() - Math.random() * 172800000),
      runtime: Math.floor(Math.random() * 300) + 10,
      queue_position: Math.floor(Math.random() * 100) + 1,
      estimated_start: new Date(Date.now() + Math.random() * 28800000)
    }));
  };

  const updateData = () => {
    const newJobs = generateMockJobs();
    setJobs(newJobs);
    setDevices(mockDevices);
    setQueueHistory(generateQueueHistory());
    setDeviceUtilization(generateDeviceUtilization());
    const running = newJobs.filter(j => j.status === 'running').length;
    const queued = newJobs.filter(j => j.status === 'queued').length;
    const completed = newJobs.filter(j => j.status === 'completed').length;
    const failed = newJobs.filter(j => j.status === 'failed').length;
    setStats({ totalJobs: newJobs.length, runningJobs: running, queuedJobs: queued, completedJobs: completed, failedJobs: failed, avgWaitTime: 2.3 });
    setLastUpdate(new Date());
  };

  useEffect(() => {
    updateData();
    let interval;
    if (autoRefresh) interval = setInterval(updateData, 10000);
    return () => interval && clearInterval(interval);
  }, [autoRefresh]);

  const getStatusIcon = (s) =>
    s === 'running' ? <Activity className="w-4 h-4 text-blue-500" /> :
    s === 'queued' ? <Clock className="w-4 h-4 text-yellow-500" /> :
    s === 'completed' ? <CheckCircle className="w-4 h-4 text-green-500" /> :
    s === 'failed' ? <XCircle className="w-4 h-4 text-red-500" /> :
    <AlertCircle className="w-4 h-4 text-gray-500" />;

  const getStatusColor = (s) =>
    s === 'running' ? 'text-blue-600 bg-blue-50' :
    s === 'queued' ? 'text-yellow-600 bg-yellow-50' :
    s === 'completed' ? 'text-green-600 bg-green-50' :
    s === 'failed' ? 'text-red-600 bg-red-50' :
    'text-gray-600 bg-gray-50';

  const getDeviceStatus = (s) =>
    s === 'online' ? <div className="w-3 h-3 bg-green-500 rounded-full" /> :
    s === 'maintenance' ? <div className="w-3 h-3 bg-yellow-500 rounded-full" /> :
    s === 'offline' ? <div className="w-3 h-3 bg-red-500 rounded-full" /> :
    <div className="w-3 h-3 bg-gray-500 rounded-full" />;

  const filteredJobs = selectedDevice === 'all' ? jobs : jobs.filter(j => j.device === selectedDevice);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              IBM Quantum Live Dashboard
            </h1>
            <p className="text-slate-300 mt-2">Real-time monitoring of quantum computing jobs</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">Last updated: {lastUpdate.toLocaleTimeString()}</div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${autoRefresh ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-600 hover:bg-slate-700'} transition-colors`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto Refresh {autoRefresh ? 'ON' : 'OFF'}
            </button>
            <button onClick={updateData} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              Refresh Now
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {[
            { label: 'Total Jobs', value: stats.totalJobs, icon: <BarChart3 className="w-8 h-8 text-blue-400" /> },
            { label: 'Running', value: <span className="text-blue-400">{stats.runningJobs}</span>, icon: <Activity className="w-8 h-8 text-blue-400" /> },
            { label: 'Queued', value: <span className="text-yellow-400">{stats.queuedJobs}</span>, icon: <Clock className="w-8 h-8 text-yellow-400" /> },
            { label: 'Completed', value: <span className="text-green-400">{stats.completedJobs}</span>, icon: <CheckCircle className="w-8 h-8 text-green-400" /> },
            { label: 'Avg Wait', value: <span className="text-purple-400">{stats.avgWaitTime}h</span>, icon: <TrendingUp className="w-8 h-8 text-purple-400" /> },
          ].map((c, i) => (
            <div key={i} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{c.label}</p>
                  <p className="text-2xl font-bold">{c.value}</p>
                </div>
                {c.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><LineChart className="w-5 h-5" />24-Hour Queue Activity</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={queueHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F9FAFB' }} />
                  <Area type="monotone" dataKey="completed" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="running"   stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="queued"    stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded" /> <span>Completed</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded" /> <span>Running</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded" /> <span>Queued</span></div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><PieChart className="w-5 h-5" />Job Status Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={[
                      { name: 'Running', value: stats.runningJobs, color: '#3B82F6' },
                      { name: 'Queued', value: stats.queuedJobs, color: '#F59E0B' },
                      { name: 'Completed', value: stats.completedJobs, color: '#10B981' },
                      { name: 'Failed', value: stats.failedJobs, color: '#EF4444' },
                    ]}
                    cx="50%" cy="50%" outerRadius={80} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {[ '#3B82F6','#F59E0B','#10B981','#EF4444' ].map((c, i) => <Cell key={i} fill={c} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F9FAFB' }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Device Utilization */}
        <div className="mb-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5" />Device Utilization & Performance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviceUtilization} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F9FAFB' }} />
                <Bar dataKey="utilization" fill="#8B5CF6" name="Utilization %" />
                <Bar dataKey="jobs"        fill="#06B6D4" name="Pending Jobs" />
                <Bar dataKey="efficiency"  fill="#10B981" name="Efficiency %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded" /> <span>Utilization %</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-cyan-500 rounded" /> <span>Pending Jobs</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded" /> <span>Efficiency %</span></div>
          </div>
        </div>

        {/* Devices + Live Jobs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Cpu className="w-5 h-5" />Quantum Devices</h2>
            <div className="space-y-4">
              {devices.map(d => (
                <div key={d.name} className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">{getDeviceStatus(d.status)}<span className="font-medium">{d.name}</span></div>
                    <span className="text-sm text-slate-400">{d.qubits} qubits</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Queue Load</span><span>{d.pending_jobs}/100</span></div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${d.pending_jobs > 30 ? 'bg-red-500' : d.pending_jobs > 15 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${(d.pending_jobs / 50) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Queue: {d.pending_jobs} jobs</span><span>Avg wait: {d.avg_queue_time}</span>
                  </div>
                  {d.status === 'online' && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> <span>Live & Processing</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">All Devices</option>
                {devices.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
              </select>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2"><Activity className="w-5 h-5" />Live Jobs ({filteredJobs.length})</h2>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredJobs.slice(0, 20).map(job => (
                <div key={job.id} className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(job.status)}
                      <span className="font-mono text-sm">{job.id}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(job.status)}`}>{job.status}</span>
                    </div>
                    <span className="text-sm text-slate-400">{job.type}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-400">
                    <div><span className="block text-xs">Device</span><span className="text-white">{job.device}</span></div>
                    <div><span className="block text-xs">User</span><span className="text-white">{job.user}</span></div>
                    <div><span className="block text-xs">Qubits</span><span className="text-white">{job.qubits_used}</span></div>
                    <div><span className="block text-xs">Shots</span><span className="text-white">{job.shots.toLocaleString()}</span></div>
                  </div>
                  {job.status === 'queued' && (
                    <div className="mt-2 text-xs text-slate-400">
                      Position #{job.queue_position} • Est. start: {job.estimated_start.toLocaleTimeString()}
                    </div>
                  )}
                  {job.status === 'running' && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Progress</span><span>{Math.min(100, Math.floor((job.runtime / 300) * 100))}%</span></div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-1000 relative overflow-hidden" style={{ width: `${Math.min(100, (job.runtime / 300) * 100)}%` }}>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex justify-between">
                        <span>Runtime: {Math.floor(job.runtime / 60)}m {job.runtime % 60}s</span>
                        <span className="text-blue-400">● EXECUTING</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Analytics */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><Users className="w-5 h-5" />Advanced Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Clock className="w-4 h-4" />Peak Usage Times</h3>
              <div className="space-y-3">
                {[{ time: '9 AM - 11 AM EST', load: 85, status: 'High' }, { time: '2 PM - 4 PM EST', load: 60, status: 'Medium' }, { time: '8 PM - 10 PM EST', load: 25, status: 'Low' }].map((p,i)=>(
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">{p.time}</span>
                      <span className={`font-medium ${p.status==='High'?'text-red-400':p.status==='Medium'?'text-yellow-4 00':'text-green-400'}`}>{p.status}</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${p.status==='High'?'bg-red-500':p.status==='Medium'?'bg-yellow-500':'bg-green-500'}`} style={{ width: `${p.load}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Zap className="w-4 h-4" />Popular Algorithms</h3>
              <div className="space-y-3">
                {[{ name: 'VQE', percent: 32, color: 'bg-purple-500' }, { name: 'QAOA', percent: 24, color: 'bg-blue-500' }, { name: 'Circuit', percent: 21, color: 'bg-green-500' }, { name: 'Others', percent: 23, color: 'bg-orange-500' }].map((a,i)=>(
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-slate-300">{a.name}</span><span className="text-white font-medium">{a.percent}%</span></div>
                    <div className="w-full bg-slate-600 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${a.color}`} style={{ width: `${a.percent * 3}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4" />System Health</h3>
              <div className="space-y-4">
                {[{ metric:'Device Uptime', value:98.2, target:95, color:'text-green-400' }, { metric:'Success Rate', value:94.7, target:90, color:'text-green-400' }, { metric:'Avg Queue Time', value:2.3, target:3.0, color:'text-yellow-400', unit:'h' }].map((h,i)=>(
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center text-sm"><span className="text-slate-300">{h.metric}</span><span className={`font-bold ${h.color}`}>{h.value}{h.unit || '%'}</span></div>
                    <div className="w-full bg-slate-600 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${h.value>=h.target?'bg-green-500':'bg-yellow-500'}`} style={{ width: `${Math.min(100, (h.value / (h.target * 1.1)) * 100)}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
