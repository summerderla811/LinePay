import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis } from 'recharts';
import { Transaction } from '../types';
import { CATEGORIES } from '../constants';

interface ChartSectionProps {
  transactions: Transaction[];
}

// Brighter, clearer colors for light mode
const COLORS = ['#3b82f6', '#0ea5e9', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316', '#eab308', '#84cc16'];

const ChartSection: React.FC<ChartSectionProps> = ({ transactions }) => {
  
  const expenseData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value]) => {
        const cat = CATEGORIES.find(c => c.value === name);
        return { name: cat ? cat.label : name, value: Number(value) };
      })
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const weeklyTrend = useMemo(() => {
    // Simple last 7 days from the available transaction range
    const dates: Record<string, number> = {};
    transactions.forEach(t => {
      const d = new Date(t.date).toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' });
      if (t.type === 'expense') {
        dates[d] = (dates[d] || 0) + t.amount;
      }
    });
    
    return Object.entries(dates).map(([date, amount]) => ({ date, amount })).slice(-7);
  }, [transactions]);

  if (expenseData.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Donut Chart */}
      <div className="bg-white p-5 rounded-3xl shadow-soft border border-slate-100">
        <h3 className="text-slate-600 font-bold mb-4 text-sm">支出分佈</h3>
        <div className="h-48 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `$${value}`}
                contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#fff', color: '#1e293b', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {expenseData.slice(0, 4).map((entry, index) => (
            <div key={entry.name} className="flex items-center text-xs text-slate-500 font-medium">
              <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              {entry.name}
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-5 rounded-3xl shadow-soft border border-slate-100">
         <h3 className="text-slate-600 font-bold mb-4 text-sm">每日支出趨勢</h3>
         <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrend}>
                <XAxis dataKey="date" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#fff', fontSize: '12px', color: '#1e293b', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                />
                <Bar dataKey="amount" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={12} activeBar={{ fill: '#3b82f6' }} />
              </BarChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};

export default ChartSection;