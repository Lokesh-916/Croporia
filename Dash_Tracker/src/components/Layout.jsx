import React,{useState,useEffect} from 'react';
import{IconHome,IconField,IconHarvest,IconDiary,IconTask,IconExpense,IconLoan,IconReport,IconBell,IconLeaf,IconAlert} from '../icons/Icons';

const NAV=[
  {section:'Overview'},
  {id:'dashboard', label:'Dashboard',      Icon:IconHome},
  {section:'Farm'},
  {id:'fields',    label:'Fields & Plots', Icon:IconField},
  {id:'yields',    label:'Yield Tracker',  Icon:IconHarvest},
  {id:'diary',     label:'Farm Diary',     Icon:IconDiary,  badge:'tasks'},
  {section:'Finance'},
  {id:'expenses',  label:'Expenses',       Icon:IconExpense},
  {id:'loans',     label:'Loans',          Icon:IconLoan},
  {id:'reports',   label:'Reports',        Icon:IconReport},
  {section:''},
  {id:'tasks',     label:'Tasks & Reminders', Icon:IconTask, badge:'tasks'},
];

export default function Layout({children,page,onNav,pendingTasks=0,overdueCount=0}){
  const [clock,setClock]=useState('');
  useEffect(()=>{
    const t=setInterval(()=>setClock(new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})),1000);
    return()=>clearInterval(t);
  },[]);

  return(
    <div className="app-shell">
      {/* Topbar */}
      <header className="topbar">
        <div className="topbar-brand">
          <div className="topbar-logo"><IconLeaf size={18} color="#EBF4DD"/></div>
          <div style={{marginLeft:10}}>
            <div className="topbar-name">Croporia</div>
            <div className="topbar-tagline">Smart Farm Platform</div>
          </div>
        </div>
        <div className="topbar-right">
          {overdueCount>0&&(
            <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(192,57,43,.2)',border:'1px solid rgba(192,57,43,.3)',borderRadius:20,padding:'5px 12px',fontSize:11,color:'#ffb3b3',cursor:'pointer'}} onClick={()=>onNav('tasks')}>
              <IconAlert size={13} color="#ffb3b3"/>
              {overdueCount} overdue task{overdueCount>1?'s':''}
            </div>
          )}
          <div className="topbar-weather-pill">
            <span style={{color:'var(--c2)',fontSize:13}}>☀</span>
            <span className="temp">29°C</span>
            <span style={{color:'rgba(235,244,221,.6)'}}>Sunny · AP</span>
          </div>
          <div className="topbar-clock">
            <div>{new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div>
            <div>{clock}</div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <nav className="sidebar">
        {NAV.map((n,i)=>{
          if(n.section!==undefined)return(
            <div key={i}>
              {i>0&&<div className="nav-divider"/>}
              {n.section&&<div className="sidebar-section-label">{n.section}</div>}
            </div>
          );
          const bCount=n.badge==='tasks'?pendingTasks:0;
          return(
            <button key={n.id} className={`nav-link${page===n.id?' active':''}`} onClick={()=>onNav(n.id)}>
              <n.Icon size={16} color={page===n.id?'#EBF4DD':'rgba(235,244,221,.55)'}/>
              {n.label}
              {bCount>0&&<span className="nav-badge">{bCount}</span>}
            </button>
          );
        })}
      </nav>

      {/* Main */}
      <main className="main-area">
        {children}
      </main>
    </div>
  );
}
