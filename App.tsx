
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, LayoutDashboard, PieChart, ChevronDown, Calendar, Wallet, StickyNote, X, Share, MoreHorizontal, Trash2, Check, Minus, Divide, Equal, Delete, Sparkles, Smile, Coffee, Heart, Archive, History, ChevronRight, TrendingUp, TrendingDown, Download, AlertCircle, Clock, Info, ShieldCheck, ShieldAlert } from 'lucide-react';

// Import local components and utilities
import TransactionList from './components/TransactionList';
import ChartSection from './components/ChartSection';
import { CATEGORIES, formatCurrency, formatNum } from './constants';
import { Transaction, TransactionType, Category, Settlement } from './types';

const getThisWeekRange = () => {
    const now = new Date();
    const day = now.getDay();
    // Monday as start of week
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(now.setDate(diff));
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
};

const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
};

const IOSInstallPrompt = ({ forceShow, onClose }: { forceShow?: boolean, onClose?: () => void }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (forceShow) {
        setShow(true);
        return;
    }
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    const hasClosed = sessionStorage.getItem('ios_prompt_closed');
    if (isIOS && !isStandalone && !hasClosed) setShow(true);
  }, [forceShow]);

  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
    sessionStorage.setItem('ios_prompt_closed', 'true');
  };

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[500] flex items-end justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl border border-white/10 w-full max-w-sm animate-in slide-in-from-bottom-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <Download size={20} className="text-white" />
             </div>
             <h3 className="text-lg font-bold text-white">安裝為手機 App</h3>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-white p-2 bg-white/5 rounded-full"><X size={20} /></button>
        </div>
        <div className="space-y-6 text-sm font-medium text-slate-300">
          <p className="leading-relaxed text-slate-400">這是一個 Web App，不需商店下載。只需簡單兩步即可在桌面像 App 一樣使用：</p>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
            <span className="flex items-center justify-center w-10 h-10 bg-slate-800 rounded-xl shadow-inner"><Share size={18} className="text-blue-400" /></span>
            <span>1. 點擊瀏覽器下方的 <strong className="text-white font-black">「分享」</strong> 按鈕</span>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
             <span className="flex items-center justify-center w-10 h-10 bg-slate-800 rounded-xl font-bold text-lg text-blue-400">+</span>
            <span>2. 選擇 <strong className="text-white font-black">「加入主畫面」</strong></span>
          </div>
          <button onClick={handleClose} className="w-full bg-blue-500 py-4 rounded-2xl font-black text-white active:scale-95 transition-all mt-2 shadow-lg shadow-blue-500/20">我知道了</button>
        </div>
      </div>
    </div>
  );
};

