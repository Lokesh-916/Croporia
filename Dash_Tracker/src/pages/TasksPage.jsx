import React,{useState} from 'react';
import Modal from '../components/Modal';
import{fmtD,uid,today,isOverdue} from '../utils/helpers';
import{TASK_CATEGORIES,PRIORITY_COLORS} from '../data/constants';
import{IconTask,IconBell,IconPlus,IconCheck,IconAlert,IconCalendar} from '../icons/Icons';

function useForm(i){const[v,setV]=useState(i);const set=k=>e=>setV(p=>({...p,[k]:e.target.value}));const reset=()=>setV(i);return{v,set,reset};}

export default function TasksPage({store}){
  const{tasks}=store;
  const[modal,setModal]=useState(false);
  const{v,set,reset}=useForm({title:'',date:today(),pri:'Medium',cat:'Fertilizer'});
  const pending=tasks.data.filter(t=>!t.done);
  const done=tasks.data.filter(t=>t.done);
  const overdue=pending.filter(t=>isOverdue(t.date));
  const upcoming=pending.filter(t=>!isOverdue(t.date));
  const sorted=upcoming.sort((a,b)=>({High:0,Medium:1,Low:2}[a.pri]-{High:0,Medium:1,Low:2}[b.pri]));

  const save=()=>{
    if(!v.title.trim()){alert('Enter task name');return;}
    tasks.add({id:uid(),...v,done:false});
    reset(); setModal(false);
  };

  return(
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left"><h2>Tasks &amp; Reminders</h2><p>Stay on top of farm activities, deadlines and scheduled tasks</p></div>
        <button className="btn btn-primary" onClick={()=>setModal(true)}><IconPlus size={15}/>Add Task</button>
      </div>

      <div className="metrics-grid mg-4" style={{marginBottom:24}}>
        <div className="metric-card red"><div className="metric-icon"><IconAlert size={18}/></div><div className="metric-value">{overdue.length}</div><div className="metric-label">Overdue</div></div>
        <div className="metric-card amber"><div className="metric-icon"><IconBell size={18}/></div><div className="metric-value">{pending.length}</div><div className="metric-label">Pending</div></div>
        <div className="metric-card"><div className="metric-icon"><IconCalendar size={18}/></div><div className="metric-value">{pending.filter(t=>({High:1}[t.pri])).length}</div><div className="metric-label">High Priority</div></div>
        <div className="metric-card c2"><div className="metric-icon"><IconCheck size={18}/></div><div className="metric-value">{done.length}</div><div className="metric-label">Completed</div></div>
      </div>

      <div className="two-panel">
        <div>
          {overdue.length>0&&(
            <>
              <div className="alert alert-danger"><IconAlert size={14}/><strong>{overdue.length} overdue task{overdue.length>1?'s':''}</strong> — action required</div>
              {overdue.map(t=>(
                <div className="task-item overdue" key={t.id}>
                  <div className="task-dot" style={{background:PRIORITY_COLORS[t.pri]}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.title}</div>
                    <div style={{fontSize:11,color:'var(--text4)',marginTop:2,display:'flex',gap:5,flexWrap:'wrap'}}>
                      <span className="tag tag-red">{t.cat}</span>
                      <span>Due {fmtD(t.date)}</span>
                      <span style={{color:PRIORITY_COLORS[t.pri],fontWeight:600}}>{t.pri}</span>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:6}}>
                    <button className="btn btn-sky btn-xs" onClick={()=>tasks.update(t.id,{done:true})}><IconCheck size={13}/>Done</button>
                    <button className="icon-btn" onClick={()=>tasks.remove(t.id)}><span style={{fontSize:12}}>✕</span></button>
                  </div>
                </div>
              ))}
              <div className="divider"/>
            </>
          )}
          <div className="sec-hd"><h3>Upcoming ({sorted.length})</h3></div>
          {sorted.length===0&&overdue.length===0&&<div className="alert alert-success"><IconCheck size={14}/>All tasks completed! Great work.</div>}
          {sorted.map(t=>(
            <div className="task-item" key={t.id}>
              <div className="task-dot" style={{background:PRIORITY_COLORS[t.pri]}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.title}</div>
                <div style={{fontSize:11,color:'var(--text4)',marginTop:2,display:'flex',gap:5,flexWrap:'wrap'}}>
                  <span className="tag tag-green">{t.cat}</span>
                  <span>Due {fmtD(t.date)}</span>
                  <span style={{color:PRIORITY_COLORS[t.pri],fontWeight:600}}>{t.pri}</span>
                </div>
              </div>
              <div style={{display:'flex',gap:6}}>
                <button className="btn btn-sky btn-xs" onClick={()=>tasks.update(t.id,{done:true})}><IconCheck size={13}/>Done</button>
                <button className="icon-btn" onClick={()=>tasks.remove(t.id)}><span style={{fontSize:12}}>✕</span></button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="sec-hd"><h3>Completed ({done.length})</h3></div>
          {done.length===0&&<div style={{textAlign:'center',color:'var(--text4)',fontSize:12,padding:'20px 0'}}>No completed tasks yet</div>}
          {done.map(t=>(
            <div className="task-item" style={{opacity:.5}} key={t.id}>
              <div className="task-dot" style={{background:'#ccc'}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,textDecoration:'line-through',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.title}</div>
                <div style={{fontSize:11,color:'var(--text4)',marginTop:2}}>{fmtD(t.date)}</div>
              </div>
              <button className="icon-btn" onClick={()=>tasks.remove(t.id)}><span style={{fontSize:12}}>✕</span></button>
            </div>
          ))}
        </div>
      </div>

      <Modal open={modal} onClose={()=>{reset();setModal(false);}} title="Add Task / Reminder" icon={<IconBell size={18}/>}
        footer={<><button className="btn btn-ghost" onClick={()=>{reset();setModal(false);}}>Cancel</button><button className="btn btn-primary" onClick={save}>Save Task</button></>}>
        <div className="form-group"><label>Task Description</label><input value={v.title} onChange={set('title')} placeholder="e.g. Apply fertilizer — Rice field"/></div>
        <div className="form-row fr3">
          <div className="form-group"><label>Due Date</label><input type="date" value={v.date} onChange={set('date')}/></div>
          <div className="form-group"><label>Priority</label><select value={v.pri} onChange={set('pri')}>{['High','Medium','Low'].map(p=><option key={p}>{p}</option>)}</select></div>
          <div className="form-group"><label>Category</label><select value={v.cat} onChange={set('cat')}>{TASK_CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
        </div>
      </Modal>
    </div>
  );
}
