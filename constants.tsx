
import { Category } from './types';
import { Utensils, Bus, ShoppingBag, Film, Home, Zap, HeartPulse, Wallet, MoreHorizontal } from 'lucide-react';
import React from 'react';

// Adjusted for Light Mode: Lighter backgrounds (100) and darker text (600/700)
export const CATEGORIES: { label: string; value: Category; icon: React.ReactNode; color: string; rawColor: string }[] = [
  { label: '飲食', value: 'Food', icon: <Utensils size={20} />, color: 'bg-orange-100 text-orange-600', rawColor: '#f97316' }, 
  { label: '交通', value: 'Transport', icon: <Bus size={20} />, color: 'bg-blue-100 text-blue-600', rawColor: '#2563eb' }, 
  { label: '購物', value: 'Shopping', icon: <ShoppingBag size={20} />, color: 'bg-purple-100 text-purple-600', rawColor: '#9333ea' }, 
  { label: '娛樂', value: 'Entertainment', icon: <Film size={20} />, color: 'bg-pink-100 text-pink-600', rawColor: '#db2777' }, 
  { label: '居住', value: 'Housing', icon: <Home size={20} />, color: 'bg-emerald-100 text-emerald-600', rawColor: '#059669' }, 
  { label: '水電', value: 'Utilities', icon: <Zap size={20} />, color: 'bg-yellow-100 text-yellow-600', rawColor: '#ca8a04' }, 
  { label: '醫療', value: 'Health', icon: <HeartPulse size={20} />, color: 'bg-rose-100 text-rose-600', rawColor: '#e11d48' }, 
  { label: '存款', value: 'Deposit', icon: <Wallet size={20} />, color: 'bg-sky-100 text-sky-600', rawColor: '#0284c7' }, 
  { label: '其他', value: 'Other', icon: <MoreHorizontal size={20} />, color: 'bg-slate-100 text-slate-600', rawColor: '#475569' }, 
];

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(amount);
};

// Fix: Added formatNum used in App.tsx to resolve the "no exported member 'formatNum'" error.
export const formatNum = (num: number) => {
  return new Intl.NumberFormat('zh-TW').format(num);
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};
