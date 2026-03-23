import React,{useMemo} from 'react';
import ChartBox from '../components/ChartBox';
import{fmt,fmtK,fmtD,sum,daysFrom,lastNMonths} from '../utils/helpers';
import{CROP_COLORS} from '../data/constants';
import{IconField,IconExpense,IconHarvest,IconLoan,IconDroplet,IconLeaf,IconArrow} from '../icons/Icons';

export default function Dashboard({store,onNav}){
  const{fields,expenses,yields,loans,tasks}=store;
  const totalRev = useMemo(()=>sum(yields.data,y=>y.revenue),[yields.data]);
  const totalExp = useMemo(()=>sum(expenses.data,e=>e.amount),[expenses.data]);
  const profit   = totalRev-totalExp;
  const loanBal  = useMemo(()=>sum(loans.data,l=>l.principal-l.paid),[loans.data]);
  const monthlyExp=useMemo(()=>{const m=new Date();m.setDate(1);return sum(expenses.data.filter(e=>new Date(e.date)>=m),e=>e.amount);},[expenses.data]);
  const totalAcres=useMemo(()=>sum(fields.data,f=>Number(f.acres)),[fields.data]);

  const months=lastNMonths(7);
  const expArr=[18000,22000,15000,28000,19000,24000,monthlyExp||12000];
  const revArr=[25000,30000,20000,45000,28000,35000,totalRev||0];

  const barChart={
    type:'bar',
    data:{labels:months,datasets:[
      {label:'Expenses',data:expArr,backgroundColor:'rgba(192,57,43,.65)',borderRadius:5,borderSkipped:false},
      {label:'Revenue', data:revArr,backgroundColor:'rgba(90,120,99,.7)', borderRadius:5,borderSkipped:false},
    ]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},
      scales:{y:{ticks:{callback:v=>'₹'+Math.round(v/1000)+'k',font:{size:10}},grid:{color:'rgba(0,0,0,.04)'}},x:{grid:{display:false},ticks:{font:{size:10}}}}},
  };

  const byCrop=yields.data.reduce((a,y)=>{a[y.crop]=(a[y.crop]||0)+Number(y.revenue);return a;},{});
  const cropKeys=Object.keys(byCrop);
  const cropChart={
    type:'doughnut',
    data:{labels:cropKeys,datasets:[{data:cropKeys.map(c=>byCrop[c]),backgroundColor:cropKeys.map(c=>CROP_COLORS[c]||'#888'),borderWidth:2,borderColor:'#fff'}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{font:{size:11},boxWidth:10,padding:8}}}},
  };

  return(
    <div className="page-content">
      {/* Weather */}
      <div className="weather-card">
        <div>
          <div style={{fontSize:10,color:'rgba(235,244,221,.45)',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:6}}>Today · Andhra Pradesh</div>
          <div className="weather-temp">29°C</div>
          <div className="weather-cond">Sunny &amp; Warm</div>
          <div className="weather-loc">Ideal conditions for field work</div>
        </div>
        <div>
          <div className="weather-pills">
            <div className="weather-pill"><IconDroplet size={12} color="#90AB8B"/>Humidity 68%</div>
            <div className="weather-pill"><span style={{fontSize:12}}>💨</span> Wind 14 km/h</div>
            <div className="weather-pill"><span style={{fontSize:12}}>🌧</span> Rain in 3 days</div>
            <div className="weather-pill"><span style={{fontSize:12}}>🌡</span> Min 22°C</div>
          </div>
        </div>
      </div>

      {/* KPI metrics */}
      <div className="metrics-grid mg-5">
        <div className="metric-card">
          <div className="metric-icon"><IconHarvest size={18}/></div>
          <div className="metric-value">{fmtK(totalRev)}</div>
          <div className="metric-label">Total Revenue</div>
        </div>
        <div className="metric-card red">
          <div className="metric-icon"><IconExpense size={18}/></div>
          <div className="metric-value">{fmtK(totalExp)}</div>
          <div className="metric-label">Total Expenses</div>
        </div>
        <div className={`metric-card${profit<0?' red':''}`}>
          <div className="metric-icon"><IconLeaf size={18}/></div>
          <div className="metric-value" style={{color:profit>=0?'var(--c3)':'var(--red)'}}>{profit>=0?'+':''}{fmtK(profit)}</div>
          <div className="metric-label">Net Profit</div>
        </div>
        <div className="metric-card amber">
          <div className="metric-icon"><IconExpense size={18}/></div>
          <div className="metric-value">{fmtK(monthlyExp)}</div>
          <div className="metric-label">This Month</div>
        </div>
        <div className="metric-card sky">
          <div className="metric-icon"><IconLoan size={18}/></div>
          <div className="metric-value">{fmtK(loanBal)}</div>
          <div className="metric-label">Loan Balance</div>
        </div>
      </div>

      {/* Two panel — chart + crop revenue */}
      <div className="two-panel" style={{marginBottom:20}}>
        <div className="card card-pad">
          <div className="card-title">
            Monthly Expenses vs Revenue
            <div style={{display:'flex',gap:10,fontSize:11,color:'var(--text4)'}}>
              <span><span style={{display:'inline-block',width:8,height:8,borderRadius:2,background:'rgba(192,57,43,.65)',marginRight:4}}/>Exp</span>
              <span><span style={{display:'inline-block',width:8,height:8,borderRadius:2,background:'rgba(90,120,99,.7)',marginRight:4}}/>Rev</span>
            </div>
          </div>
          <ChartBox config={barChart} height="190px"/>
        </div>
        <div className="card card-pad">
          <div className="card-title">Revenue by Crop</div>
          {cropKeys.length>0
            ?<ChartBox config={cropChart} height="190px"/>
            :<div className="empty-state" style={{padding:'30px 0'}}><div style={{fontSize:13,color:'var(--text4)'}}>No yield data yet</div></div>
          }
        </div>
      </div>

      {/* Fields + recent expenses */}
      <div className="two-panel left-wide">
        <div>
          <div className="sec-hd">
            <h3>Active Fields</h3>
            <button className="btn btn-ghost btn-sm" onClick={()=>onNav('fields')}><IconArrow size={14}/>View all</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {fields.data.slice(0,4).map(f=>{
              const fe=sum(expenses.data.filter(e=>e.field===f.name),e=>e.amount);
              const fr=sum(yields.data.filter(y=>y.field===f.name),y=>y.revenue);
              const dh=daysFrom(f.harv);
              return(
                <div className="field-card" key={f.id} style={{marginBottom:0}}>
                  <div className="field-stripe" style={{background:f.color}}/>
                  <div className="flex-between" style={{marginBottom:6}}>
                    <div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:600}}>{f.name}</div>
                      <div style={{fontSize:10,color:'var(--text4)',marginTop:1}}>{f.acres} ac · {f.soil}</div>
                    </div>
                    <span className="tag tag-green" style={{background:f.color+'18',color:f.color,borderColor:f.color+'40'}}>{f.crop}</span>
                  </div>
                  <div className="field-grid" style={{gridTemplateColumns:'repeat(2,1fr)'}}>
                    <div className="fstat"><div className="fstat-v">{fmtK(fe)}</div><div className="fstat-l">Spent</div></div>
                    <div className="fstat">
                      <div className="fstat-v" style={{color:dh!=null&&dh<=14?'var(--amber)':'var(--text1)'}}>{dh!=null?(dh>0?dh+'d':'Due!'):'–'}</div>
                      <div className="fstat-l">Harvest</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="sec-hd">
            <h3>Recent Expenses</h3>
            <button className="btn btn-ghost btn-sm" onClick={()=>onNav('expenses')}><IconArrow size={14}/>View all</button>
          </div>
          {expenses.data.slice(0,5).map(e=>{
            const CatIcon=({Seeds:'🌱',Fertilizer:'🧪',Pesticides:'🛡️',Labor:'👷',Irrigation:'💧',Equipment:'🚜',Transport:'🚛',Other:'📦'})[e.cat]||'📦';
            return(
              <div className="list-item" key={e.id} style={{marginBottom:7}}>
                <div className="list-icon" style={{background:(CROP_COLORS[e.crop]||'#888')+'15',fontSize:16}}>{CatIcon}</div>
                <div className="list-body">
                  <div className="list-title">{e.desc||e.cat}</div>
                  <div className="list-sub"><span className="tag tag-green">{e.cat}</span><span className="tag tag-amber">{e.crop}</span></div>
                </div>
                <div className="list-amount" style={{color:'var(--red)'}}>{fmt(e.amount)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
