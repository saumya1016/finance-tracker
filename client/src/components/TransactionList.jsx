import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { ChevronLeft, ChevronRight, ArrowUpDown, Filter, History, Calendar, DollarSign } from 'lucide-react';

const TransactionList = ({ refreshTrigger }) => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ 
    type: '', 
    sort: 'date',
    minAmount: '', 
    maxAmount: '', 
    startDate: '',
    endDate: '' 
  });

  const loadTransactions = async () => {
    try {
      const { data } = await api.getTransactions({ 
        page, 
        limit: 5, 
        type: filters.type, 
        sortBy: filters.sort,
        minAmount: filters.minAmount,
        maxAmount: filters.maxAmount, 
        startDate: filters.startDate,
        endDate: filters.endDate
      });
      setTransactions(data.transactions);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch transactions");
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [page, filters, refreshTrigger]);

  return (
    <div className="w-full">
      <div className="p-5 border-b border-slate-50 bg-slate-50/50 space-y-4">
        <div className="flex items-center gap-2 text-slate-500 mb-2">
          <Filter size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Search & Filters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Type Filter */}
          <select 
            className="text-xs font-bold bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            value={filters.type}
            onChange={(e) => { setFilters({ ...filters, type: e.target.value }); setPage(1); }}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>

          {/* Min Amount Filter */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="number"
              placeholder="Min Amount"
              className="w-full pl-9 pr-3 py-2.5 text-xs font-bold bg-white border border-slate-200 rounded-xl text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={filters.minAmount}
              onChange={(e) => { setFilters({ ...filters, minAmount: e.target.value }); setPage(1); }}
            />
          </div>

          {/* Start Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="date"
              className="w-full pl-9 pr-3 py-2.5 text-xs font-bold bg-white border border-slate-200 rounded-xl text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={filters.startDate}
              onChange={(e) => { setFilters({ ...filters, startDate: e.target.value }); setPage(1); }}
            />
          </div>

          {/* Sort Button */}
          <button 
            onClick={() => {
              setFilters({ ...filters, sort: filters.sort === 'date' ? 'amount' : 'date' });
              setPage(1);
            }}
            className="w-full text-xs font-bold bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-100 transition-all shadow-sm active:scale-95"
          >
            <ArrowUpDown size={14} className="text-blue-500" /> 
            By {filters.sort === 'date' ? 'Amount' : 'Date'}
          </button>
        </div>
      </div>

      {/* --- TABLE AREA --- */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Details</th>
              <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Category</th>
              <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t._id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700 transition-colors">{t.description}</span>
                      <span className="text-[10px] text-slate-400 font-medium italic">
                        {new Date(t.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-tight">
                      {t.category || 'General'}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <span className={`text-sm font-black ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <History size={48} className="text-slate-200" />
                    <p className="text-slate-400 font-bold text-sm">No transactions match your filters</p>
                    <button 
                      onClick={() => {
                        setFilters({ type: '', sort: 'date', minAmount: '', maxAmount: '', startDate: '', endDate: '' });
                        setPage(1); 
                      }}
                      className="text-blue-600 text-xs font-bold underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION --- */}
      <div className="p-5 border-t border-slate-50 flex justify-between items-center bg-slate-50/30">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Page <span className="text-blue-600">{page}</span> of {totalPages}
        </div>
        
        <div className="flex gap-2">
          <button 
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;