import React from 'react';

// Devopstrio AVD Multi-Region DR
// Resilience Command Center Dashboard

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
            {/* Global Navigation */}
            <header className="border-b border-indigo-500/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-screen-2xl mx-auto px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-rose-600 flex items-center justify-center font-black text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-white/10">
                            DR
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tight">RESILIENCE HUB</h1>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none mt-1">Multi-Region Control Plane</p>
                        </div>
                    </div>
                    <nav className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                        <a href="#" className="text-indigo-400 border-b-2 border-indigo-500 pb-8 pt-8">Global Health</a>
                        <a href="#" className="hover:text-slate-200 transition-colors pt-8 pb-8">Region Topology</a>
                        <a href="#" className="hover:text-slate-200 transition-colors pt-8 pb-8 text-rose-400">Failover Center</a>
                        <a href="#" className="hover:text-slate-200 transition-colors pt-8 pb-8">Profile Sync</a>
                        <a href="#" className="hover:text-slate-200 transition-colors pt-8 pb-8">DR Drills</a>
                    </nav>
                </div>
            </header>

            <main className="max-w-screen-2xl mx-auto px-8 py-10">

                {/* Resilience Intelligence Scorecards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Global Readiness Score', value: '98%', status: 'Compliant', color: 'indigo' },
                        { label: 'Avg. RTO (Actual)', value: '18.4m', status: 'Target: 30m', color: 'emerald' },
                        { label: 'Profile Sync Lag', value: '12s', status: 'Near-Realtime', color: 'blue' },
                        { label: 'Standby Capacity', value: '100%', status: 'Reserved', color: 'purple' }
                    ].map((kpi, idx) => (
                        <div key={idx} className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
                            <div className={`absolute -right-8 -top-8 w-32 h-32 bg-${kpi.color}-500/5 rounded-full blur-3xl`}></div>
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">{kpi.label}</h4>
                            <div className="text-4xl font-black text-white font-mono tracking-tighter">{kpi.value}</div>
                            <div className={`text-[10px] font-black mt-4 uppercase tracking-widest px-3 py-1 bg-${kpi.color}-500/10 border border-${kpi.color}-500/20 inline-block rounded-full text-${kpi.color}-400`}>
                                {kpi.status}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">

                    {/* Regional Health Topology View */}
                    <div className="xl:col-span-2 bg-slate-900 rounded-[2.5rem] border border-slate-800 p-10 shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Regional Topology Health</h2>
                                <p className="text-slate-400 text-sm mt-1">Real-time telemetry from globally paired AVD regions.</p>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                                Monitoring 12 Clusters
                            </div>
                        </div>

                        {/* Visual Region Map Representation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { name: 'UK South (Primary)', status: 'ACTIVE', hosts: 450, latency: '8ms', health: 'Healthy' },
                                { name: 'UK West (Secondary)', status: 'STANDBY', hosts: 45, latency: '12ms', health: 'Healthy' },
                                { name: 'US East 2 (Primary)', status: 'ACTIVE', hosts: 1200, latency: '18ms', health: 'Healthy' },
                                { name: 'US Central (Secondary)', status: 'STANDBY', hosts: 120, latency: '24ms', health: 'Healthy' }
                            ].map((region, idx) => (
                                <div key={idx} className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 relative group overflow-hidden">
                                    <div className={`absolute top-0 right-0 h-full w-1 ${region.status === 'ACTIVE' ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-slate-200">{region.name}</h3>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${region.status === 'ACTIVE' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                                            {region.status}
                                        </span>
                                    </div>
                                    <div className="flex gap-6 mt-6">
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase">Live Nodes</div>
                                            <div className="text-xl font-bold text-white font-mono">{region.hosts}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase">Ping</div>
                                            <div className="text-xl font-bold text-indigo-400 font-mono">{region.latency}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Failover Control Center */}
                    <div className="bg-gradient-to-br from-indigo-950/20 to-slate-950 rounded-[2.5rem] border border-indigo-500/20 p-10 shadow-2xl flex flex-col items-center text-center justify-between">
                        <div>
                            <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 mx-auto shadow-inner group-hover:border-rose-500/30 transition-all">
                                <svg className="w-10 h-10 text-rose-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-3">Targeted Failover</h3>
                            <p className="text-sm text-slate-400 px-4 leading-relaxed mb-8">
                                Initiate regional cutover for isolated workloads or full estate evacuation during regional degradation.
                            </p>

                            <div className="space-y-4 text-left w-full">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Select Primary Region</div>
                                <select className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none">
                                    <option>UK South (Active)</option>
                                    <option>US East 2 (Active)</option>
                                </select>
                            </div>
                        </div>

                        <button className="w-full bg-rose-600 hover:bg-rose-500 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_30px_rgba(225,29,72,0.2)] mt-10 border border-rose-500/50">
                            Execute Emergency Failover
                        </button>
                    </div>

                </div>

                {/* Secondary Resilience Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
                    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Profile Sync Integrity</h4>
                        <div className="space-y-6">
                            {[
                                { name: 'General Workforce Profiles', status: 'Primary Mirror', lag: '2s' },
                                { name: 'Engineering VHDX Backup', status: 'Secondary Sync', lag: '45s' }
                            ].map((sync, idx) => (
                                <div key={idx} className="flex justify-between items-center group">
                                    <div>
                                        <div className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">{sync.name}</div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">{sync.status}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-black text-emerald-400 font-mono">{sync.lag}</div>
                                        <div className="text-[9px] text-slate-600 font-black uppercase">Delay</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
                        <div className="flex justify-between items-center">
                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Next DR Exercise</h4>
                            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full uppercase">Scheduled</span>
                        </div>
                        <div className="flex items-center gap-6 mt-6">
                            <div className="text-4xl font-black text-white font-mono">14d : 22h</div>
                            <div className="text-sm text-slate-400 leading-tight">
                                Simulated region loss drill for **UK Cluster 04**. <br />
                                <span className="text-indigo-400 hover:underline cursor-pointer">View Drill Manifesto</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
