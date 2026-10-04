import { useState } from 'react';
import { puzzleImage } from '../../utils/puzzleImages';

export default function PropMatchingBoard({ puzzle, placements, onChange, disabled }) {
  const [selected, setSelected] = useState('');
  const [notice, setNotice] = useState('');
  const props = puzzle.digitalProps || [];
  function place(targetId, propId) {
    if (disabled || !props.some(p => p.id === propId)) return;
    const next = Object.fromEntries(Object.entries(placements).filter(([target, prop]) => target !== targetId && prop !== propId));
    onChange({ ...next, [targetId]: propId });
    setSelected('');
    setNotice(`Placed ${props.find(p => p.id === propId).label}. You can change it before checking.`);
  }
  return <div className="space-y-4">
    <div className="rounded-xl bg-blue-50 p-4"><h3 className="font-bold text-[#073763]">Choose a prop, then place it</h3><p className="mt-1 text-sm">Select an object below and select its matching situation. You can also drag it onto a target. Match all props before checking. Tab and Enter work with every control.</p><p className="mt-2 text-xs font-bold">{Object.keys(placements).length} / {puzzle.targets.length} placed · Correctness is checked on submission</p></div>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {props.map(prop => <button type="button" key={prop.id} disabled={disabled} aria-pressed={selected === prop.id} draggable={!disabled} onDragStart={e => { e.dataTransfer.setData('text/plain', prop.id); setSelected(prop.id); }} onClick={() => setSelected(prop.id)} className={`rounded-xl border-2 p-3 text-left transition focus-visible:outline-2 focus-visible:outline-blue-600 ${selected === prop.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'}`}>
        <img src={puzzleImage(prop)} alt={prop.imageAlt || prop.label} draggable={false} className="mx-auto h-24 w-full object-contain" /><b className="mt-2 block text-sm">{prop.label}</b><span className="mt-1 block text-xs text-slate-500">{Object.values(placements).includes(prop.id) ? 'Placed · select to move' : 'Select prop'}</span>
      </button>)}
    </div>
    <div className="grid gap-3 md:grid-cols-2">
      {puzzle.targets.map(target => { const prop = props.find(p => p.id === placements[target.id]); return <div key={target.id} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); place(target.id, e.dataTransfer.getData('text/plain')); }} className="rounded-xl border-2 border-dashed border-[#94a3b8] bg-[#f8fafc] p-4">
        <h4 className="font-bold text-[#073763]">{target.label}</h4>
        <button type="button" disabled={disabled || !selected} onClick={() => place(target.id, selected)} className="mt-3 w-full rounded-lg border bg-white p-3 text-sm disabled:text-slate-500">{prop ? `Placed: ${prop.label}` : 'Place selected prop here'}</button>
        {prop && <button type="button" disabled={disabled} onClick={() => { const next = { ...placements }; delete next[target.id]; onChange(next); }} className="mt-2 text-xs underline">Remove prop from this target</button>}
      </div>; })}
    </div>
    <p role="status" aria-live="polite" className="text-sm text-[#0b4f87]">{notice}</p>
    <button type="button" disabled={disabled} onClick={() => { onChange({}); setSelected(''); setNotice('All props returned.'); }} className="rounded-lg border px-4 py-2 text-sm">Reset placements</button>
  </div>;
}
