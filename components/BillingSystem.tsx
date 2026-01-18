
import React, { useState } from 'react';
import { Customer, Memo, ServiceItem } from '../types';
import { Plus, Trash2, Save, ShoppingCart, User, ChevronRight, X, Sparkles } from 'lucide-react';
import { SERVICE_LIST } from '../constants';

interface BillingSystemProps {
  customers: Customer[];
  memos: Memo[];
  setMemos: React.Dispatch<React.SetStateAction<Memo[]>>;
  onViewMemo: (memo: Memo) => void;
}

const BillingSystem: React.FC<BillingSystemProps> = ({ customers, memos, setMemos, onViewMemo }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [newItem, setNewItem] = useState({ name: SERVICE_LIST[0], unitPrice: 0, quantity: 1 });

  const addItem = () => {
    if (newItem.unitPrice <= 0 || newItem.quantity <= 0) return;
    const item: ServiceItem = {
      id: Date.now().toString(),
      name: newItem.name,
      unitPrice: newItem.unitPrice,
      quantity: newItem.quantity,
      total: newItem.unitPrice * newItem.quantity
    };
    setItems([...items, item]);
    setNewItem({ ...newItem, unitPrice: 0, quantity: 1 });
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const totalBill = items.reduce((sum, i) => sum + i.total, 0);
  const dueAmount = Math.max(0, totalBill - paidAmount);

  const handleSave = () => {
    if (!selectedCustomerId || items.length === 0) {
      alert('দয়া করে কাস্টমার এবং অন্তত একটি কাজ নির্বাচন করুন।');
      return;
    }

    const memo: Memo = {
      id: Date.now().toString(),
      customerId: selectedCustomerId,
      items,
      totalBill,
      paidAmount,
      dueAmount,
      date: Date.now(),
      memoNumber: `MEMO-${Date.now().toString().slice(-6)}`
    };

    setMemos([...memos, memo]);
    onViewMemo(memo);
    
    setSelectedCustomerId('');
    setItems([]);
    setPaidAmount(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10 animate-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <User size={22} />
            </div>
            কাস্টমার নির্বাচন
          </h2>
          <select 
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full p-5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none bg-slate-50 text-lg font-bold appearance-none cursor-pointer transition-all"
          >
            <option value="">কাস্টমার বাছাই করুন...</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>
            ))}
          </select>
          {customers.length === 0 && (
            <p className="mt-3 text-sm text-rose-500 font-bold ml-1">সিস্টেমে কোনো কাস্টমার নেই, আগে কাস্টমার যোগ করুন।</p>
          )}
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Plus size={22} />
            </div>
            নতুন আইটেম যোগ করুন
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
            <div className="sm:col-span-1">
              <label className="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2 ml-1">কাজের ধরন</label>
              <select 
                value={newItem.name}
                onChange={e => setNewItem({...newItem, name: e.target.value})}
                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none"
              >
                {SERVICE_LIST.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2 ml-1">ইউনিট মূল্য (৳)</label>
              <input 
                type="number" 
                value={newItem.unitPrice || ''}
                onChange={e => setNewItem({...newItem, unitPrice: Number(e.target.value)})}
                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 font-black focus:ring-4 focus:ring-emerald-500/10 outline-none"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2 ml-1">পরিমাণ</label>
              <input 
                type="number" 
                value={newItem.quantity}
                onChange={e => setNewItem({...newItem, quantity: Number(e.target.value)})}
                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 font-black focus:ring-4 focus:ring-emerald-500/10 outline-none"
                placeholder="1"
              />
            </div>
          </div>
          <button 
            onClick={addItem}
            className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 active:scale-95"
          >
            <Plus size={20} /> আইটেম যোগ করুন
          </button>

          <div className="mt-10 space-y-4">
            {items.map(i => (
              <div key={i.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                <div className="flex-1">
                  <h4 className="font-black text-slate-800">{i.name}</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">৳{i.unitPrice} x {i.quantity}</p>
                </div>
                <div className="flex items-center gap-6">
                  <p className="font-black text-emerald-600 text-lg">৳{i.total.toLocaleString('bn-BD')}</p>
                  <button onClick={() => removeItem(i.id)} className="text-rose-300 hover:text-rose-600 p-2.5 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="py-20 text-center text-slate-300 font-bold italic border-4 border-dashed border-slate-50 rounded-[3rem] flex flex-col items-center gap-3">
                <Sparkles size={40} className="opacity-20" />
                তালিকায় আইটেম যোগ করুন
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 sticky top-24">
          <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <ShoppingCart size={22} />
            </div>
            বিল পেমেন্ট
          </h2>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center p-6 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-[2rem] shadow-xl shadow-emerald-200">
              <span className="font-black text-xs uppercase tracking-widest opacity-80">মোট বিল</span>
              <span className="text-3xl font-black">৳{totalBill.toLocaleString('bn-BD')}</span>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3 ml-1">জমা প্রদান (৳)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={paidAmount || ''}
                  onChange={e => setPaidAmount(Number(e.target.value))}
                  className="w-full p-5 rounded-[1.5rem] border-2 border-slate-100 text-3xl font-black text-slate-900 outline-none focus:border-emerald-500 transition-all text-center bg-slate-50"
                  placeholder="0"
                />
              </div>
            </div>

            <div className={`flex justify-between items-center p-6 rounded-[1.5rem] border ${dueAmount > 0 ? 'bg-rose-50 border-rose-100 text-rose-900' : 'bg-emerald-50 border-emerald-100 text-emerald-900'}`}>
              <span className="font-black text-xs uppercase tracking-widest opacity-70">অবশিষ্ট বাকি</span>
              <span className="text-2xl font-black">৳{dueAmount.toLocaleString('bn-BD')}</span>
            </div>

            <button 
              disabled={items.length === 0 || !selectedCustomerId}
              onClick={handleSave}
              className={`w-full py-6 rounded-[2rem] font-black text-base uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl transition-all mt-6 active:scale-95 ${
                items.length === 0 || !selectedCustomerId 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 hover:shadow-emerald-300'
              }`}
            >
              <Save size={24} />
              বিল সেভ ও প্রিন্ট
            </button>
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">
               মেমোটি অটোমেটিক জেনারেট হবে
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSystem;
