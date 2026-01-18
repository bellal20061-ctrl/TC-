
import React, { useState } from 'react';
import { Memo, Customer } from '../types';
import { ChevronLeft, Camera, Printer, Eye } from 'lucide-react';
import { SHOP_NAME, SHOP_ADDRESS, SHOP_PHONE, SHOP_PROPRIETOR } from '../constants';

interface MemoViewProps {
  memo: Memo;
  customer?: Customer;
  onBack: () => void;
}

const MemoView: React.FC<MemoViewProps> = ({ memo, customer, onBack }) => {
  const [isScreenshotMode, setIsScreenshotMode] = useState(false);

  return (
    <div className={`fixed inset-0 z-[100] bg-white flex flex-col ${isScreenshotMode ? 'overflow-hidden' : 'overflow-y-auto'}`}>
      
      {/* Action Bar - Hidden in screenshot mode */}
      {!isScreenshotMode && (
        <div className="no-print bg-slate-900 text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-[110]">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 font-bold hover:text-indigo-400 transition-colors"
          >
            <ChevronLeft size={20} /> পিছনে যান
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsScreenshotMode(true)} 
              className="bg-indigo-600 px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm hover:bg-indigo-700 transition-all"
            >
              <Camera size={18} /> স্ক্রিনশট মুড
            </button>
            <button 
              onClick={() => window.print()} 
              className="bg-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm border border-slate-600 hover:bg-slate-600 transition-all"
            >
              <Printer size={18} /> প্রিন্ট
            </button>
          </div>
        </div>
      )}

      {/* Floating Exit Button for Screenshot Mode */}
      {isScreenshotMode && (
        <button 
          onClick={() => setIsScreenshotMode(false)}
          className="fixed bottom-8 right-8 z-[120] bg-slate-900/40 text-white p-4 rounded-full backdrop-blur-md no-print border border-white/20 shadow-2xl hover:bg-slate-900/60 transition-all"
          title="বাটনগুলো ফিরিয়ে আনুন"
        >
          <Eye size={24} />
        </button>
      )}

      {/* Memo Container */}
      <div className={`flex-1 flex flex-col items-center ${isScreenshotMode ? 'bg-white justify-start' : 'bg-slate-100 py-10 px-4'}`}>
        <div 
          className={`bg-white w-full max-w-[550px] flex flex-col ${isScreenshotMode ? 'shadow-none' : 'shadow-2xl rounded-3xl border border-slate-200 mb-10'}`}
        >
          {/* Memo Header */}
          <div className="bg-slate-900 text-white p-8 text-center relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
            </div>
            
            <h1 className="text-4xl font-black mb-2 tracking-tight uppercase leading-none">{SHOP_NAME}</h1>
            <p className="text-sm opacity-80 font-medium mb-1">{SHOP_ADDRESS}</p>
            <div className="flex flex-col items-center mt-3 gap-1">
               <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold border border-white/10 tracking-wide">
                 প্রোপাইটার: {SHOP_PROPRIETOR}
               </span>
               <span className="text-sm font-black text-indigo-300 mt-1">
                 মোবাইল: {SHOP_PHONE}
               </span>
            </div>
          </div>

          <div className="p-8 flex-1 flex flex-col">
            {/* Customer & Info Header */}
            <div className="flex justify-between items-start mb-8 border-b-2 border-slate-100 pb-6">
              <div className="flex-1">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">ক্রেতার তথ্য</p>
                <h2 className="text-xl font-black text-slate-900 leading-tight">{customer?.name || 'সম্মানিত কাস্টমার'}</h2>
                <p className="text-slate-600 font-bold text-sm mt-1">{customer?.phone}</p>
                {customer?.address && <p className="text-slate-500 text-xs mt-1 italic">{customer.address}</p>}
              </div>
              <div className="text-right pl-4">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">মেমো বিবরণ</p>
                <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 inline-block">
                  <p className="text-xs font-black text-slate-900">{memo.memoNumber}</p>
                </div>
                <p className="text-slate-500 font-bold text-[10px] mt-2 uppercase tracking-wider">
                  {new Date(memo.date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Billing Items Table */}
            <div className="flex-1 min-h-[150px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-900">
                    <th className="py-3 text-left text-slate-900 font-black text-[11px] uppercase tracking-widest w-1/2">কাজের বিবরণ</th>
                    <th className="py-3 text-center text-slate-900 font-black text-[11px] uppercase tracking-widest">পরিমাণ</th>
                    <th className="py-3 text-right text-slate-900 font-black text-[11px] uppercase tracking-widest">মোট মূল্য</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {memo.items.map(item => (
                    <tr key={item.id} className="group">
                      <td className="py-4">
                        <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">দর: ৳{item.unitPrice.toLocaleString('bn-BD')}</p>
                      </td>
                      <td className="py-4 text-center font-bold text-slate-700 text-sm">{item.quantity}</td>
                      <td className="py-4 text-right font-black text-slate-900 text-sm">৳{item.total.toLocaleString('bn-BD')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment Summary */}
            <div className="mt-8 pt-6 border-t-2 border-slate-900 space-y-3">
              <div className="flex justify-between items-center px-2">
                <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">মোট বিল</span>
                <span className="font-black text-slate-900 text-lg">৳{memo.totalBill.toLocaleString('bn-BD')}</span>
              </div>
              <div className="flex justify-between items-center px-2">
                <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">জমা প্রদান</span>
                <span className="font-bold text-emerald-600 text-lg">৳{memo.paidAmount.toLocaleString('bn-BD')}</span>
              </div>
              
              <div className="mt-4 p-5 bg-slate-900 text-white rounded-2xl flex justify-between items-center shadow-xl transform translate-y-1">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">অবশিষ্ট বাকি</span>
                  <span className="font-black text-3xl leading-none">৳{memo.dueAmount.toLocaleString('bn-BD')}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-xl font-black">৳</span>
                </div>
              </div>
            </div>

            {/* Footer and Watermark */}
            <div className="mt-16 text-center">
              <div className="mb-6 flex flex-col items-center">
                <div className="h-px w-20 bg-slate-200 mb-4"></div>
                <p className="text-slate-400 font-bold italic text-[11px]">আমাদের সেবা গ্রহণ করার জন্য ধন্যবাদ!</p>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                {isScreenshotMode ? (
                  <div className="text-[8px] text-slate-300 font-medium uppercase tracking-[0.2em] pt-4 border-t border-slate-50 w-full">
                    Powered by Developer Bellal Hasan
                  </div>
                ) : (
                  <>
                    <div className="bg-indigo-50 text-indigo-700 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest inline-flex items-center gap-2 border border-indigo-100 no-print animate-bounce">
                      <Camera size={14} /> মেমোটি স্ক্রিনশট নিয়ে রাখুন
                    </div>
                    <div className="text-[8px] text-slate-400 font-medium uppercase tracking-[0.2em] mt-6">
                      Powered by Developer Bellal Hasan
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Instruction when not in screenshot mode */}
        {!isScreenshotMode && (
          <div className="mt-4 mb-10 text-center text-slate-400 text-[10px] px-10 no-print max-w-[300px]">
            <span className="text-indigo-600 font-black uppercase">পরামর্শ:</span> মেমোটি ফুল স্ক্রিন করতে উপরে <span className="text-slate-900 font-bold italic">"স্ক্রিনশট মুড"</span> বাটনে ক্লিক করুন।
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoView;