const Keypad = ({ onPress, onDelete, onConfirm, onClear, onEqual }: any) => {
    const triggerHaptic = () => {
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }
    };
    const handlePress = (val: string) => { triggerHaptic(); onPress(val); };
    const numBtnClass = "h-18 bg-white rounded-2xl text-2xl font-semibold text-slate-700 shadow-sm border border-slate-100 active:bg-blue-50 active:scale-90 active:border-blue-200 transition-all flex items-center justify-center font-sans select-none";
    const opBtnClass = "h-18 bg-blue-50 rounded-2xl text-2xl font-bold text-blue-600 shadow-sm border border-blue-100 active:bg-blue-200 active:scale-90 transition-all flex items-center justify-center select-none";
    const funcBtnClass = "h-18 bg-slate-100 rounded-2xl text-base font-bold text-slate-500 border border-slate-200 active:bg-slate-200 active:scale-90 transition-all flex items-center justify-center select-none";

    return (
        <div className="grid grid-cols-4 gap-3 p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] bg-white rounded-t-[3rem] shadow-[0_-15px_50px_-15px_rgba(0,0,0,0.12)] border-t border-slate-100">
            <button onClick={() => { triggerHaptic(); onClear(); }} className={funcBtnClass}>AC</button>
            <button onClick={() => handlePress('/')} className={opBtnClass}><Divide size={24} /></button>
            <button onClick={() => handlePress('*')} className={opBtnClass}><X size={24} /></button>
            <button onClick={() => { triggerHaptic(); onDelete(); }} className={funcBtnClass}><Delete size={26} /></button>
            {['7','8','9'].map(n => <button key={n} onClick={() => handlePress(n)} className={numBtnClass}>{n}</button>)}
            <button onClick={() => handlePress('-')} className={opBtnClass}><Minus size={24} /></button>
            {['4','5','6'].map(n => <button key={n} onClick={() => handlePress(n)} className={numBtnClass}>{n}</button>)}
            <button onClick={() => handlePress('+')} className={opBtnClass}><Plus size={24} /></button>
            {['1','2','3'].map(n => <button key={n} onClick={() => handlePress(n)} className={numBtnClass}>{n}</button>)}
            <button onClick={() => { triggerHaptic(); onEqual(); }} className="h-18 bg-indigo-50 rounded-2xl text-indigo-500 font-bold border border-indigo-100 active:bg-indigo-100 active:scale-90 transition-all flex items-center justify-center"><Equal size={24} /></button>
            <button onClick={() => handlePress('0')} className={`${numBtnClass} col-span-2`}>0</button>
            <button onClick={() => handlePress('.')} className={numBtnClass}>.</button>
            <button onClick={() => { triggerHaptic(); onConfirm(); }} className="h-18 bg-blue-500 rounded-2xl text-white shadow-lg shadow-blue-500/40 active:bg-blue-700 active:scale-95 transition-all flex items-center justify-center border border-blue-400"><Check size={28} /></button>
        </div>
    );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [viewingSettlement, setViewingSettlement] = useState<Settlement | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [currentRange, setCurrentRange] = useState(() => ({ ...getThisWeekRange(), label: '本週' }));

  useEffect(() => {
    const savedTx = localStorage.getItem('linepay_ledger_data');
    const savedSt = localStorage.getItem('linepay_settlements_data');
    if (savedTx) setTransactions(JSON.parse(savedTx));
    if (savedSt) setSettlements(JSON.parse(savedSt));
  }, []);

  useEffect(() => {
    localStorage.setItem('linepay_ledger_data', JSON.stringify(transactions));
    localStorage.setItem('linepay_settlements_data', JSON.stringify(settlements));
  }, [transactions, settlements]);

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
    const usagePercent = income > 0 ? (expense / income) * 100 : (expense > 0 ? 100 : 0);
    
    const daysLeft = getDaysRemaining(currentRange.end);
    const dailyAllowance = remaining > 0 ? Math.floor(remaining / daysLeft) : 0;
    
    const daysPassed = Math.max(1, 7 - daysLeft);
    const avgSpendPerDay = expense / daysPassed;
    const projectedRemaining = income - (avgSpendPerDay * 7);

    let statusMsg = "預算充足";
    let statusIcon = <ShieldCheck size={14} />;
    if (usagePercent > 90 || projectedRemaining < 0) {
        statusMsg = "預算警戒！";
        statusIcon = <ShieldAlert size={14} />;
    } else if (usagePercent > 60) {
        statusMsg = "支出略快";
        statusIcon = <AlertCircle size={14} />;
    }

    return { income, expense, remaining, usagePercent, dailyAllowance, daysLeft, projectedRemaining, statusMsg, statusIcon };
  }, [filteredTransactions, currentRange]);

  const handleAdd = (amount: number, type: TransactionType, category: Category, note: string, date: string, periodStart?: string, periodEnd?: string) => {
    const newTx: Transaction = { id: Date.now().toString(), amount, type, category, note, date, periodStart, periodEnd };
    setTransactions([newTx, ...transactions]);
    setShowAddModal(false);
  };

  const handleSettleWeek = () => {
    if (transactions.length === 0 && stats.income === 0) return;
    const newSettlement: Settlement = {
        id: Date.now().toString(),
        settledDate: new Date().toISOString(),
        totalIncome: stats.income,
        totalExpense: stats.expense,
        remaining: stats.remaining,
        transactions: [...transactions]
    };
    setSettlements([newSettlement, ...settlements]);
    setTransactions([]);
    setShowSettleModal(false);
    setActiveTab('stats');
  };

  const handleExport = (dataToExport: Transaction[], filename: string) => {
    if (dataToExport.length === 0) {
        alert('沒有資料可供導出');
        return;
    }
    const headers = ['日期', '類型', '類別', '金額', '備註', '使用區間起', '使用區間迄'];
    const rows = dataToExport.map(t => {
      let typeLabel = t.type === 'income' ? '存入' : (t.type === 'credit_card' ? '信用卡' : (t.type === 'memo' ? '隨手記' : '支出'));
      return [
        new Date(t.date).toLocaleDateString('zh-TW'),
        typeLabel,
        CATEGORIES.find(c => c.value === t.category)?.label || '其他',
        t.amount,
        `"${(t.note || '').replace(/"/g, '""')}"`,
        t.periodStart || '',
        t.periodEnd || ''
      ].join(',');
    });
    
    const blob = new Blob(['\uFEFF' + [headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
  const isOverSpent = stats.remaining < 0;
  const isNearingEnd = stats.usagePercent >= 85;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <IOSInstallPrompt forceShow={showInstallHelp} onClose={() => setShowInstallHelp(false)} />
      
      <main className="flex-1 overflow-y-auto px-8 pt-[calc(4rem+env(safe-area-inset-top))] pb-40 no-scrollbar">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">生活・滋味</h1>
            <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Line Pay 管理</p>
                <button onClick={() => setShowInstallHelp(true)} className="text-blue-500 bg-blue-50 p-1 rounded-full active:scale-90 transition-transform"><Info size={12} /></button>
            </div>
          </div>
          <div className="flex gap-3">
              <button 
                onClick={() => setShowSettleModal(true)} 
                className={`p-3 rounded-[1.25rem] active:scale-95 transition-all border ${isWeekend ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 animate-pulse' : 'bg-white text-slate-400 border-slate-100 shadow-soft'}`}
                title="結束本週並歸零"
              >
                  <Archive size={24} />
              </button>
          </div>
        </header>
        
        {/* 主要狀態卡片 */}
        <div className={`p-8 rounded-[3rem] shadow-glow text-white mb-10 relative overflow-hidden group transition-all duration-700 ${isOverSpent ? 'bg-gradient-to-br from-rose-500 to-red-700 shadow-rose-500/40' : isNearingEnd ? 'bg-gradient-to-br from-orange-400 to-amber-600 shadow-orange-500/40' : 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-500/40'}`}>
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-white/70 uppercase tracking-widest">本週可用餘額</span>
                    <div className="flex items-center gap-1.5 text-[10px] font-black bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                        {stats.statusIcon} {stats.statusMsg}
                    </div>
                </div>
                <div className="text-5xl font-black mb-8 tracking-tighter flex items-baseline gap-1">
                    <span className="text-3xl font-bold opacity-80">$</span>
                    {formatNum(stats.remaining)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">
                            <Sparkles size={12} />今日預算
                        </div>
                        <div className="text-xl font-black">{formatCurrency(stats.dailyAllowance)}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">
                            <Clock size={12} />距離週末
                        </div>
                        <div className="text-xl font-black">{stats.daysLeft} <span className="text-xs font-bold opacity-60">DAYS</span></div>
                    </div>
                </div>

                <div className="h-3 bg-black/10 rounded-full mb-3 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ease-out ${isOverSpent ? 'bg-white shadow-[0_0_10px_white]' : 'bg-white/90'}`} style={{ width: `${Math.min(stats.usagePercent, 100)}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-white/80 uppercase tracking-widest">
                    <span>已用 {stats.usagePercent.toFixed(0)}%</span>
                    <span>預算總額 {formatNum(stats.income)}</span>
                </div>
            </div>
            
            <div className="absolute top-4 right-8 text-white/10 rotate-12 group-hover:rotate-45 transition-transform duration-700"><Coffee size={48} /></div>
            <div className="absolute bottom-6 right-20 text-white/15 -rotate-12 animate-pulse"><Sparkles size={32} /></div>
            <div className="absolute top-1/2 left-4 text-white/10 -translate-y-1/2 -rotate-12"><Smile size={64} /></div>
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {activeTab === 'home' ? (
            <>
                <div className="flex items-center gap-3 mb-6 px-2">
                    <History size={20} className="text-slate-400" />
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">支出明細</h2>
                </div>
                <TransactionList transactions={filteredTransactions as any} onDelete={id => setTransactions(transactions.filter(t => t.id !== id))} />
            </>
        ) : (
            <div className="space-y-10">
                <ChartSection transactions={filteredTransactions as any} />
                <section>
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <Archive size={20} className="text-slate-400" />
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">歷史週報</h2>
                    </div>
                    {settlements.length === 0 ? (
                        <div className="bg-white rounded-[2rem] p-10 flex flex-col items-center justify-center border border-dashed border-slate-200 opacity-50">
                            <Archive size={32} className="text-slate-300 mb-3" />
                            <p className="text-sm font-bold text-slate-400">尚無結算資料</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {settlements.map(s => (
                                <button key={s.id} onClick={() => setViewingSettlement(s)} className="bg-white rounded-[2rem] p-6 shadow-soft border border-slate-50 flex items-center justify-between group active:scale-[0.98] transition-all text-left w-full hover:border-blue-200">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors"><Archive size={24} /></div>
                                        <div>
                                            <div className="text-base font-black text-slate-800 mb-1">{new Date(s.settledDate).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })} 結算</div>
                                            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                                                <span className="text-blue-500">存入 {formatNum(s.totalIncome)}</span>
                                                <span className="text-rose-500">支出 {formatNum(s.totalExpense)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right"><div className="text-base font-black text-slate-800">{formatNum(s.remaining)}</div><div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">結餘</div></div>
                                        <ChevronRight size={18} className="text-slate-200" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        )}
      </main>

      <nav className="fixed bottom-0 w-full glass-nav h-[calc(6.5rem+env(safe-area-inset-bottom))] flex justify-around items-center px-10 z-50">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'home' ? 'text-blue-600 scale-110' : 'text-slate-400'}`}><LayoutDashboard size={28} /><span className="text-[11px] font-bold tracking-wide">明細</span></button>
        <button onClick={() => setShowAddModal(true)} className="w-18 h-18 bg-blue-500 rounded-[2rem] flex items-center justify-center text-white shadow-glow -mt-14 border-4 border-slate-50 active:scale-90 transition-all active:rotate-45"><Plus size={36} /></button>
        <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'stats' ? 'text-blue-600 scale-110' : 'text-slate-400'}`}><PieChart size={28} /><span className="text-[11px] font-bold tracking-wide">分析</span></button>
      </nav>

      {showAddModal && <AddModalComponent onAdd={handleAdd} onClose={() => setShowAddModal(false)} />}
      {showSettleModal && <SettleModalComponent onSettle={handleSettleWeek} onClose={() => setShowSettleModal(false)} />}
      {viewingSettlement && <SettlementDetailModal settlement={viewingSettlement} onClose={() => setViewingSettlement(null)} onExport={handleExport} />}
    </div>
  );
};

const AddModalComponent = ({ onAdd, onClose }: any) => {
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
            // 移除不合法字元
            let safeExp = exp.replace(/[^-+*/.0-9]/g, '');
            // 移除末尾的運算子，避免 eval 錯誤
            safeExp = safeExp.replace(/[+\-*/.]+$/, '');
            if (!safeExp) return '0';
            
            // 執行計算
            const result = eval(safeExp);
            
            // 處理浮點數精度問題並四捨五入到小數點兩位
            return String(Number(result.toFixed(2)) || '0'); 
        } catch { return '0'; }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col h-full animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center px-6 pt-[env(safe-area-inset-top)] h-[calc(5rem+env(safe-area-inset-top))]">
                <button onClick={onClose} className="p-3 bg-slate-100 rounded-2xl active:scale-90 transition-transform"><X size={24} /></button>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                    {[['expense', '支出'], ['income', '存入'], ['credit_card', '信用卡'], ['memo', '隨手記']].map(([t, l]) => (
                        <button key={t} onClick={() => { 
                            setType(t as any); 
                            if (t === 'income') setCategory('Deposit');
                            else if (category === 'Deposit') setCategory('Food');
                        }}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${type === t ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>{l}</button>
                    ))}
                </div>
                <div className="w-10"></div>
            </div>
            <div className="flex flex-col items-center py-6">
                <span className="text-slate-400 text-xs font-bold mb-2 tracking-widest uppercase">AMOUNT 金額</span>
                <div className="text-5xl font-black tracking-tighter font-sans text-slate-800">{amountStr}</div>
            </div>
            <div className="px-8 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-10">
                <div className="grid grid-cols-5 gap-4">
                    {CATEGORIES.filter(c => type === 'income' ? c.value === 'Deposit' : c.value !== 'Deposit').map(c => (
                        <button key={c.value} onClick={() => setCategory(c.value)} className={`flex flex-col items-center gap-2 transition-all ${category === c.value ? 'scale-105' : 'opacity-30 grayscale'}`}>
                            <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center shadow-md ${c.color.split(' ')[0]} ${c.color.split(' ')[1]}`}>{c.icon}</div>
                            <span className="text-[10px] font-bold text-slate-600 whitespace-nowrap">{c.label}</span>
                        </button>
                    ))}
                </div>
                <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 space-y-6 shadow-sm">
                    {type !== 'income' ? (
                        <div className="flex items-center justify-between h-12">
                            <div className="flex items-center gap-3 text-slate-500"><Calendar size={18} className="text-blue-500" /><span className="text-sm font-bold">消費日期</span></div>
                            <div className="relative flex items-center justify-center bg-white border border-slate-200 rounded-2xl px-5 py-2 min-w-[160px] active:bg-slate-50 transition-colors overflow-hidden">
                                <div className="flex items-center gap-2 pointer-events-none"><span className="text-sm font-bold text-slate-700">{selectedDate}</span><ChevronDown size={16} className="text-slate-400" /></div>
                                <input type="date" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-20" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-blue-500 mb-2"><Wallet size={18} /><span className="text-sm font-bold">存款預計使用區間</span></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase tracking-wider">開始</span>
                                    <div className="relative w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 flex justify-center items-center overflow-hidden">
                                        <span>{periodStart}</span><input type="date" className="absolute inset-0 opacity-0 w-full h-full" value={periodStart} onChange={e => setPeriodStart(e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase tracking-wider">結束</span>
                                    <div className="relative w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 flex justify-center items-center overflow-hidden">
                                        <span>{periodEnd}</span><input type="date" className="absolute inset-0 opacity-0 w-full h-full" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center gap-4 pt-2 border-t border-slate-200/50">
                        <StickyNote size={18} className="text-slate-300" />
                        <input value={note} onChange={e => setNote(e.target.value)} className="bg-transparent outline-none text-base w-full font-medium placeholder:text-slate-300" placeholder="想記錄點什麼？" />
                    </div>
                </div>
            </div>
            <div className="mt-auto"><Keypad onPress={(v: any) => setAmountStr(amountStr === '0' ? v : amountStr + v)} onDelete={() => setAmountStr(amountStr.length <= 1 ? '0' : amountStr.slice(0, -1))} onClear={() => setAmountStr('0')} onEqual={() => setAmountStr(calculate(amountStr))} onConfirm={() => { const val = parseFloat(calculate(amountStr)); if (val > 0) onAdd(val, type, category, note, type === 'income' ? new Date().toISOString() : new Date(selectedDate).toISOString(), type === 'income' ? periodStart : undefined, type === 'income' ? periodEnd : undefined ); }} /></div>
        </div>
    );
};

const SettleModalComponent = ({ onSettle, onClose }: any) => (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white rounded-[3rem] w-full max-w-sm p-8 shadow-2xl animate-in zoom-in-95 duration-300 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-[2rem] flex items-center justify-center text-blue-600 mx-auto mb-6"><Archive size={40} /></div>
            <h2 className="text-2xl font-black text-slate-800 mb-3">結束本週記帳？</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">這將結算目前所有記錄並「打包存檔」，主畫面的金額將歸零，開始新的記帳週期。</p>
            <div className="flex flex-col gap-3">
                <button onClick={onSettle} className="w-full bg-blue-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/30 active:scale-95 transition-all">確定結算並歸零</button>
                <button onClick={onClose} className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold active:scale-95 transition-all">先不要</button>
            </div>
        </div>
    </div>
);

const SettlementDetailModal = ({ settlement, onClose, onExport }: any) => (
    <div className="fixed inset-0 z-[400] bg-slate-50 flex flex-col h-full animate-in slide-in-from-bottom-10">
        <div className="px-8 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-6 bg-white border-b border-slate-100 shadow-sm rounded-b-[3rem]">
            <div className="flex justify-between items-center mb-6">
                <button onClick={onClose} className="p-3 bg-slate-100 rounded-2xl active:scale-90 transition-transform"><X size={24} /></button>
                <h2 className="text-xl font-black text-slate-800">結算週報詳情</h2>
                <button onClick={() => onExport(settlement.transactions, `LinePay_週報_${new Date(settlement.settledDate).toISOString().split('T')[0]}`)} className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl active:scale-90 transition-transform"><Download size={24} /></button>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl text-center"><TrendingUp size={16} className="text-blue-500 mx-auto mb-1" /><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">存入</div><div className="text-sm font-black text-blue-600">{formatNum(settlement.totalIncome)}</div></div>
                <div className="bg-rose-50 p-4 rounded-2xl text-center"><TrendingDown size={16} className="text-rose-500 mx-auto mb-1" /><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">支出</div><div className="text-sm font-black text-rose-500">{formatNum(settlement.totalExpense)}</div></div>
                <div className="bg-slate-900 p-4 rounded-2xl text-center shadow-lg shadow-slate-200"><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">結餘</div><div className="text-sm font-black text-white">{formatNum(settlement.remaining)}</div></div>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6 no-scrollbar"><TransactionList transactions={settlement.transactions} /></div>
    </div>
);

export default App;
