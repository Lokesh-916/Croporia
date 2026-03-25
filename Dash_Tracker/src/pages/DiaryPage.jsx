import React,{useState} from 'react';
import Modal from '../components/Modal';
import{fmtD,uid,today,isOverdue} from '../utils/helpers';
import{CROPS,CROP_STAGES,WEATHER_OPTIONS,TASK_CATEGORIES,PRIORITY_COLORS} from '../data/constants';
import{IconDiary,IconBell,IconPlus,IconCheck,IconAlert} from '../icons/Icons';

function useForm(i){const[v,setV]=useState(i);const set=k=>e=>setV(p=>({...p,[k]:e.target.value}));const reset=()=>setV(i);return{v,set,reset};}

export default function DiaryPage({store}){
  const{diary,tasks}=store;
  const[modal,setModal]=useState(null); // 'diary' | 'task'
  const{v:dv,set:ds,reset:dr}=useForm({date:today(),weather:'Sunny',crop:'Rice',stage:'Vegetative',work:'',prob:''});
  const{v:tv,set:ts,reset:tr}=useForm({title:'',date:today(),pri:'Medium',cat:'Fertilizer'});

  const pending=tasks.data.filter(t=>!t.done);
  const overdue=pending.filter(t=>isOverdue(t.date));
  const upcoming=pending.filter(t=>!isOverdue(t.date)).sort((a,b)=>new Date(a.date)-new Date(b.date));

  const saveDiary=()=>{
    diary.add({id:uid(),...dv,work:dv.work||'No details.'});
    dr(); setModal(null);
  };
  const saveTask=()=>{
    if(!tv.title.trim()){alert('Enter task name');return;}
    tasks.add({id:uid(),...tv,done:false});
    tr(); setModal(null);
  };

  return(
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left"><h2>Farm Diary &amp; Reminders</h2><p>Daily activity log alongside your task list — everything in one place</p></div>
        <div style={{display:'flex',gap:9}}>
          <button className="btn btn-ghost" onClick={()=>setModal('task')}><IconBell size={15}/>Add Reminder</button>
          <button className="btn btn-primary" onClick={()=>setModal('diary')}><IconPlus size={15}/>New Entry</button>
        </div>
      </div>

      <div className="two-panel right-wide">

        {/* LEFT — Reminders panel */}
        <div>
          {overdue.length>0&&(
            <div className="alert alert-danger" style={{marginBottom:14}}>
              <IconAlert size={15}/>
              <strong>{overdue.length} overdue task{overdue.length>1?'s':''}</strong> — take action
            </div>
          )}

          {/* Overdue */}
          {overdue.length>0&&(
            <>
              <div className="sec-hd" style={{marginBottom:8}}>
                <h3 style={{color:'var(--red)',fontSize:13}}>Overdue</h3>
              </div>
              {overdue.map(t=>(
                <div className="task-item overdue" key={t.id}>
                  <div className="task-dot" style={{background:PRIORITY_COLORS[t.pri]}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.title}</div>
                    <div style={{fontSize:10,color:'var(--text4)',marginTop:2,display:'flex',gap:4}}>
                      <span className="tag tag-red">{t.cat}</span>
                      <span>{fmtD(t.date)}</span>
                    </div>
                  </div>
                  <button className="btn btn-sky btn-xs" style={{padding:'4px 8px'}} onClick={()=>tasks.update(t.id,{done:true})}><IconCheck size={12}/></button>
                  <button className="icon-btn" onClick={()=>tasks.remove(t.id)}><span style={{fontSize:11}}>✕</span></button>
                </div>
              ))}
              <div className="divider"/>
            </>
          )}

          {/* Upcoming */}
          <div className="sec-hd" style={{marginBottom:8}}>
            <h3 style={{fontSize:13}}>Upcoming Tasks</h3>
            <button className="btn btn-ghost btn-xs" onClick={()=>setModal('task')}><IconPlus size={12}/>Add</button>
          </div>
          {upcoming.length===0&&overdue.length===0&&(
            <div className="empty-state card card-pad" style={{padding:'20px'}}>
              <div className="empty-icon" style={{width:38,height:38}}><IconBell size={18}/></div>
              <div style={{fontSize:12}}>No pending tasks</div>
            </div>
          )}
          <div style={{maxHeight:'calc(100vh - 420px)',overflowY:'auto'}}>
            {upcoming.slice(0,8).map(t=>(
              <div className="task-item" key={t.id}>
                <div className="task-dot" style={{background:PRIORITY_COLORS[t.pri]}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.title}</div>
                  <div style={{fontSize:10,color:'var(--text4)',marginTop:2,display:'flex',gap:4}}>
                    <span className="tag tag-green">{t.cat}</span>
                    <span>{fmtD(t.date)}</span>
                    <span style={{color:PRIORITY_COLORS[t.pri],fontWeight:600}}>{t.pri}</span>
                  </div>
                </div>
                <button className="btn btn-sky btn-xs" style={{padding:'4px 8px'}} onClick={()=>tasks.update(t.id,{done:true})}><IconCheck size={12}/></button>
                <button className="icon-btn" onClick={()=>tasks.remove(t.id)}><span style={{fontSize:11}}>✕</span></button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Diary entries */}
        <div>
          <div className="sec-hd" style={{marginBottom:12}}>
            <h3>Daily Log</h3>
            <button className="btn btn-primary btn-sm" onClick={()=>setModal('diary')}><IconPlus size={14}/>New Entry</button>
          </div>
          {diary.data.length===0&&<div className="empty-state card card-pad"><div className="empty-icon"><IconDiary size={24}/></div>No diary entries yet.</div>}
          <div style={{maxHeight:'calc(100vh - 320px)',overflowY:'auto',paddingRight:4}}>
            {diary.data.map(d=>(
              <div className="diary-card" key={d.id}>
                <div className="flex-between" style={{marginBottom:8}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:11,fontWeight:700,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'.4px'}}>{fmtD(d.date)}</span>
                    <span className="tag tag-gray">{d.weather}</span>
                    <span className="tag tag-amber">{d.stage}</span>
                  </div>
                  <div style={{display:'flex',gap:6,alignItems:'center'}}>
                    <span className="tag tag-green">{d.crop}</span>
                    <button className="icon-btn" onClick={()=>diary.remove(d.id)}><span style={{fontSize:11}}>✕</span></button>
                  </div>
                </div>
                <div style={{fontSize:11,fontWeight:700,color:'var(--text4)',textTransform:'uppercase',letterSpacing:'.4px',marginBottom:4}}>Work Done</div>
                <div style={{fontSize:12,color:'var(--text2)',lineHeight:1.7}}>{d.work}</div>
                {d.prob&&<div className="diary-problem">⚠ {d.prob}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Diary Modal */}
      <Modal open={modal==='diary'} onClose={()=>{dr();setModal(null);}} title="New Diary Entry" icon={<IconDiary size={18}/>}
        footer={<><button className="btn btn-ghost" onClick={()=>{dr();setModal(null);}}>Cancel</button><button className="btn btn-primary" onClick={saveDiary}>Save Entry</button></>}>
        <div className="form-row fr2">
          <div className="form-group"><label>Date</label><input type="date" value={dv.date} onChange={ds('date')}/></div>
          <div className="form-group"><label>Weather</label><select value={dv.weather} onChange={ds('weather')}>{WEATHER_OPTIONS.map(w=><option key={w}>{w}</option>)}</select></div>
        </div>
        <div className="form-row fr2">
          <div className="form-group"><label>Crop</label><select value={dv.crop} onChange={ds('crop')}>{[...CROPS,'All Fields'].map(c=><option key={c}>{c}</option>)}</select></div>
          <div className="form-group"><label>Stage</label><select value={dv.stage} onChange={ds('stage')}>{CROP_STAGES.map(s=><option key={s}>{s}</option>)}</select></div>
        </div>
        <div className="form-group"><label>Work Done</label><textarea value={dv.work} onChange={ds('work')} placeholder="What farming activities did you do today?"/></div>
        <div className="form-group"><label>Problems / Observations</label><textarea value={dv.prob} onChange={ds('prob')} placeholder="Any pests, disease, water issues..."/></div>
      </Modal>

      {/* Task Modal */}
      <Modal open={modal==='task'} onClose={()=>{tr();setModal(null);}} title="Add Task / Reminder" icon={<IconBell size={18}/>}
        footer={<><button className="btn btn-ghost" onClick={()=>{tr();setModal(null);}}>Cancel</button><button className="btn btn-primary" onClick={saveTask}>Save Task</button></>}>
        <div className="form-group"><label>Task Description</label><input value={tv.title} onChange={ts('title')} placeholder="e.g. Apply fertilizer — Rice field"/></div>
        <div className="form-row fr3">
          <div className="form-group"><label>Due Date</label><input type="date" value={tv.date} onChange={ts('date')}/></div>
          <div className="form-group"><label>Priority</label><select value={tv.pri} onChange={ts('pri')}>{['High','Medium','Low'].map(p=><option key={p}>{p}</option>)}</select></div>
          <div className="form-group"><label>Category</label><select value={tv.cat} onChange={ts('cat')}>{TASK_CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
        </div>
      </Modal>
    </div>
  );
}
