import React from 'react';
import ChartBox from '../components/ChartBox';
import{fmt,fmtK,sum,lastNMonths} from '../utils/helpers';
import{CROP_COLORS} from '../data/constants';
import{IconReport,IconLeaf,IconExpense,IconHarvest} from '../icons/Icons';

export default function ReportsPage({store}){
  const{fields,expenses,yields}=store;
  const totalExp=sum(expenses.data,e=>e.amount);
  const totalRev=sum(yields.data,y=>y.revenue);
  const profit=totalRev-totalExp;
  const roi=totalExp>0?Math.round(profit/totalExp*100):0;
  const months=lastNMonths(8);
  const profArr=[-3000,7000,5000,17000,9000,12000,8000,profit];
  const byCat=expenses.data.reduce((a,e)=>{a[e.cat]=(a[e.cat]||0)+Number(e.amount);return a;},{});
  const cats=Object.keys(byCat);
  const allCrops=[...new Set([...yields.data.map(y=>y.crop),...expenses.data.map(e=>e.crop)])];

  const trendChart={type:'line',data:{labels:months,datasets:[{label:'P&L',data:profArr,borderColor:'#5A7863',backgroundColor:'rgba(90,120,99,.12)',tension:.4,fill:true,pointBackgroundColor:'#5A7863',pointRadius:4,pointHoverRadius:6}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{ticks:{callback:v=>'₹'+Math.round(v/1000)+'k',font:{size:10}},grid:{color:'rgba(0,0,0,.04)'}},x:{grid:{display:false},ticks:{font:{size:10}}}}}};
  const brkChart={type:'bar',data:{labels:cats,datasets:[{data:cats.map(c=>byCat[c]),backgroundColor:['#5A7863','#c07a12','#c0392b','#7c3aed','#0891b2','#ea580c','#2563eb','#6b7280'],borderRadius:6,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{ticks:{callback:v=>'₹'+Math.round(v/1000)+'k',font:{size:10}},grid:{color:'rgba(0,0,0,.04)'}},x:{grid:{display:false},ticks:{maxRotation:35,font:{size:10}}}}}};
  const cropChart={type:'bar',data:{labels:allCrops,datasets:[{label:'Revenue',data:allCrops.map(c=>sum(yields.data.filter(y=>y.crop===c),y=>y.revenue)),backgroundColor:'rgba(90,120,99,.75)',borderRadius:5,borderSkipped:false},{label:'Expense',data:allCrops.map(c=>sum(expenses.data.filter(e=>e.crop===c),e=>e.amount)),backgroundColor:'rgba(192,57,43,.65)',borderRadius:5,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{ticks:{callback:v=>'₹'+Math.round(v/1000)+'k',font:{size:10}},grid:{color:'rgba(0,0,0,.04)'}},x:{grid:{display:false}}}}};

  return(
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left"><h2>Reports &amp; Analytics</h2><p>Full financial overview, crop performance and ROI analysis</p></div>
      </div>

      <div className="metrics-grid mg-4" style={{marginBottom:24}}>
        <div className="metric-card"><div className="metric-icon"><IconHarvest size={18}/></div><div className="metric-value">{fmtK(totalRev)}</div><div className="metric-label">Total Revenue</div></div>
        <div className="metric-card red"><div className="metric-icon"><IconExpense size={18}/></div><div className="metric-value">{fmtK(totalExp)}</div><div className="metric-label">Total Expenses</div></div>
        <div className={`metric-card${profit<0?' red':''}`}><div className="metric-icon"><IconLeaf size={18}/></div><div className="metric-value" style={{color:profit>=0?'var(--c3)':'var(--red)'}}>{profit>=0?'+':''}{fmtK(profit)}</div><div className="metric-label">Net Profit</div></div>
        <div className={`metric-card${roi<0?' red':''}`}><div className="metric-icon"><IconReport size={18}/></div><div className="metric-value" style={{color:roi>=0?'var(--c3)':'var(--red)'}}>{roi}%</div><div className="metric-label">ROI</div></div>
      </div>

      <div className="two-panel" style={{marginBottom:20}}>
        <div className="card card-pad">
          <div className="card-title">Monthly P&amp;L Trend</div>
          <ChartBox config={trendChart} height="200px"/>
        </div>
        <div className="card card-pad">
          <div className="card-title">Expense Breakdown</div>
          <ChartBox config={brkChart} height="200px"/>
        </div>
      </div>

      <div className="two-panel" style={{marginBottom:20}}>
        <div className="card card-pad">
          <div className="card-title">Crop-wise Revenue vs Expense</div>
          <ChartBox config={cropChart} height="220px"/>
        </div>
        <div className="card card-pad">
          <div className="card-title">Field Performance</div>
          <div style={{paddingTop:8}}>
            {fields.data.map(f=>{
              const fe=sum(expenses.data.filter(e=>e.field===f.name),e=>e.amount);
              const fr=sum(yields.data.filter(y=>y.field===f.name),y=>y.revenue);
              const fp=fr-fe;
              const pct=fe>0?Math.min(100,Math.round(fr/fe*100)):0;
              return(
                <div key={f.id} style={{marginBottom:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:8,height:8,borderRadius:'50%',background:f.color}}/>
                      <span style={{fontSize:13,fontWeight:600}}>{f.name}</span>
                      <span className="tag" style={{background:f.color+'18',color:f.color,fontSize:10}}>{f.crop}</span>
                    </div>
                    <span style={{fontFamily:"'Fraunces',serif",fontSize:13,fontWeight:700,color:fp>=0?'var(--c3)':'var(--red)'}}>{fp>=0?'+':''}{fmt(fp)}</span>
                  </div>
                  <div className="pbar"><div className="pfill" style={{width:`${pct}%`,background:f.color}}/></div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'var(--text4)',marginTop:3}}>
                    <span>Exp: {fmt(fe)}</span><span>Rev: {fmt(fr)}</span>
                  </div>
                </div>
              );
            })}
            {fields.data.length===0&&<div style={{textAlign:'center',color:'var(--text4)',padding:'30px 0',fontSize:13}}>Add fields to see performance</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
