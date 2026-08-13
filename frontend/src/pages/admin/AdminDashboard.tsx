import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  UserPlus, Grid3x3, Handshake, Bell, FileText, TrendingUp,
  UserCheck, CreditCard, Users, ListFilter, Calendar, Lock,
  Megaphone,
} from 'lucide-react';

/* ── Mock Data matching screenshot exactly ─────────────────────── */
const SUMMARY = { totalVotes: 24560, revenue: 2456000, voters: 5432, nominees: 87, daysLeft: 10 };

const VOTES_BY_DAY = [
  { date: 'May 12', votes: 3100 },
  { date: 'May 13', votes: 4200 },
  { date: 'May 14', votes: 5100 },
  { date: 'May 15', votes: 7100 },
  { date: 'May 16', votes: 5900 },
  { date: 'May 17', votes: 4300 },
  { date: 'May 18', votes: 4800 },
];

const VOTES_BY_CATEGORY = [
  { name: 'Rider Awards', value: 33, color: '#0B8E36' },
  { name: 'Motorcycle Excellence', value: 25, color: '#D61F26' },
  { name: 'Riders Clubs', value: 18, color: '#F59E0B' },
  { name: 'Industry Awards', value: 12, color: '#2563EB' },
  { name: 'Media Awards', value: 7, color: '#7C3AED' },
  { name: 'Special Honours', value: 5, color: '#94A3B8' },
];

const TOP_NOMINEES = [
  { rank: 1, name: 'John Mwangi', category: 'Rider of the Year', votes: 2458, img: '/nominee_rider_1.jpg' },
  { rank: 2, name: 'James Odhiambo', category: 'Rider of the Year', votes: 1945, img: '/nominee_bike_2.jpg' },
  { rank: 3, name: 'Peter Kimani', category: 'Rider of the Year', votes: 1622, img: '/nominee_rider_3.jpg' },
  { rank: 4, name: 'David Kiptoo', category: 'Rider of the Year', votes: 1510, img: '/nominee_riders_club.jpg' },
  { rank: 5, name: 'Kevin Wanjala', category: 'Rider of the Year', votes: 1320, img: '/cat_rider_awards.jpg' },
];

const RECENT_PAYMENTS = [
  { txn: 'TXN-24560', voter: 'Brian Mwangi', method: 'M-Pesa', amount: '100', status: 'Success', time: '2 mins ago', provider: 'paystack' },
  { txn: 'TXN-24559', voter: 'Mary Wanjiku', method: 'Airtel Money', amount: '100', status: 'Success', time: '5 mins ago', provider: 'paystack' },
  { txn: 'TXN-24558', voter: 'Kevin Otieno', method: 'Visa', amount: '100', status: 'Success', time: '8 mins ago', provider: 'paystack' },
  { txn: 'TXN-24557', voter: 'Grace Akinyi', method: 'Mastercard', amount: '100', status: 'Success', time: '12 mins ago', provider: 'paystack' },
  { txn: 'TXN-24556', voter: 'Peter Njuguna', method: 'M-Pesa', amount: '100', status: 'Pending', time: '15 mins ago', provider: 'paystack' },
];

const RECENT_ACTIVITY = [
  { icon: Lock, title: 'Payment received from Brian M.', desc: 'KES 100 via M-Pesa', time: '2 mins ago', bg: 'bg-[#0B8E36]/10 text-[#0B8E36]' },
  { icon: UserCheck, title: 'New vote cast in Rider Awards', desc: 'John Mwangi received a vote', time: '3 mins ago', bg: 'bg-[#D61F26]/10 text-[#D61F26]' },
  { icon: Users, title: 'Nominee added', desc: 'Best Mechanic category', time: '10 mins ago', bg: 'bg-[#F59E0B]/10 text-[#F59E0B]' },
  { icon: Handshake, title: 'Sponsor updated', desc: 'TVS Kenya updated their profile', time: '20 mins ago', bg: 'bg-[#2563EB]/10 text-[#2563EB]' },
  { icon: FileText, title: 'News published', desc: 'New festival update published', time: '30 mins ago', bg: 'bg-[#7C3AED]/10 text-[#7C3AED]' },
];

const QUICK_ACTIONS = [
  { label: 'Add Nominee', sub: 'Register a new nominee', icon: UserPlus, bg: 'bg-[#0B8E36]/10 text-[#0B8E36]' },
  { label: 'Add Category', sub: 'Create a new category', icon: Grid3x3, bg: 'bg-[#D61F26]/10 text-[#D61F26]' },
  { label: 'Manage Sponsors', sub: 'View and manage sponsors', icon: Handshake, bg: 'bg-[#F59E0B]/10 text-[#F59E0B]' },
  { label: 'Send Notification', sub: 'Send announcement', icon: Megaphone, bg: 'bg-[#2563EB]/10 text-[#2563EB]' },
  { label: 'Generate Report', sub: 'Download system reports', icon: FileText, bg: 'bg-[#7C3AED]/10 text-[#7C3AED]' },
];

