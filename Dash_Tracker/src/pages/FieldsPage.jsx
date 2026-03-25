import React,{useState} from 'react';
import Modal from '../components/Modal';
import{fmt,fmtK,fmtD,sum,daysFrom,uid,today} from '../utils/helpers';
import{FIELD_CROPS,SOIL_TYPES,CROP_COLORS} from '../data/constants';
import{IconField,IconPlus} from '../icons/Icons';

function useForm(i){const[v,setV]=useState(i);const set=k=>e=>setV(p=>({...p,[k]:e.target.value}));const reset=()=>setV(i);return{v,set,reset};}

export default function FieldsPage({store}){
  const{fields,expenses,yields}=store;
  const[modal,setModal]=useState(false);
  const totalAcres=fields.data.reduce((s,f)=>s+Number(f.acres),0);

  return(
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Fields &amp; Plots</h2>
          <p>Track each field's performance, crop status and harvest schedule</p>
        </div>
        <button className="btn btn-primary" onClick={()=>setModal(true)}><IconPlus size={15}/>Add Field</button>
      </div>

      <div className="metrics-grid mg-4" style={{marginBottom:24}}>
        <div className="metric-card"><div className="metric-icon"><IconField size={18}/></div><div className="metric-value">{fields.data.length}</div><div className="metric-label">Total Fields</div></div>
        <div className="metric-card c2"><div className="metric-icon"><IconField size={18}/></div><div className="metric-value">{totalAcres.toFixed(1)}</div><div className="metric-label">Total Acres</div></div>
        <div className="metric-card"><div className="metric-icon"><IconField size={18}/></div><div className="metric-value">{[...new Set(fields.data.map(f=>f.crop).filter(c=>c!=='Fallow'))].length}</div><div className="metric-label">Crops Growing</div></div>
        <div className="metric-card amber"><div className="metric-icon"><IconField size={18}/></div><div className="metric-value">{fields.data.filter(f=>{const d=daysFrom(f.harv);return d!=null&&d<=21&&d>=0;}).length}</div><div className="metric-label">Harvest Soon</div></div>
      </div>

      {fields.data.length===0&&<div className="empty-state card card-pad"><div className="empty-icon"><IconField size={24}/></div><div>No fields yet. Add your first field to get started.</div></div>}

      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16}}>
        {fields.data.map(f=>{
          const fe=sum(expenses.data.filter(e=>e.field===f.name),e=>e.amount);
          const fr=sum(yields.data.filter(y=>y.field===f.name),y=>y.revenue);
          const fp=fr-fe;
          const dh=daysFrom(f.harv);
          return(
            <div className="field-card" key={f.id}>
              <div className="field-stripe" style={{background:f.color}}/>
              <div className="flex-between" style={{marginBottom:8}}>
                <div>
                  <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:600}}>{f.name}</div>
                  <div style={{fontSize:11,color:'var(--text4)',marginTop:2}}>{f.acres} acres · {f.soil} · Sown {fmtD(f.sow)}</div>
                </div>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <span className="tag" style={{background:f.color+'18',color:f.color,border:`1px solid ${f.color}40`}}>{f.crop}</span>
                  <button className="icon-btn" onClick={()=>fields.remove(f.id)}><span style={{fontSize:12}}>✕</span></button>
                </div>
              </div>
              {f.notes&&<div style={{fontSize:11,color:'var(--text4)',marginBottom:10,fontStyle:'italic',lineHeight:1.5}}>{f.notes}</div>}
              <div className="field-grid">
                <div className="fstat"><div className="fstat-v">{fmtK(fe)}</div><div className="fstat-l">Expenses</div></div>
                <div className="fstat"><div className="fstat-v">{fmtK(fr)}</div><div className="fstat-l">Revenue</div></div>
                <div className="fstat"><div className="fstat-v" style={{color:fp>=0?'var(--c3)':'var(--red)'}}>{fp>=0?'+':''}{fmtK(fp)}</div><div className="fstat-l">Profit</div></div>
                <div className="fstat"><div className="fstat-v" style={{color:dh!=null&&dh<=14?'var(--amber)':'var(--text1)'}}>{dh!=null?(dh>0?dh+'d':'Due!'):'–'}</div><div className="fstat-l">To Harvest</div></div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={modal} onClose={()=>setModal(false)} title="Add Field / Plot" icon={<IconField size={18}/>}
        footer={<><button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={()=>{
          const name=document.getElementById('f-name').value.trim();
          if(!name){alert('Enter field name');return;}
          const COLORS=['#5A7863','#c07a12','#c0392b','#7c3aed','#0891b2','#ea580c'];
          fields.add({id:uid(),name,acres:Number(document.getElementById('f-acres').value)||1,crop:document.getElementById('f-crop').value,soil:document.getElementById('f-soil').value,sow:document.getElementById('f-sow').value||today(),harv:document.getElementById('f-harv').value||today(),notes:document.getElementById('f-notes').value,color:CROP_COLORS[document.getElementById('f-crop').value]||COLORS[fields.data.length%COLORS.length]});
          setModal(false);
        }}>Save Field</button></>}>
        <div className="form-row fr2">
          <div className="form-group"><label>Field Name</label><input id="f-name" placeholder="e.g. North Field"/></div>
          <div className="form-group"><label>Area (Acres)</label><input id="f-acres" type="number" placeholder="0.0" step="0.1"/></div>
        </div>
        <div className="form-row fr2">
          <div className="form-group"><label>Current Crop</label><select id="f-crop">{FIELD_CROPS.map(c=><option key={c}>{c}</option>)}</select></div>
          <div className="form-group"><label>Soil Type</label><select id="f-soil">{SOIL_TYPES.map(s=><option key={s}>{s}</option>)}</select></div>
        </div>
        <div className="form-row fr2">
          <div className="form-group"><label>Sowing Date</label><input id="f-sow" type="date" defaultValue={today()}/></div>
          <div className="form-group"><label>Expected Harvest</label><input id="f-harv" type="date"/></div>
        </div>
        <div className="form-group"><label>Notes</label><textarea id="f-notes" placeholder="Any notes about this field..."/></div>
      </Modal>
    </div>
  );
}
