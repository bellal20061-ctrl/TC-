
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ReceiptText, 
  Wallet, 
  Download,
  Smartphone,
  X
} from 'lucide-react';
import { ViewType, Customer, Memo, Expense } from './types';
import { SHOP_NAME } from './constants';
import Dashboard from './components/Dashboard';
import CustomerManager from './components/CustomerManager';
import BillingSystem from './components/BillingSystem';
import ExpenseTracker from './components/ExpenseTracker';
import MemoView from './components/MemoView';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [memos, setMemos] = useState<Memo[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeMemo, setActiveMemo] = useState<Memo | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const savedCustomers = localStorage.getItem('shop_customers');
    const savedMemos = localStorage.getItem('shop_memos');
    const savedExpenses = localStorage.getItem('shop_expenses');

    if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
    if (savedMemos) setMemos(JSON.parse(savedMemos));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('shop_customers', JSON.stringify(customers));
      localStorage.setItem('shop_memos', JSON.stringify(memos));
      localStorage.setItem('shop_expenses', JSON.stringify(expenses));
    }
  }, [customers, memos, expenses, loading]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('আপনার ব্রাউজার মেনু থেকে "Add to Home Screen" এ ক্লিক করে ইন্সটল করুন।');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-emerald-600 font-black text-xl">TC</span>
          </div>
        </div>
        <h1 className="text-3xl font-black text-slate-900 mt-8 mb-2">{SHOP_NAME}</h1>
        <p className="text-emerald-500 font-bold animate-pulse tracking-widest uppercase text-xs">সিস্টেম প্রস্তুত হচ্ছে...</p>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {deferredPrompt && (
              <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-200 relative overflow-hidden group transition-all hover:scale-[1.01]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                      <Smartphone size={32} className="text-white" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg font-black tracking-tight uppercase">আপনার শপ অ্যাপটি ইন্সটল করুন</h3>
                      <p className="text-emerald-100 text-sm font-medium">হোম স্ক্রিন থেকে সরাসরি ব্যবহার করার সুবিধা পান।</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleInstallClick}
                    className="w-full sm:w-auto bg-white text-emerald-700 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.15em] transition-all shadow-lg hover:bg-emerald-50 active:scale-95 flex items-center justify-center gap-3"
                  >
                    <Download size={20} />
                    ইন্সটল করুন
                  </button>
                </div>
              </div>
            )}
            <Dashboard customers={customers} memos={memos} expenses={expenses} />
          </div>
        );
      case 'customers':
        return <CustomerManager customers={customers} setCustomers={setCustomers} memos={memos} />;
      case 'billing':
        return <BillingSystem customers={customers} memos={memos} setMemos={setMemos} onViewMemo={(memo) => { setActiveMemo(memo); setCurrentView('memo-view'); }} />;
      case 'expenses':
        return <ExpenseTracker expenses={expenses} setExpenses={setExpenses} />;
      case 'memo-view':
        return activeMemo ? (
          <MemoView 
            memo={activeMemo} 
            customer={customers.find(c => c.id === activeMemo.customerId)}
            onBack={() => setCurrentView('billing')} 
          />
        ) : null;
      default:
        return <Dashboard customers={customers} memos={memos} expenses={expenses} />;
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pl-64 flex flex-col">
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-[#0a0f18] text-white flex-col p-6 z-40 border-r border-slate-800">
        <div className="flex flex-col items-center mb-10 border-b border-slate-800 pb-8">
           <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-emerald-900/40">
             <span className="text-2xl font-black italic text-white">TC</span>
           </div>
           <h1 className="text-lg font-black tracking-tight text-center text-emerald-50">{SHOP_NAME}</h1>
        </div>
        
        <nav className="space-y-2">
          <NavItem active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} icon={<LayoutDashboard size={20} />} label="ড্যাশবোর্ড" />
          <NavItem active={currentView === 'customers'} onClick={() => setCurrentView('customers')} icon={<Users size={20} />} label="কাস্টমার" />
          <NavItem active={currentView === 'billing'} onClick={() => setCurrentView('billing')} icon={<ReceiptText size={20} />} label="মেমো ও বিল" />
          <NavItem active={currentView === 'expenses'} onClick={() => setCurrentView('expenses')} icon={<Wallet size={20} />} label="খরচের হিসাব" />
        </nav>

        <div className="mt-auto pt-6 text-slate-500 text-[10px] text-center uppercase tracking-[0.2em] font-black border-t border-slate-800">
          Powered by Bellal Hasan
        </div>
      </aside>

      <header className="md:hidden bg-[#0a0f18] text-white p-4 sticky top-0 z-40 shadow-xl flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-3">
           <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
             <span className="text-sm font-black italic">TC</span>
           </div>
           <h1 className="text-base font-black tracking-tight">{SHOP_NAME}</h1>
        </div>
        {deferredPrompt && (
          <button onClick={handleInstallClick} className="p-2.5 bg-emerald-600 rounded-xl shadow-lg animate-pulse">
            <Download size={18} />
          </button>
        )}
      </header>

      <main className="flex-1 p-4 md:p-10 max-w-6xl mx-auto w-full">
        {renderView()}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 flex justify-around p-3 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] pb-safe">
        <MobileNavItem active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} icon={<LayoutDashboard size={24} />} label="হোম" />
        <MobileNavItem active={currentView === 'customers'} onClick={() => setCurrentView('customers')} icon={<Users size={24} />} label="কাস্টমার" />
        <MobileNavItem active={currentView === 'billing'} onClick={() => setCurrentView('billing')} icon={<ReceiptText size={24} />} label="বিল" />
        <MobileNavItem active={currentView === 'expenses'} onClick={() => setCurrentView('expenses')} icon={<Wallet size={24} />} label="খরচ" />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-3 w-full p-4 rounded-2xl transition-all duration-300 ${active ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40 translate-x-1' : 'hover:bg-slate-800 text-slate-400'}`}
  >
    <div className={`${active ? 'scale-110' : ''} transition-transform`}>{icon}</div>
    <span className="font-bold text-sm tracking-wide">{label}</span>
  </button>
);

const MobileNavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center p-1 min-w-[70px] transition-all duration-300 ${active ? 'scale-110' : ''}`}
  >
    <div className={`p-2.5 rounded-2xl transition-all duration-300 ${active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-400'}`}>
      {icon}
    </div>
    <span className={`text-[10px] mt-1.5 font-black uppercase tracking-widest ${active ? 'text-emerald-700' : 'text-slate-500'}`}>{label}</span>
  </button>
);

export default App;
