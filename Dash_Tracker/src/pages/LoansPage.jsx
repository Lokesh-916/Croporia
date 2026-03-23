import React,{useState} from 'react';
import Modal from '../components/Modal';
import ChartBox from '../components/ChartBox';
import{fmt,fmtK,fmtD,sum,uid,today,calcEMI} from '../utils/helpers';
import{LOAN_SOURCES,LOAN_PURPOSES} from '../data/constants';
import{IconLoan,IconPlus,IconBell} from '../icons/Icons';

export default function LoansPage({store}){
  const{loans,tasks}=store;
  const[modal,setModal]=useState(false);
  const totalP=sum(loans.data,l=>l.principal);
  const totalPaid=sum(loans.data,l=>l.paid);
  const totalBal=totalP-totalPaid;

  const chart={type:'bar',data:{labels:loans.data.map(l=>l.name.substring(0,14)),datasets:[{label:'Paid',data:loans.data.map(l=>l.paid),backgroundColor:'rgba(90,120,99,.75)',borderRadius:5,borderSkipped:false},{label:'Balance',data:loans.data.map(l=>l.principal-l.paid),backgroundColor:'rgba(192,57,43,.65)',borderRadius:5,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{stacked:true,ticks:{callback:v=>'₹'+Math.round(v/1000)+'k',font:{size:10}},grid:{color:'rgba(0,0,0,.04)'}},y:{stacked:true,grid:{display:false},ticks:{font:{size:11}}}}}};

  const addReminder=l=>{
    tasks.add({id:uid(),title:`EMI due — ${l.name} (${l.source})`,date:l.nextDue||today(),pri:'High',cat:'Loan EMI',done:false});
  };

  const save=()=>{
    const p=Number(document.getElementById('lp').value);
    if(!p){alert('Enter amount');return;}
    loans.add({id:uid(),name:document.getElementById('ln').value||'Loan',source:document.getElementById('ls').value,principal:p,interest:Number(document.getElementById('li').value)||7,months:Number(document.getElementById('lm').value)||12,start:document.getElementById('lst').value||today(),purpose:document.getElementById('lpu').value,paid:0,nextDue:document.getElementById('lnd').value||''});
    setModal(false);
  };

  return(
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left"><h2>Loan Tracker</h2><p>Monitor KCC, NABARD, and bank loans with repayment progress</p></div>
        <button className="btn btn-primary" onClick={()=>setModal(true)}><IconPlus size={15}/>Add Loan</button>
      </div>

      <div className="metrics-grid mg-3" style={{marginBottom:24}}>
        <div className="metric-card sky"><div className="metric-icon"><IconLoan size={18}/></div><div className="metric-value">{fmtK(totalP)}</div><div className="metric-label">Total Loans</div></div>
        <div className="metric-card"><div className="metric-icon"><IconLoan size={18}/></div><div className="metric-value">{fmtK(totalPaid)}</div><div className="metric-label">Total Paid</div></div>
        <div className="metric-card red"><div className="metric-icon"><IconLoan size={18}/></div><div className="metric-value">{fmtK(totalBal)}</div><div className="metric-label">Outstanding</div></div>
      </div>

      <div className="two-panel left-wide">
        <div>
          <div className="sec-hd"><h3>Active Loans</h3></div>
          {loans.data.length===0&&<div className="empty-state card card-pad"><div className="empty-icon"><IconLoan size={24}/></div>No loans tracked yet.</div>}
          {loans.data.map(l=>{
            const bal=l.principal-l.paid;
            const pct=Math.round(l.paid/l.principal*100);
            const emi=calcEMI(l.principal,l.interest,l.months);
            return(
              <div className="loan-card" key={l.id}>
                <div className="flex-between" style={{marginBottom:12}}>
                  <div>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:15,fontWeight:700}}>{l.name}</div>
                    <div style={{fontSize:11,color:'var(--text4)',marginTop:2}}>{l.source} · {l.purpose}</div>
                  </div>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <button className="btn btn-ghost btn-sm" onClick={()=>addReminder(l)}><IconBell size={13}/>Remind</button>
                    <button className="icon-btn" onClick={()=>loans.remove(l.id)}><span style={{fontSize:12}}>✕</span></button>
                  </div>
                </div>
                <div className="pbar"><div className="pfill" style={{width:`${pct}%`,background:pct>=80?'var(--c3)':pct>=50?'var(--amber)':'var(--red)'}}/></div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'var(--text4)',margin:'4px 0 10px'}}>
                  <span>{pct}% repaid</span><span>Next due: {fmtD(l.nextDue)}</span>
                </div>
                <div className="loan-nums">
                  <div className="lnum"><div className="lnum-v">{fmt(l.principal)}</div><div className="lnum-l">Principal</div></div>
                  <div className="lnum"><div className="lnum-v" style={{color:'var(--c3)'}}>{fmt(l.paid)}</div><div className="lnum-l">Paid</div></div>
                  <div className="lnum"><div className="lnum-v" style={{color:'var(--red)'}}>{fmt(bal)}</div><div className="lnum-l">Balance</div></div>
                </div>
                <div className="loan-footer">
                  <div><div className="lfooter-v">{l.interest}%</div><div className="lfooter-l">Interest</div></div>
                  <div><div className="lfooter-v">{l.months}m</div><div className="lfooter-l">Tenure</div></div>
                  <div><div className="lfooter-v">{fmt(emi)}</div><div className="lfooter-l">~EMI</div></div>
                  <div><div className="lfooter-v">{fmtD(l.start)}</div><div className="lfooter-l">Started</div></div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="card card-pad">
          <div className="card-title">Repayment Progress</div>
          {loans.data.length>0?<ChartBox config={chart} height="280px"/>:<div className="empty-state" style={{padding:'40px 0'}}><div style={{fontSize:13,color:'var(--text4)'}}>No data yet</div></div>}
        </div>
      </div>

      <Modal open={modal} onClose={()=>setModal(false)} title="Add Loan" icon={<IconLoan size={18}/>}
        footer={<><button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>Save Loan</button></>}>
        <div className="form-row fr2">
          <div className="form-group"><label>Loan Name</label><input id="ln" placeholder="e.g. Kisan Credit Card"/></div>
          <div className="form-group"><label>Source</label><select id="ls">{LOAN_SOURCES.map(s=><option key={s}>{s}</option>)}</select></div>
        </div>
        <div className="form-row fr3">
          <div className="form-group"><label>Principal (₹)</label><input id="lp" type="number" placeholder="0"/></div>
          <div className="form-group"><label>Interest %</label><input id="li" type="number" defaultValue="7" step="0.1"/></div>
          <div className="form-group"><label>Tenure (months)</label><input id="lm" type="number" defaultValue="12"/></div>
        </div>
        <div className="form-row fr2">
          <div className="form-group"><label>Start Date</label><input id="lst" type="date" defaultValue={today()}/></div>
          <div className="form-group"><label>Next Due Date</label><input id="lnd" type="date"/></div>
        </div>
        <div className="form-group"><label>Purpose</label><select id="lpu">{LOAN_PURPOSES.map(p=><option key={p}>{p}</option>)}</select></div>
      </Modal>
    </div>
  );
}
