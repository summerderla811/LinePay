import React, { useMemo } from 'react';
import { Transaction } from '../types';
import { CATEGORIES, formatCurrency, formatDate } from '../constants';
import { Calendar, Trash2, CreditCard, StickyNote } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    transactions.forEach(t => {
      const dateKey = new Date(t.date).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(t);
    });
    return groups;
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-40">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400 border border-slate-200">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
        </div>
        <p className="text-sm font-bold text-slate-400 tracking-wide">暫無紀錄</p>
      </div>
    );
  }

  // Sort dates descending
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="space-y-6 pb-24">
      {sortedDates.map((date) => {
        const dayTransactions = groupedTransactions[date];
        const dateObj = new Date(dayTransactions[0].date);
        const dayLabel = dateObj.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' });
        const weekDay = dateObj.toLocaleDateString('zh-TW', { weekday: 'short' });
        
        // Calculate daily total
        const dailyTotal = dayTransactions.reduce((acc, t) => {
            if (t.type === 'expense') return acc - t.amount;
            if (t.type === 'income') return acc + t.amount;
            return acc;
        }, 0);

        return (
          <div key={date} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-end px-2 mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-700">{dayLabel}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-200 text-[10px] font-bold text-slate-500 uppercase">{weekDay}</span>
                </div>
                {dailyTotal !== 0 && (
                    <span className="text-[11px] font-bold text-slate-400">
                        {dailyTotal > 0 ? '+' : ''}{formatCurrency(dailyTotal)}
                    </span>
                )}
            </div>
            
            <div className="flex flex-col gap-3">
              {dayTransactions.map((t, index) => {
                const categoryConfig = CATEGORIES.find(c => c.value === t.category) || CATEGORIES[8];
                const isExpense = t.type === 'expense';
                const isIncome = t.type === 'income';
                const isCredit = t.type === 'credit_card';
                const isMemo = t.type === 'memo';
                
                // Determine styling based on type
                let typeColorClass = 'text-slate-800';
                if (isExpense) typeColorClass = 'text-slate-800'; 
                if (isIncome) typeColorClass = 'text-blue-600';
                if (isCredit) typeColorClass = 'text-indigo-600';
                if (isMemo) typeColorClass = 'text-slate-500';

                return (
                  <div 
                    key={t.id} 
                    className={`relative flex items-center justify-between p-4 bg-white rounded-2xl shadow-soft border border-slate-50 hover:border-blue-100 transition-all duration-200 group ${isMemo ? 'opacity-80' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className="relative">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors" style={{ backgroundColor: isCredit ? '#e0e7ff' : isMemo ? '#f1f5f9' : categoryConfig.color.split(' ')[0].replace('bg-', '') === 'slate-100' ? '#f1f5f9' : '' }}>
                               {/* Special handling for bg class vs inline style due to tailwind compilation */}
                               <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${!isCredit && !isMemo ? categoryConfig.color.split(' ')[0] : ''}`}>
                                    <div className={`${isCredit ? 'text-indigo-500' : isMemo ? 'text-slate-400' : categoryConfig.color.split(' ')[1]}`}>
                                        {isCredit ? <CreditCard size={20} /> : 
                                            isMemo ? <StickyNote size={20} /> :
                                            categoryConfig.icon}
                                    </div>
                               </div>
                          </div>
                          {/* Type Indicator Badge */}
                          {(isCredit || isMemo) && (
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white ${isCredit ? 'bg-indigo-500' : 'bg-slate-400'}`}>
                                  {isCredit ? 'C' : 'M'}
                              </div>
                          )}
                      </div>
                      
                      {/* Details */}
                      <div className="flex flex-col min-w-0">
                        <span className={`text-sm font-bold leading-tight ${isMemo ? 'text-slate-500' : 'text-slate-800'}`}>
                            {categoryConfig.label}
                        </span>
                        
                        {/* Note and Period Display */}
                        <div className="flex flex-col gap-1 mt-1">
                            {t.note && (
                                <span className="text-xs text-slate-500 leading-tight truncate font-medium">{t.note}</span>
                            )}
                            {t.periodStart && t.periodEnd && isIncome && (
                                <div className="flex items-center gap-1 text-[9px] text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded-full border border-blue-100">
                                    <Calendar size={8} />
                                    <span>{formatDate(t.periodStart)} - {formatDate(t.periodEnd)}</span>
                                </div>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 ml-2 shrink-0">
                        <div className="flex flex-col items-end">
                            <span className={`text-sm font-bold tracking-tight ${typeColorClass} ${isMemo || isCredit ? 'opacity-70' : ''}`}>
                                {isIncome ? '+' : (isExpense ? '-' : '')}{formatCurrency(t.amount).replace('NT$', '')}
                            </span>
                            {(isMemo || isCredit) && (
                                <span className="text-[9px] text-slate-400 font-medium">不計入</span>
                            )}
                        </div>
                        
                        {/* Delete button */}
                        {onDelete && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDelete(t.id); }}
                                className="opacity-40 hover:opacity-100 hover:bg-red-50 hover:text-red-500 p-1.5 rounded-lg text-slate-400 transition-all active:scale-90"
                                aria-label="刪除"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionList;