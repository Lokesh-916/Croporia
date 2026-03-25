import React,{useState,useMemo} from 'react';
import Modal from '../components/Modal';
import ChartBox from '../components/ChartBox';
import{fmt,fmtK,fmtD,sum,uid,today} from '../utils/helpers';
import{EXPENSE_CATEGORIES,CROPS,PAYMENT_METHODS,CROP_COLORS} from '../data/constants';
import{IconExpense,IconPlus,IconSeed,IconDroplet,IconSpray,IconWorker,IconTractor,IconTruck,IconBox} from '../icons/Icons';

const CAT_ICON_MAP = {
  Seeds:      IconSeed,
  Fertilizer: IconDroplet,
  Pesticides: IconSpray,
  Labor:      IconWorker,
  Irrigation: IconDroplet,
  Equipment:  IconTractor,
  Transport:  IconTruck,
  Other:      IconBox,
};

export default function ExpensesPage({store}){
  const{expenses,fields}=store;
  const[modal,setModal]=useState(false);
  const total=sum(expenses.data,e=>e.amount);
  const monthlyExp=useMemo(()=>{const m=new Date();m.setDate(1);return sum(expenses.data.filter(e=>new Date(e.date)>=m),e=>e.amount);},[expenses.data]);
  const byCat=expenses.data.reduce((a,e)=>{a[e.cat]=(a[e.cat]||0)+Number(e.amount);return a;},{});
  const cats=Object.keys(byCat);
  const topCat=cats.sort((a,b)=>byCat[b]-byCat[a])[0];

  const catChart={type:'doughnut',data:{labels:cats,datasets:[{data:cats.map(c=>byCat[c]),backgroundColor:['#5A7863','#c07a12','#c0392b','#7c3aed','#0891b2','#ea580c','#2563eb','#6b7280'],borderWidth:2,borderColor:'#fff'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:11},boxWidth:10,padding:10}}}}};

  const save=()=>{
    const amt=Number(document.getElementById('ea').value);
    if(!amt){alert('Enter amount');return;}
    expenses.add({id:uid(),date:document.getElementById('ed').value||today(),amount:amt,cat:document.getElementById('ec').value,crop:document.getElementById('ecrop').value,field:document.getElementById('ef').value,pay:document.getElementById('ep').value,desc:document.getElementById('edesc').value});
    setModal(false);
  };

  return(
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left"><h2>Expenses</h2><p>Track all farm expenditures by category, crop, and field</p></div>
        <button className="btn btn-primary" onClick={()=>setModal(true)}><IconPlus size={15}/>Add Expense</button>
      </div>

      <div className="metrics-grid mg-4" style={{marginBottom:24}}>
        <div className="metric-card red"><div className="metric-icon"><IconExpense size={18}/></div><div className="metric-value">{fmtK(monthlyExp)}</div><div className="metric-label">This Month</div></div>
        <div className="metric-card"><div className="metric-icon"><IconExpense size={18}/></div><div className="metric-value">{fmtK(total)}</div><div className="metric-label">Total Spent</div></div>
        <div className="metric-card amber"><div className="metric-icon"><IconExpense size={18}/></div><div className="metric-value" style={{fontSize:16}}>{topCat||'–'}</div><div className="metric-label">Top Category</div></div>
        <div className="metric-card c2"><div className="metric-icon"><IconExpense size={18}/></div><div className="metric-value">{expenses.data.length}</div><div className="metric-label">Transactions</div></div>
      </div>

      <div className="two-panel left-wide">
        <div>
          <div className="sec-hd"><h3>All Transactions</h3></div>
          <div style={{maxHeight:'calc(100vh - 340px)',overflowY:'auto',paddingRight:4}}>
            {expenses.data.length===0&&<div className="empty-state card card-pad"><div className="empty-icon"><IconExpense size={24}/></div>No expenses yet.</div>}
            {expenses.data.map(e=>{
              const CIcon=CAT_ICON_MAP[e.cat]||IconExpense;
              return(
                <div className="list-item" key={e.id}>
                  <div className="list-icon" style={{background:(CROP_COLORS[e.crop]||'#888')+'15',color:CROP_COLORS[e.crop]||'var(--c3)'}}><CIcon size={17}/></div>
                  <div className="list-body">
                    <div className="list-title">{e.desc||e.cat}</div>
                    <div className="list-sub">
                      <span className="tag tag-green">{e.cat}</span>
                      <span className="tag tag-amber">{e.crop}</span>
                      {e.field&&<span className="tag tag-sky">{e.field}</span>}
                      <span style={{color:'var(--text4)'}}>{fmtD(e.date)} · {e.pay}</span>
                    </div>
                  </div>
                  <div className="list-right">
                    <div className="list-amount" style={{color:'var(--red)'}}>–{fmt(e.amount)}</div>
                    <button className="icon-btn" onClick={()=>expenses.remove(e.id)}><span style={{fontSize:12}}>✕</span></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card card-pad">
          <div className="card-title">Spending by Category</div>
          {cats.length>0?<ChartBox config={catChart} height="300px"/>:<div className="empty-state" style={{padding:'40px 0'}}><div style={{fontSize:13,color:'var(--text4)'}}>No data yet</div></div>}
        </div>
      </div>

      <Modal open={modal} onClose={()=>setModal(false)} title="Add Expense" icon={<IconExpense size={18}/>}
        footer={<><button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>Save</button></>}>
        <div className="form-row fr2">
          <div className="form-group"><label>Date</label><input id="ed" type="date" defaultValue={today()}/></div>
          <div className="form-group"><label>Amount (₹)</label><input id="ea" type="number" placeholder="0"/></div>
        </div>
        <div className="form-row fr2">
          <div className="form-group"><label>Category</label><select id="ec">{EXPENSE_CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
          <div className="form-group"><label>Crop</label><select id="ecrop">{CROPS.map(c=><option key={c}>{c}</option>)}</select></div>
        </div>
        <div className="form-row fr2">
          <div className="form-group"><label>Field</label><select id="ef">{fields.data.map(f=><option key={f.id}>{f.name}</option>)}</select></div>
          <div className="form-group"><label>Payment</label><select id="ep">{PAYMENT_METHODS.map(p=><option key={p}>{p}</option>)}</select></div>
        </div>
        <div className="form-group"><label>Description</label><input id="edesc" placeholder="e.g. DAP fertilizer 50kg"/></div>
      </Modal>
    </div>
  );
}
