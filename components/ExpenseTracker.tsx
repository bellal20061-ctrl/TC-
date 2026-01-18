
import React, { useState } from 'react';
import { Expense } from '../types';
import { Plus, Trash2, Wallet, Calendar, Tag, CreditCard } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../constants';

interface ExpenseTrackerProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ expenses, setExpenses }) => {
  const [newExpense, setNewExpense] = useState({ category: EXPENSE_CATEGORIES[0], amount: 0, note: '' });

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExpense.amount <= 0) return;

    const expense: Expense = {
      id: Date.now().toString(),
      ...newExpense,
      date: Date.now()
    };

    setExpenses([...expenses, expense]);
    setNewExpense({ category: EXPENSE_CATEGORIES[0], amount: 0, note: '' });
  };

  const deleteExpense = (id: string) => {
    if (window.confirm('এই খরচের হিসাবটি ডিলিট করতে চান?')) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  const totalThisMonth = expenses
    .filter(e => new Date(e.date).getMonth() === new Date().getMonth())
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">খরচের হিসাব</h2>
        <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-bold text-sm">
          চলতি মাসে: ৳{totalThisMonth.toLocaleString('bn-BD')}
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <form onSubmit={addExpense} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">ক্যাটাগরি</label>
            <select 
              value={newExpense.category}
              onChange={e => setNewExpense({...newExpense, category: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500"
            >
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">টাকার পরিমাণ</label>
            <input 
              required
              type="number" 
              value={newExpense.amount || ''}
              onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500"
              placeholder="0.00"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">নোট (ঐচ্ছিক)</label>
            <input 
              type="text" 
              value={newExpense.note}
              onChange={e => setNewExpense({...newExpense, note: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500"
              placeholder="বিস্তারিত লিখুন..."
            />
          </div>
          <button 
            type="submit"
            className="bg-amber-500 text-white p-3 rounded-xl font-bold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-100"
          >
            <Plus size={20} /> সেভ করুন
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {expenses.slice().reverse().map(e => (
          <div key={e.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between hover:border-amber-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                <CreditCard size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{e.category}</h4>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(e.date).toLocaleDateString('bn-BD')}</span>
                  {e.note && <span className="flex items-center gap-1"><Tag size={12} /> {e.note}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-black text-rose-500">- ৳{e.amount}</span>
              <button onClick={() => deleteExpense(e.id)} className="text-gray-300 hover:text-rose-500 transition-colors p-2">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {expenses.length === 0 && (
          <div className="py-20 text-center text-gray-300">
            <Wallet size={48} className="mx-auto mb-4 opacity-10" />
            <p>এখন পর্যন্ত কোন খরচ যোগ করা হয়নি</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;
