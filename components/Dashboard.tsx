
import React from 'react';
import { Customer, Memo, Expense } from '../types';
import { TrendingUp, Users, Wallet, AlertCircle, ReceiptText, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  customers: Customer[];
  memos: Memo[];
  expenses: Expense[];
}

const Dashboard: React.FC<DashboardProps> = ({ customers, memos, expenses }) => {
  const totalSales = memos.reduce((sum, m) => sum + m.totalBill, 0);
  const totalDue = memos.reduce((sum, m) => sum + m.dueAmount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalSales - totalExpenses;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">ড্যাশবোর্ড</h2>
          <p className="text-slate-500 font-bold text-sm mt-1">আপনার দোকানের আজকের সর্বশেষ আপডেট</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-100 hidden sm:flex items-center gap-2">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           <span className="text-xs font-black uppercase tracking-wider">সিস্টেম একটিভ</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="মোট বিক্রি" 
          value={totalSales} 
          icon={<TrendingUp size={24} />} 
          gradient="from-emerald-600 to-teal-700"
          accent="bg-emerald-400/20"
        />
        <StatCard 
          title="মোট বাকি" 
          value={totalDue} 
          icon={<AlertCircle size={24} />} 
          gradient="from-rose-500 to-orange-600"
          accent="bg-rose-400/20"
        />
        <StatCard 
          title="মোট খরচ" 
          value={totalExpenses} 
          icon={<Wallet size={24} />} 
          gradient="from-slate-700 to-slate-900"
          accent="bg-slate-400/20"
        />
        <StatCard 
          title="মোট লাভ" 
          value={netProfit} 
          icon={<ArrowUpRight size={24} />} 
          gradient="from-blue-600 to-indigo-700"
          accent="bg-blue-400/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 transition-all hover:shadow-md">
          <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
            <h3 className="font-black text-xl flex items-center gap-3 text-slate-800">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Users size={22} />
              </div>
              সাম্প্রতিক কাস্টমার
            </h3>
          </div>
          <div className="space-y-4">
            {customers.slice(-5).reverse().map(c => (
              <div key={c.id} className="flex justify-between items-center p-4 hover:bg-emerald-50/40 rounded-2xl transition-all border border-transparent hover:border-emerald-100 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{c.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{c.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{new Date(c.createdAt).toLocaleDateString('bn-BD')}</p>
                </div>
              </div>
            ))}
            {customers.length === 0 && <p className="text-center text-slate-300 py-16 italic font-medium">এখনও কোনো কাস্টমার নেই</p>}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 transition-all hover:shadow-md">
          <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
            <h3 className="font-black text-xl flex items-center gap-3 text-slate-800">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <ReceiptText size={22} />
              </div>
              সাম্প্রতিক লেনদেন
            </h3>
          </div>
          <div className="space-y-4">
            {memos.slice(-5).reverse().map(m => (
              <div key={m.id} className="flex justify-between items-center p-4 hover:bg-emerald-50/40 rounded-2xl transition-all border border-transparent hover:border-emerald-100 group">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-emerald-600 transition-colors">
                     <ReceiptText size={20} />
                   </div>
                  <div>
                    <p className="font-bold text-slate-900">মেমো: {m.memoNumber}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase mt-0.5">{new Date(m.date).toLocaleDateString('bn-BD')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900 text-lg leading-none">৳{m.totalBill.toLocaleString('bn-BD')}</p>
                  <p className={`text-[10px] font-black uppercase mt-1.5 tracking-wider ${m.dueAmount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {m.dueAmount > 0 ? `বাকি: ৳${m.dueAmount.toLocaleString('bn-BD')}` : 'পরিশোধিত'}
                  </p>
                </div>
              </div>
            ))}
            {memos.length === 0 && <p className="text-center text-slate-300 py-16 italic font-medium">এখনও কোনো লেনদেন নেই</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; gradient: string; accent: string }> = ({ title, value, icon, gradient, accent }) => (
  <div className={`bg-gradient-to-br ${gradient} p-7 rounded-[2.25rem] shadow-xl text-white relative overflow-hidden group transition-all hover:-translate-y-1`}>
    <div className={`absolute top-0 right-0 w-24 h-24 ${accent} rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
    <div className="relative z-10 flex flex-col h-full">
      <div className="bg-white/20 p-3 rounded-2xl w-fit mb-4">
        {icon}
      </div>
      <div>
        <p className="text-white/70 text-xs font-black uppercase tracking-[0.2em] mb-1.5">{title}</p>
        <p className="text-3xl font-black tracking-tight leading-none">৳{value.toLocaleString('bn-BD')}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
