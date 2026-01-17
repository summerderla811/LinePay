
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, LayoutDashboard, PieChart, ChevronDown, Calendar, Wallet, StickyNote, X, FileSpreadsheet, Share, MoreHorizontal, Trash2, Check, Minus, Plus as PlusIcon, Divide, Equal, Delete } from 'lucide-react';

// Import local components and utilities
import TransactionList from './components/TransactionList';
import ChartSection from './components/ChartSection';
import { CATEGORIES, formatCurrency, formatNum } from './constants';
import { Transaction, TransactionType, Category } from './types';

const getThisWeekRange = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(now.setDate(diff));
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
};

const IOSInstallPrompt = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    const hasClosed = sessionStorage.getItem('ios_prompt_closed');
    if (isIOS && !isStandalone && !hasClosed) setShow(true);
  }, []);
  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem('ios_prompt_closed', 'true');
  };
  if (!show) return null;
  return (
    <div className="fixed bottom-24 left-0 w-full z-[110] px-4 animate-in slide-in-from-bottom-10 duration-700">
      <div className="relative bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-white/10">
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-slate-900/90 rotate-45 border-b border-r border-white/10"></div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-bold text-blue-300">將此 App 加入主畫面</h3>
          <button onClick={handleClose} className="text-slate-400 hover:text-white p-1"><X size={16} /></button>
        </div>
        <div className="flex flex-col gap-2 text-sm font-medium text-slate-200">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-slate-700 rounded-lg"><Share size={14} /></span>
            <span>點擊瀏覽器下方的「分享」按鈕</span>
          </div>
          <div className="flex items-center gap-2">
             <span className="flex items-center justify-center w-6 h-6 bg-slate-700 rounded-lg font-bold text-xs">+</span>
            <span>選擇「加入主畫面」</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Keypad = ({ onPress, onDelete, onConfirm, onClear, onEqual }: any) => {
    const numBtnClass = "h-14 bg-white rounded-xl text-xl font-semibold text-slate-700 shadow-sm border border-slate-100 active:bg-slate-50 active:translate-y-[1px] transition-all flex items-center justify-center font-sans";
    const opBtnClass = "h-14 bg-blue-50 rounded-xl text-xl font-bold text-blue-600 shadow-sm border border-blue-100 active:bg-blue-100 active:translate-y-[1px] transition-all flex items-center justify-center";
    const funcBtnClass = "h-14 bg-slate-100 rounded-xl text-sm font-bold text-slate-500 border border-slate-200 active:bg-slate-200 transition-all flex items-center justify-center";

    return (
        <div className="grid grid-cols-4 gap-2 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] border-t border-slate-100">
            <button onClick={onClear} className={funcBtnClass}>AC</button>
            <button onClick={() => onPress('/')} className={opBtnClass}><Divide size={20} /></button>
            <button onClick={() => onPress('*')} className={opBtnClass}><MoreHorizontal size={20} /></button>
            <button onClick={onDelete} className={funcBtnClass}><Delete size={22} /></button>
            {['7','8','9'].map(n => <button key={n} onClick={() => onPress(n)} className={numBtnClass}>{n}</button>)}
            <button onClick={() => onPress('-')} className={opBtnClass}><Minus size={20} /></button>
            {['4','5','6'].map(n => <button key={n} onClick={() => onPress(n)} className={numBtnClass}>{n}</button>)}
            <button onClick={() => onPress('+')} className={opBtnClass}><PlusIcon size={20} /></button>
            {['1','2','3'].map(n => <button key={n} onClick={() => onPress(n)} className={numBtnClass}>{n}</button>)}
            <button onClick={onEqual} className="h-14 bg-indigo-50 rounded-xl text-indigo-500 font-bold border border-indigo-100 active:bg-indigo-100 transition-all flex items-center justify-center"><Equal size={20} /></button>
            <button onClick={() => onPress('0')} className={`${numBtnClass} col-span-2`}>0</button>
            <button onClick={() => onPress('.')} className={numBtnClass}>.</button>
            <button onClick={onConfirm} className="h-14 bg-blue-500 rounded-xl text-white shadow-lg shadow-blue-500/30 active:bg-blue-600 active:scale-95 transition-all flex items-center justify-center border border-blue-400"><Check size={24} /></button>
        </div>
    );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentRange, setCurrentRange] = useState(() => ({ ...getThisWeekRange(), label: '本週' }));

  useEffect(() => {
    const saved = localStorage.getItem('linepay_ledger_data');
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('linepay_ledger_data', JSON.stringify(transactions));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d >= currentRange.start && d <= currentRange.end;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, currentRange]);

  const stats = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const remaining = income - expense;
    const usagePercent = income > 0 ? (expense / income) * 100 : 0;
    return { income, expense, remaining, usagePercent };
  }, [filteredTransactions]);

  const handleAdd = (amount: number, type: TransactionType, category: Category, note: string, date: string, periodStart?: string, periodEnd?: string) => {
    const newTx: Transaction = { 
      id: Date.now().toString(), 
      amount, 
      type, 
      category, 
      note, 
      date, 
      periodStart, 
      periodEnd 
    };
    setTransactions([newTx, ...transactions]);
    setShowAddModal(false);
  };

  const handleExport = () => {
    const headers = ['日期', '類型', '類別', '金額', '備註', '起', '迄'];
    const rows = filteredTransactions.map(t => [
      new Date(t.date).toLocaleDateString('zh-TW'),
      t.type === 'income' ? '存入' : '支出',
      CATEGORIES.find(c => c.value === t.category)?.label || '其他',
      t.amount,
      t.note || '',
      t.periodStart || '',
      t.periodEnd || ''
    ].join(','));
    const blob = new Blob(['\uFEFF' + [headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const AddModal = () => {
    const [amountStr, setAmountStr] = useState('0');
    const [type, setType] = useState<TransactionType>('expense');
    const [category, setCategory] = useState<Category>('Food');
    const [note, setNote] = useState('');
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [periodStart, setPeriodStart] = useState(() => new Date().toISOString().split('T')[0]);
    const [periodEnd, setPeriodEnd] = useState(() => {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 6);
        return nextWeek.toISOString().split('T')[0];
    });

    const calculate = (exp: string) => {
        try { 
            const safeExp = exp.replace(/[^-+*/.0-9]/g, '');
            if (!safeExp) return '0';
            const result = eval(safeExp);
            return String(result || '0'); 
        } catch { return '0'; }
    };

    const isIncome = type === 'income';

    return (
      <div className="fixed inset-0 z-[200] bg-white flex flex-col h-full animate-in slide-in-from-bottom-10">
        <div className="flex justify-between items-center px-4 pt-[env(safe-area-inset-top)] h-[calc(4rem+env(safe-area-inset-top))]">
          <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-100 rounded-full active:scale-90 transition-transform"><X size={18} /></button>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {[['expense', '支出'], ['income', '存入'], ['credit_card', '信用卡'], ['memo', '隨手記']].map(([t, l]) => (
                <button key={t} onClick={() => { 
                    setType(t as any); 
                    if (t === 'income') setCategory('Deposit');
                    else if (category === 'Deposit') setCategory('Food');
                }}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${type === t ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>{l}</button>
            ))}
          </div>
          <div className="w-8"></div>
        </div>

        <div className="flex flex-col items-center py-4">
          <span className="text-slate-400 text-[10px] font-bold mb-1 tracking-widest uppercase">AMOUNT 金額</span>
          <div className="text-4xl font-black tracking-tight font-sans text-slate-800">{amountStr}</div>
        </div>

        <div className="px-6 flex flex-col gap-5 overflow-y-auto no-scrollbar pb-10">
            <div className="grid grid-cols-5 gap-3">
                {CATEGORIES.filter(c => isIncome ? c.value === 'Deposit' : c.value !== 'Deposit').map(c => (
                    <button key={c.value} onClick={() => setCategory(c.value)} className={`flex flex-col items-center gap-1.5 transition-all ${category === c.value ? 'scale-105' : 'opacity-30 grayscale'}`}>
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm ${c.color.split(' ')[0]} ${c.color.split(' ')[1]}`}>{c.icon}</div>
                        <span className="text-[9px] font-bold text-slate-600">{c.label}</span>
                    </button>
                ))}
            </div>

            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 space-y-4 shadow-sm">
                {!isIncome ? (
                    <div className="flex items-center justify-between h-10">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Calendar size={14} className="text-blue-500" />
                            <span className="text-xs font-bold">消費日期</span>
                        </div>
                        {/* 修正：增加 min-width 並優化中心點擊感應 */}
                        <div className="relative flex items-center justify-center bg-white border border-slate-200 rounded-xl px-4 py-1.5 min-w-[140px] active:bg-slate-50 transition-colors overflow-hidden">
                            <div className="flex items-center gap-2 pointer-events-none">
                                <span className="text-xs font-bold text-slate-700">{selectedDate}</span>
                                <ChevronDown size={14} className="text-slate-400" />
                            </div>
                            <input 
                                type="date" 
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-20 block"
                                style={{ WebkitAppearance: 'none', WebkitTapHighlightColor: 'transparent', fontSize: '16px' }}
                                value={selectedDate} 
                                onChange={e => setSelectedDate(e.target.value)}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-blue-500 mb-1">
                            <Wallet size={14} />
                            <span className="text-xs font-bold">存款預計使用區間</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <span className="text-[9px] text-slate-400 font-bold ml-1 uppercase">START 開始</span>
                                <div className="relative w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 flex justify-center items-center active:bg-slate-50 transition-colors overflow-hidden">
                                  <div className="flex items-center gap-1 pointer-events-none">
                                    <span>{periodStart}</span>
                                    <ChevronDown size={12} className="text-slate-400" />
                                  </div>
                                  <input 
                                      type="date" 
                                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-20"
                                      style={{ WebkitAppearance: 'none', WebkitTapHighlightColor: 'transparent', fontSize: '16px' }}
                                      value={periodStart} 
                                      onChange={e => setPeriodStart(e.target.value)}
                                  />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] text-slate-400 font-bold ml-1 uppercase">END 結束</span>
                                <div className="relative w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 flex justify-center items-center active:bg-slate-50 transition-colors overflow-hidden">
                                  <div className="flex items-center gap-1 pointer-events-none">
                                    <span>{periodEnd}</span>
                                    <ChevronDown size={12} className="text-slate-400" />
                                  </div>
                                  <input 
                                      type="date" 
                                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-20"
                                      style={{ WebkitAppearance: 'none', WebkitTapHighlightColor: 'transparent', fontSize: '16px' }}
                                      value={periodEnd} 
                                      onChange={e => setPeriodEnd(e.target.value)}
                                  />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3 pt-1 border-t border-slate-200/50">
                    <StickyNote size={14} className="text-slate-300" />
                    <input 
                        value={note} 
                        onChange={e => setNote(e.target.value)} 
                        className="bg-transparent outline-none text-sm w-full font-medium placeholder:text-slate-300" 
                        placeholder="想記錄點什麼？" 
                    />
                </div>
            </div>
        </div>

        <div className="mt-auto">
            <Keypad 
                onPress={(v: any) => setAmountStr(amountStr === '0' ? v : amountStr + v)}
                onDelete={() => setAmountStr(amountStr.length <= 1 ? '0' : amountStr.slice(0, -1))}
                onClear={() => setAmountStr('0')}
                onEqual={() => setAmountStr(calculate(amountStr))}
                onConfirm={() => { 
                    const val = parseFloat(calculate(amountStr)); 
                    if (val > 0) {
                        handleAdd(
                            val, 
                            type, 
                            category, 
                            note, 
                            isIncome ? new Date().toISOString() : new Date(selectedDate).toISOString(),
                            isIncome ? periodStart : undefined,
                            isIncome ? periodEnd : undefined
                        );
                    }
                }}
            />
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <IOSInstallPrompt />
      <main className="flex-1 overflow-y-auto px-6 pt-[calc(3rem+env(safe-area-inset-top))] pb-32 no-scrollbar">
        <header className="mb-6 flex justify-between items-start">
          <div><h1 className="text-2xl font-bold text-slate-800 tracking-tight">生活・滋味</h1><p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Line Pay 管理</p></div>
          <button onClick={handleExport} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl active:scale-95 transition-transform"><FileSpreadsheet size={20} /></button>
        </header>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-[2.5rem] shadow-glow text-white mb-8 relative overflow-hidden">
            <div className="relative z-10">
                <span className="text-xs font-bold text-blue-100/80 uppercase tracking-widest">本週剩餘</span>
                <div className="text-4xl font-black mb-6 tracking-tight">{formatCurrency(stats.remaining)}</div>
                <div className="h-2.5 bg-black/10 rounded-full mb-2"><div className="h-full bg-white rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(stats.usagePercent, 100)}%` }}></div></div>
                <div className="flex justify-between text-[10px] font-bold text-blue-100 uppercase"><span>支出 {stats.usagePercent.toFixed(0)}%</span><span>預算 {formatNum(stats.income)}</span></div>
            </div>
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        {activeTab === 'home' ? <TransactionList transactions={filteredTransactions as any} onDelete={id => setTransactions(transactions.filter(t => t.id !== id))} /> : <ChartSection transactions={filteredTransactions as any} />}
      </main>
      <nav className="fixed bottom-0 w-full glass-nav h-[calc(5rem+env(safe-area-inset-bottom))] flex justify-around items-center px-6 z-50">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'home' ? 'text-blue-600 scale-110' : 'text-slate-400'}`}><LayoutDashboard size={24} /><span className="text-[10px] font-bold">明細</span></button>
        <button onClick={() => setShowAddModal(true)} className="w-16 h-16 bg-blue-500 rounded-3xl flex items-center justify-center text-white shadow-glow -mt-12 border-4 border-slate-50 active:scale-90 transition-all active:rotate-45"><Plus size={32} /></button>
        <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'stats' ? 'text-blue-600 scale-110' : 'text-slate-400'}`}><PieChart size={24} /><span className="text-[10px] font-bold">分析</span></button>
      </nav>
      {showAddModal && <AddModal />}
    </div>
  );
};

export default App;
