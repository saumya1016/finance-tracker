import React, { useState, useEffect, useCallback } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { PieChart, Wallet, ArrowUpCircle, ArrowDownCircle, Loader2 } from 'lucide-react';
import * as api from '../services/api';

const Home = () => {
  const [refreshCount, setRefreshCount] = useState(0);
  const [stats, setStats] = useState({ balance: 0, income: 0, expense: 0 });
  const [loading, setLoading] = useState(true);

  const triggerRefresh = () => setRefreshCount(prev => prev + 1);

  const calculateStats = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.getTransactions({ limit: 1000 }); 
      const transactions = data.transactions || [];

      const totals = transactions.reduce((acc, t) => {
        const amount = Number(t.amount) || 0;
        if (t.type === 'income') {
          acc.income += amount;
        } else {
          acc.expense += amount;
        }
        return acc;
      }, { income: 0, expense: 0 });

      setStats({
        income: totals.income,
        expense: totals.expense,
        balance: totals.income - totals.expense
      });
    } catch (err) {
      console.error("Failed to calculate stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    calculateStats();
  }, [refreshCount, calculateStats]);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      {/* Header Section */}
      <div className="bg-slate-50 border-b border-slate-200 mb-8">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span> 
              Financial Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1 ml-4.5 font-medium">
              Monitor your earnings and spending in real-time.
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest shadow-sm self-start md:self-center">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 space-y-8 animate-in fade-in duration-700">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-lg shadow-blue-200 text-white transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-3 opacity-80 mb-2">
              <Wallet size={20} /> 
              <span className="text-sm font-semibold uppercase tracking-wider">Total Balance</span>
            </div>
            <h2 className="text-3xl font-bold">
              {loading ? <Loader2 className="animate-spin" /> : `₹${stats.balance.toLocaleString()}`}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className="p-3 bg-green-50 rounded-xl text-green-600">
              <ArrowUpCircle size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Total Income</p>
              <p className="text-xl font-bold text-slate-800">
                {loading ? "..." : `+₹${stats.income.toLocaleString()}`}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className="p-3 bg-red-50 rounded-xl text-red-600">
              <ArrowDownCircle size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Total Expenses</p>
              <p className="text-xl font-bold text-slate-800">
                {loading ? "..." : `-₹${stats.expense.toLocaleString()}`}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <TransactionForm onTransactionAdded={triggerRefresh} />
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center gap-2">
                <PieChart size={20} className="text-blue-600" />
                <h3 className="font-bold text-slate-800 text-lg">Transaction History</h3>
              </div>
              {/* refreshTrigger ensures the list re-fetches when a form is submitted */}
              <TransactionList refreshTrigger={refreshCount} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;