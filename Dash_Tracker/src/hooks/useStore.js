import { useState, useCallback } from 'react';
import { DEMO } from '../data/demo';

const persist=(k,v)=>{try{sessionStorage.setItem('cr_'+k,JSON.stringify(v));}catch{}};
const load=(k,fb)=>{try{const s=sessionStorage.getItem('cr_'+k);return s?JSON.parse(s):fb;}catch{return fb;}};

function useSlice(key,initial){
  const [data,setData]=useState(()=>load(key,initial));
  const set=useCallback(upd=>{
    setData(prev=>{
      const next=typeof upd==='function'?upd(prev):upd;
      persist(key,next); return next;
    });
  },[key]);
  const add    = useCallback(item =>set(p=>[item,...p]),[set]);
  const remove = useCallback(id   =>set(p=>p.filter(x=>x.id!==id)),[set]);
  const update = useCallback((id,patch)=>set(p=>p.map(x=>x.id===id?{...x,...patch}:x)),[set]);
  return{data,set,add,remove,update};
}

export function useStore(){
  const fields   = useSlice('fields',   DEMO.fields);
  const expenses = useSlice('expenses', DEMO.expenses);
  const yields   = useSlice('yields',   DEMO.yields);
  const loans    = useSlice('loans',    DEMO.loans);
  const diary    = useSlice('diary',    DEMO.diary);
  const tasks    = useSlice('tasks',    DEMO.tasks);
  return{fields,expenses,yields,loans,diary,tasks};
}
