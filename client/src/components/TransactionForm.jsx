import React, { useState } from 'react';
import { PlusCircle, Tag, FileText, DollarSign, Send } from 'lucide-react';
import * as api from '../services/api';

const TransactionForm = ({ onTransactionAdded }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense',
    description: '',
    amount: '',
    category: 'General'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSubmit = {
        ...formData,
        amount: Number(formData.amount)
      };

      await api.postTransaction(dataToSubmit);
      setFormData({ type: 'expense', description: '', amount: '', category: 'General' });
      if (onTransactionAdded) onTransactionAdded();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 transition-all duration-300">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          <PlusCircle size={20} />
        </div>
        <h3 className="font-black text-slate-800 text-lg tracking-tight">Add Transaction</h3>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Type & Category*/}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Type</label>
            <select 
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <select 
                className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="General">General</option>
                <option value="Food">Food</option>
                <option value="Rent">Rent</option>
                <option value="Salary">Salary</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description Input */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="What was this for?" 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Amount</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="number" 
              min="0" 
              step="0.01" 
              placeholder="0.00" 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              // Prevents typing '-', 'e', and '+' symbols
              onKeyDown={(e) => ["-", "e", "E", "+"].includes(e.key) && e.preventDefault()}
              required
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Confirm Transaction"}
          {!loading && <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;