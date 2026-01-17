import React from 'react';
import { Delete, Check, Plus, Minus, X, Divide, Equal } from 'lucide-react';

interface KeypadProps {
  onPress: (val: string) => void;
  onDelete: () => void;
  onConfirm: () => void;
  onClear: () => void;
  onEqual: () => void;
}

const Keypad: React.FC<KeypadProps> = ({ onPress, onDelete, onConfirm, onClear, onEqual }) => {
  
  // Light Mode Colors
  // Number buttons: White surface with soft shadow
  const numBtnClass = "h-14 bg-white rounded-xl text-xl font-semibold text-slate-700 shadow-sm border border-slate-100 active:bg-slate-50 active:translate-y-[1px] transition-all flex items-center justify-center font-sans";
  
  // Operator buttons: Very light blue
  const opBtnClass = "h-14 bg-blue-50 rounded-xl text-xl font-bold text-blue-600 shadow-sm border border-blue-100 active:bg-blue-100 active:translate-y-[1px] transition-all flex items-center justify-center";

  // Function buttons (AC, Del): Light Slate
  const funcBtnClass = "h-14 bg-slate-100 rounded-xl text-sm font-bold text-slate-500 border border-slate-200 active:bg-slate-200 transition-all flex items-center justify-center";

  return (
    <div className="grid grid-cols-4 gap-2 p-4 pb-8 bg-white rounded-t-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] border-t border-slate-100">
      
      {/* Row 1 */}
      <button onClick={onClear} className={funcBtnClass}>AC</button>
      <button onClick={() => onPress('/')} className={opBtnClass}><Divide size={20} /></button>
      <button onClick={() => onPress('*')} className={opBtnClass}><X size={20} /></button>
      <button onClick={onDelete} className={funcBtnClass}>
        <Delete size={22} />
      </button>

      {/* Row 2 */}
      <button onClick={() => onPress('7')} className={numBtnClass}>7</button>
      <button onClick={() => onPress('8')} className={numBtnClass}>8</button>
      <button onClick={() => onPress('9')} className={numBtnClass}>9</button>
      <button onClick={() => onPress('-')} className={opBtnClass}><Minus size={20} /></button>

      {/* Row 3 */}
      <button onClick={() => onPress('4')} className={numBtnClass}>4</button>
      <button onClick={() => onPress('5')} className={numBtnClass}>5</button>
      <button onClick={() => onPress('6')} className={numBtnClass}>6</button>
      <button onClick={() => onPress('+')} className={opBtnClass}><Plus size={20} /></button>

      {/* Row 4 */}
      <button onClick={() => onPress('1')} className={numBtnClass}>1</button>
      <button onClick={() => onPress('2')} className={numBtnClass}>2</button>
      <button onClick={() => onPress('3')} className={numBtnClass}>3</button>
      <button onClick={onEqual} className="h-14 bg-indigo-50 rounded-xl text-indigo-500 font-bold border border-indigo-100 active:bg-indigo-100 transition-all flex items-center justify-center"><Equal size={20} /></button>

      {/* Row 5 */}
      <button onClick={() => onPress('0')} className={`${numBtnClass} col-span-2`}>0</button>
      <button onClick={() => onPress('.')} className={numBtnClass}>.</button>
      <button 
        onClick={onConfirm} 
        className="h-14 bg-blue-500 rounded-xl text-white shadow-lg shadow-blue-500/30 active:bg-blue-600 active:scale-95 transition-all flex items-center justify-center border border-blue-400"
      >
        <Check size={24} />
      </button>

    </div>
  );
};

export default Keypad;