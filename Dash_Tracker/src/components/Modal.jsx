import React,{useEffect} from 'react';
import{IconX} from '../icons/Icons';

export default function Modal({open,onClose,title,icon,children,footer}){
  useEffect(()=>{
    if(open)document.body.style.overflow='hidden';
    else document.body.style.overflow='';
    return()=>{document.body.style.overflow='';};
  },[open]);
  if(!open)return null;
  return(
    <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="modal-box">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
          <div className="modal-title" style={{margin:0}}>
            {icon&&<span style={{color:'var(--c3)'}}>{icon}</span>}
            {title}
          </div>
          <button onClick={onClose} style={{background:'var(--c1)',border:'1px solid var(--border)',borderRadius:8,padding:'5px',cursor:'pointer',display:'flex',alignItems:'center',color:'var(--text3)'}}>
            <IconX size={16}/>
          </button>
        </div>
        {children}
        {footer&&<div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
