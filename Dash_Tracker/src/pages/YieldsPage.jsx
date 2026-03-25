import React,{useState} from 'react';
import Modal from '../components/Modal';
import ChartBox from '../components/ChartBox';
import{fmt,fmtK,fmtD,sum,uid,today} from '../utils/helpers';
import{CROPS,CROP_COLORS} from '../data/constants';
import{IconHarvest,IconPlus} from '../icons/Icons';

export default function YieldsPage({store}){
  const{yields,fields}=store;
  const[modal,setModal]=useState(false);
  const totalRev=sum(yields.data,y=>y.revenue);
  const totalKg=sum(yields.data,y=>y.kg);
  const byCrop=yields.data.reduce((a,y)=>{a[y.crop]=(a[y.crop]||0)+Number(y.revenue);return a;},{});
  const crops=Object.keys(byCrop);

  const chart={type:'bar',data:{labels:crops,datasets:[{data:crops.map(c=>byCrop[c]),backgroundColor:crops.map(c=>CROP_COLORS[c]||'#888'),borderRadius:8,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{ticks:{callback:v=>'₹'+Math.round(v/1000)+'k',font:{size:10}},grid:{color:'rgba(0,0,0,.04)'}},x:{grid:{display:false}}}}};

  return(
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left"><h2>Yield Tracker</h2><p>Record harvests, track sales and monitor crop revenue</p></div>
        <button className="btn btn-primary" onClick={()=>setModal(true)}><IconPlus size={15}/>Record Yield</button>
      </div>

      <div className="metrics-grid mg-3" style={{marginBottom:24}}>
        <div className="metric-card"><div className="metric-icon"><IconHarvest size={18}/></div><div className="metric-value">{fmtK(totalRev)}</div><div className="metric-label">Total Revenue</div></div>
        <div className="metric-card c2"><div className="metric-icon"><IconHarvest size={18}/></div><div className="metric-value">{totalKg.toLocaleString('en-IN')} kg</div><div className="metric-label">Total Yield</div></div>
        <div className="metric-card"><div className="metric-icon"><IconHarvest size={18}/></div><div className="metric-value">{yields.data.length}</div><div className="metric-label">Harvest Records</div></div>
      </div>

      <div className="two-panel left-wide">
        <div>
          <div className="sec-hd"><h3>Harvest Records</h3></div>
          {yields.data.length===0&&<div className="empty-state card card-pad"><div className="empty-icon"><IconHarvest size={24}/></div>No yields recorded yet.</div>}
          <div style={{maxHeight:'calc(100vh - 340px)',overflowY:'auto'}}>
            {yields.data.map(y=>(
              <div className="list-item" key={y.id}>
                <div className="list-icon" style={{background:(CROP_COLORS[y.crop]||'#888')+'18',color:CROP_COLORS[y.crop]||'#888'}}><IconHarvest size={18}/></div>
                <div className="list-body">
                  <div className="list-title">{y.crop} — {y.kg.toLocaleString()} kg @ {fmt(y.price)}/kg</div>
                  <div className="list-sub"><span className="tag tag-green">{y.field||'–'}</span><span style={{color:'var(--text4)'}}>{fmtD(y.date)} · {y.buyer||'Market'}</span></div>
                </div>
                <div className="list-right">
                  <div className="list-amount" style={{color:'var(--c3)'}}>+{fmt(y.revenue)}</div>
                  <button className="icon-btn" onClick={()=>yields.remove(y.id)}><span style={{fontSize:12}}>✕</span></button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card card-pad">
          <div className="card-title">Revenue by Crop</div>
          {crops.length>0?<ChartBox config={chart} height="300px"/>:<div className="empty-state" style={{padding:'40px 0'}}><div style={{fontSize:13,color:'var(--text4)'}}>No data yet</div></div>}
        </div>
      </div>

      <Modal open={modal} onClose={()=>setModal(false)} title="Record Yield / Sale" icon={<IconHarvest size={18}/>}
        footer={<><button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={()=>{
          const kg=Number(document.getElementById('y-kg').value),price=Number(document.getElementById('y-price').value);
          if(!kg||!price){alert('Enter yield and price');return;}
          yields.add({id:uid(),crop:document.getElementById('y-crop').value,field:document.getElementById('y-field').value,kg,price,revenue:kg*price,date:document.getElementById('y-date').value||today(),buyer:document.getElementById('y-buyer').value});
          setModal(false);
        }}>Save</button></>}>
        <div className="form-row fr2">
          <div className="form-group"><label>Crop</label><select id="y-crop">{CROPS.map(c=><option key={c}>{c}</option>)}</select></div>
          <div className="form-group"><label>Field</label><select id="y-field">{fields.data.map(f=><option key={f.id}>{f.name}</option>)}</select></div>
        </div>
        <div className="form-row fr3">
          <div className="form-group"><label>Yield (kg)</label><input id="y-kg" type="number" placeholder="0"/></div>
          <div className="form-group"><label>Price (₹/kg)</label><input id="y-price" type="number" placeholder="0"/></div>
          <div className="form-group"><label>Date</label><input id="y-date" type="date" defaultValue={today()}/></div>
        </div>
        <div className="form-group"><label>Sold To</label><input id="y-buyer" placeholder="e.g. APMC Vijayawada"/></div>
      </Modal>
    </div>
  );
}
