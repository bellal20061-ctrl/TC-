
import React, { useState } from 'react';
import { Customer, Memo } from '../types';
// Fixed: Added 'Users' to the imports from lucide-react
import { Plus, Search, Phone, Edit2, Trash2, MessageCircle, UserPlus, X, Users } from 'lucide-react';
import { SHOP_NAME } from '../constants';

interface CustomerManagerProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  memos: Memo[];
}

const CustomerManager: React.FC<CustomerManagerProps> = ({ customers, setCustomers, memos }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', address: '' });

  const getDueAmount = (customerId: string) => {
    return memos.filter(m => m.customerId === customerId).reduce((sum, m) => sum + m.dueAmount, 0);
  };

  const getLastDueDays = (customerId: string) => {
    const customerMemos = memos.filter(m => m.customerId === customerId && m.dueAmount > 0);
    if (customerMemos.length === 0) return 0;
    const oldestMemoDate = Math.min(...customerMemos.map(m => m.date));
    const diff = Date.now() - oldestMemoDate;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getPriorityColor = (days: number) => {
    if (days >= 7) return 'bg-rose-100 text-rose-700 border-rose-200';
    if (days >= 3) return 'bg-amber-100 text-amber-700 border-amber-200';
    if (days > 0) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) return;

    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...c, ...newCustomer } : c));
      setEditingCustomer(null);
    } else {
      const customer: Customer = {
        ...newCustomer,
        id: Date.now().toString(),
        createdAt: Date.now(),
      };
      setCustomers([...customers, customer]);
    }
    setNewCustomer({ name: '', phone: '', address: '' });
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই কাস্টমারটি ডিলিট করতে চান?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const sendReminder = (customer: Customer, due: number) => {
    const message = `প্রিয় ${customer.name},\nআপনার বাকি রয়েছে ৳${due}।\nদয়া করে দ্রুত পরিশোধ করুন।\n— ${SHOP_NAME}`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/88${customer.phone}?text=${encoded}`, '_blank');
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">কাস্টমার ম্যানেজমেন্ট</h2>
        <button 
          onClick={() => {
            setEditingCustomer(null);
            setNewCustomer({ name: '', phone: '', address: '' });
            setShowAddModal(true);
          }}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 w-full sm:w-auto justify-center"
        >
          <UserPlus size={20} />
          নতুন কাস্টমার
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCustomers.map(c => {
          const due = getDueAmount(c.id);
          const days = getLastDueDays(c.id);
          return (
            <div key={c.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg leading-tight">{c.name}</h3>
                    <div className="text-gray-500 flex items-center gap-1 text-sm">
                      <Phone size={14} />
                      <a 
                        href={`tel:${c.phone}`} 
                        className="hover:text-indigo-600 hover:underline transition-colors"
                        title="কল করতে ক্লিক করুন"
                      >
                        {c.phone}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      setEditingCustomer(c);
                      setNewCustomer({ name: c.name, phone: c.phone, address: c.address });
                      setShowAddModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(c.id)}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">মোট বাকি</span>
                  <div className={`px-3 py-1 rounded-lg border text-sm font-bold ${getPriorityColor(days)}`}>
                    ৳{due.toLocaleString('bn-BD')}
                  </div>
                </div>
                {due > 0 && (
                  <button 
                    onClick={() => sendReminder(c, due)}
                    className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors"
                  >
                    <MessageCircle size={18} />
                    তাগাদা দিন
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {filteredCustomers.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400">
            <Users size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">কোন কাস্টমার পাওয়া যায়নি</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">{editingCustomer ? 'কাস্টমার এডিট করুন' : 'নতুন কাস্টমার যোগ করুন'}</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddOrUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">কাস্টমারের নাম *</label>
                <input 
                  required
                  type="text" 
                  value={newCustomer.name}
                  onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="যেমন: রহিম আহমেদ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল নম্বর *</label>
                <input 
                  required
                  type="tel" 
                  value={newCustomer.phone}
                  onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="যেমন: 01700000000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ঠিকানা</label>
                <textarea 
                  value={newCustomer.address}
                  onChange={e => setNewCustomer({...newCustomer, address: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                  placeholder="যেমন: মিরপুর, ঢাকা"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 mt-4"
              >
                {editingCustomer ? 'আপডেট করুন' : 'সেভ করুন'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManager;
