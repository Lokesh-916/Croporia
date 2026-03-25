import React,{useRef,useEffect} from 'react';
import{Chart,registerables} from 'chart.js';
Chart.register(...registerables);

export default function ChartBox({config,height='200px'}){
  const ref=useRef(); const inst=useRef();
  useEffect(()=>{
    if(!ref.current)return;
    if(inst.current){inst.current.destroy();inst.current=null;}
    inst.current=new Chart(ref.current,config);
    return()=>{if(inst.current){inst.current.destroy();inst.current=null;}};
  },[JSON.stringify(config)]); // eslint-disable-line
  return<div style={{position:'relative',width:'100%',height}}><canvas ref={ref}/></div>;
}
