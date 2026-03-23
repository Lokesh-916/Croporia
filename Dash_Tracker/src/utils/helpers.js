export const fmt    = n => '₹'+(Math.round(n)||0).toLocaleString('en-IN');
export const fmtK   = n => n>=100000?'₹'+(n/100000).toFixed(1)+'L':n>=1000?'₹'+(n/1000).toFixed(1)+'K':fmt(n);
export const sum    = (arr,fn) => arr.reduce((s,x)=>s+(Number(fn(x))||0),0);
export const uid    = () => Date.now()+Math.floor(Math.random()*1000);
export const today  = () => new Date().toISOString().split('T')[0];
export const fmtD   = s => s?new Date(s).toLocaleDateString('en-IN',{day:'numeric',month:'short'}):'–';
export const daysFrom = s => s?Math.ceil((new Date(s)-new Date())/86400000):null;
export const isOverdue = s => s&&new Date(s)<new Date();
export const lastNMonths = (n=7)=>{
  const out=[];
  for(let i=n-1;i>=0;i--){
    const d=new Date(); d.setMonth(d.getMonth()-i);
    out.push(d.toLocaleDateString('en-IN',{month:'short'}));
  }
  return out;
};
export const calcEMI = (p,r,n)=>{
  const m=r/100/12;
  if(m===0)return Math.round(p/n);
  return Math.round((p*m*Math.pow(1+m,n))/(Math.pow(1+m,n)-1));
};