const RANK_BADGES: Record<number, string> = {
  1: 'bg-[#F5C542] text-white',
  2: 'bg-[#94A3B8] text-white',
  3: 'bg-[#B45309] text-white',
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">

      {/* ── TOP STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Votes */}
        <StatCard
          icon={<UserPlus size={20} className="text-white" />}
          iconBg="bg-[#0B8E36]"
          label="Total Votes"
          value={SUMMARY.totalVotes.toLocaleString()}
          sub={<span className="text-[#0B8E36] flex items-center gap-0.5"><TrendingUp size={11} /> 18.6% <span className="text-brand-ink/40 font-normal">from yesterday</span></span>}
        />
        {/* Total Revenue */}
        <StatCard
          icon={<CreditCard size={20} className="text-white" />}
          iconBg="bg-[#D61F26]"
          label="Total Revenue"
          value={`KES ${SUMMARY.revenue.toLocaleString()}`}
          sub={<span className="text-[#0B8E36] flex items-center gap-0.5"><TrendingUp size={11} /> 16.3% <span className="text-brand-ink/40 font-normal">from yesterday</span></span>}
        />
        {/* Registered Voters */}
        <StatCard
          icon={<Users size={20} className="text-white" />}
          iconBg="bg-[#F59E0B]"
          label="Registered Voters"
          value={SUMMARY.voters.toLocaleString()}
          sub={<span className="text-[#0B8E36] flex items-center gap-0.5"><TrendingUp size={11} /> 9.7% <span className="text-brand-ink/40 font-normal">from yesterday</span></span>}
        />
        {/* Total Nominees */}
        <StatCard
          icon={<ListFilter size={20} className="text-white" />}
          iconBg="bg-[#2563EB]"
          label="Total Nominees"
          value={String(SUMMARY.nominees)}
          sub={<a href="/admin/nominees" className="text-brand-ink/50 hover:text-brand-green font-medium">View all nominees</a>}
        />
        {/* Days Left */}
        <StatCard
          icon={<Calendar size={20} className="text-white" />}
          iconBg="bg-[#7C3AED]"
          label="Days Left"
          value={String(SUMMARY.daysLeft)}
          sub={<span className="text-brand-ink/40 font-normal">To end of voting</span>}
        />
      </div>

      {/* ── MIDDLE ROW: Voting Overview + Votes by Category + Top Nominees ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Voting Overview (Line/Area Chart) */}
        <div className="bg-white rounded-2xl border border-black/5 p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-brand-green">📈</span>
              <h3 className="font-display font-extrabold text-sm text-brand-ink">Voting Overview</h3>
            </div>
            <select className="text-xs bg-black/[0.04] border border-black/5 rounded-lg px-2.5 py-1 font-semibold text-brand-ink/70 outline-none">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>

          <div className="flex items-baseline justify-between mb-4">
            <div>
              <p className="font-display text-2xl font-black text-brand-ink">{SUMMARY.totalVotes.toLocaleString()}</p>
              <p className="text-[11px] text-brand-ink/40 font-medium">Total Votes</p>
            </div>
            <span className="text-xs font-bold text-[#0B8E36] bg-[#0B8E36]/10 px-2.5 py-1 rounded-full flex items-center gap-1">
              <TrendingUp size={12} /> 18.6%
            </span>
          </div>

          <div className="h-[180px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={VOTES_BY_DAY} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B8E36" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0B8E36" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="votes" stroke="#0B8E36" strokeWidth={2.5} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Votes by Category (Donut Chart) */}
        <div className="bg-white rounded-2xl border border-black/5 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-extrabold text-sm text-brand-ink">Votes by Category</h3>
            <button className="text-xs text-brand-ink/50 hover:text-brand-green font-semibold">View Report</button>
          </div>

          <div className="flex items-center gap-4 py-2">
            <div className="w-[140px] h-[140px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={VOTES_BY_CATEGORY} cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={3} dataKey="value">
                    {VOTES_BY_CATEGORY.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: unknown) => `${v}%`} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 space-y-2">
              {VOTES_BY_CATEGORY.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                    <span className="font-semibold text-brand-ink/75 truncate">{c.name}</span>
                  </div>
                  <span className="font-bold text-brand-ink ml-2">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Nominees (All Categories) */}
        <div className="bg-white rounded-2xl border border-black/5 p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-extrabold text-sm text-brand-ink">
              Top Nominees <span className="text-brand-ink/40 font-normal text-xs">(All Categories)</span>
            </h3>
            <button className="text-xs text-brand-ink/50 hover:text-brand-green font-semibold">View All</button>
          </div>

          <div className="space-y-3 flex-1">
            {TOP_NOMINEES.map((n) => (
              <div key={n.rank} className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${RANK_BADGES[n.rank] ?? 'bg-black/10 text-brand-ink'}`}>
                  {n.rank}
                </span>
                <img src={n.img} alt={n.name} className="w-9 h-9 rounded-xl object-cover border border-black/5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-brand-ink truncate leading-tight">{n.name}</p>
                  <p className="text-[10px] font-medium text-brand-ink/45 truncate">{n.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display text-xs font-black text-[#0B8E36]">{n.votes.toLocaleString()}</p>
                  <p className="text-[9px] text-brand-ink/40 font-medium">Votes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── BOTTOM ROW: Recent Payments + Votes by Day + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Payments */}
        <div className="bg-white rounded-2xl border border-black/5 p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-extrabold text-sm text-brand-ink">Recent Payments</h3>
            <button className="text-xs text-brand-ink/50 hover:text-brand-green font-semibold">View All</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-black/5 text-brand-ink/40 uppercase text-[9px] font-extrabold">
                  <th className="pb-2">Transaction ID</th>
                  <th className="pb-2">Voter</th>
                  <th className="pb-2">Method</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] text-[11px] font-medium">
                {RECENT_PAYMENTS.map((p, i) => (
                  <tr key={i} className="hover:bg-black/[0.01]">
                    <td className="py-2.5 font-semibold text-brand-ink/80">{p.txn}</td>
                    <td className="py-2.5 text-brand-ink font-bold">{p.voter}</td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/[0.03] text-[10px] font-bold text-brand-ink/75">
                        <span className={`w-1.5 h-1.5 rounded-full ${p.method === 'M-Pesa' ? 'bg-[#0B8E36]' : p.method === 'Airtel Money' ? 'bg-[#D61F26]' : 'bg-[#2563EB]'}`} />
                        {p.method}
                      </span>
                    </td>
                    <td className="py-2.5 font-bold text-brand-ink">KES {p.amount}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${p.status === 'Success' ? 'bg-[#0B8E36]/10 text-[#0B8E36]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-brand-ink/40 text-[10px]">{p.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Votes by Day (Bar Chart) */}
        <div className="bg-white rounded-2xl border border-black/5 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-extrabold text-sm text-brand-ink">Votes by Day</h3>
            <button className="text-xs text-brand-ink/50 hover:text-brand-green font-semibold">View Report</button>
          </div>

          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VOTES_BY_DAY} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="votes" fill="#0B8E36" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-black/5 p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-extrabold text-sm text-brand-ink">Recent Activity</h3>
            <button className="text-xs text-brand-ink/50 hover:text-brand-green font-semibold">View All</button>
          </div>

          <div className="space-y-3.5 flex-1">
            {RECENT_ACTIVITY.map((act, i) => {
              const Icon = act.icon;
              return (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${act.bg}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-brand-ink leading-tight">{act.title}</p>
                    <p className="text-[11px] text-brand-ink/50 mt-0.5">{act.desc}</p>
                  </div>
                  <span className="text-[10px] text-brand-ink/40 font-medium shrink-0">{act.time}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── QUICK ACTIONS ROW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {QUICK_ACTIONS.map((qa, i) => {
          const Icon = qa.icon;
          return (
            <button
              key={i}
              className="bg-white rounded-2xl border border-black/5 p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3.5 text-left group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${qa.bg} group-hover:scale-105 transition-transform`}>
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-brand-ink group-hover:text-brand-green transition-colors leading-tight">{qa.label}</p>
                <p className="text-[10px] text-brand-ink/45 font-medium mt-0.5 truncate">{qa.sub}</p>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}

/* ── Stat Card Component ───────────────────────────── */
function StatCard({
  icon, iconBg, label, value, sub,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  sub: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 p-4 shadow-sm flex items-center gap-3.5">
      <div className={`w-11 h-11 rounded-2xl ${iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold text-brand-ink/50 leading-tight">{label}</p>
        <p className="font-display text-xl font-black text-brand-ink leading-tight mt-0.5">{value}</p>
        <div className="text-[10px] font-semibold mt-1">{sub}</div>
      </div>
    </div>
  );
}
