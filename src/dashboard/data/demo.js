import { CROP_COLORS } from './constants';
const ago = n => { const d=new Date(); d.setDate(d.getDate()-n); return d.toISOString().split('T')[0]; };
const fwd = n => { const d=new Date(); d.setDate(d.getDate()+n); return d.toISOString().split('T')[0]; };
let _id=1000; const uid=()=>++_id;

export const DEMO = {
  fields:[
    {id:1,name:'North Field',acres:3.5,crop:'Rice',soil:'Alluvial',sow:ago(45),harv:fwd(60),notes:'Main rice field near canal.',color:CROP_COLORS.Rice},
    {id:2,name:'South Plot',acres:2.0,crop:'Wheat',soil:'Black Cotton',sow:ago(30),harv:fwd(90),notes:'Good yield last season.',color:CROP_COLORS.Wheat},
    {id:3,name:'East Block',acres:1.5,crop:'Cotton',soil:'Black Cotton',sow:ago(90),harv:fwd(20),notes:'Almost ready for harvest.',color:CROP_COLORS.Cotton},
    {id:4,name:'West Plot',acres:1.0,crop:'Groundnut',soil:'Sandy Loam',sow:ago(60),harv:fwd(30),notes:'Good rainfall this season.',color:CROP_COLORS.Groundnut},
  ],
  expenses:[
    {id:uid(),date:ago(2),cat:'Seeds',crop:'Rice',field:'North Field',amount:4500,desc:'HYV Seeds 30kg',pay:'Cash'},
    {id:uid(),date:ago(4),cat:'Fertilizer',crop:'Wheat',field:'South Plot',amount:3200,desc:'Urea 50kg bag',pay:'UPI'},
    {id:uid(),date:ago(6),cat:'Labor',crop:'Cotton',field:'East Block',amount:2800,desc:'Field prep — 5 persons',pay:'Cash'},
    {id:uid(),date:ago(8),cat:'Pesticides',crop:'Rice',field:'North Field',amount:1600,desc:'Stem borer spray',pay:'Cash'},
    {id:uid(),date:ago(12),cat:'Irrigation',crop:'Wheat',field:'South Plot',amount:900,desc:'Diesel for pump',pay:'Cash'},
    {id:uid(),date:ago(15),cat:'Equipment',crop:'Rice',field:'North Field',amount:5500,desc:'Tractor rental',pay:'Bank Transfer'},
    {id:uid(),date:ago(20),cat:'Fertilizer',crop:'Cotton',field:'East Block',amount:2100,desc:'DAP fertilizer 25kg',pay:'UPI'},
    {id:uid(),date:ago(25),cat:'Transport',crop:'Wheat',field:'South Plot',amount:1200,desc:'Market transport',pay:'Cash'},
    {id:uid(),date:ago(32),cat:'Seeds',crop:'Groundnut',field:'West Plot',amount:3800,desc:'Groundnut seeds 20kg',pay:'Cash'},
    {id:uid(),date:ago(45),cat:'Labor',crop:'Rice',field:'North Field',amount:4200,desc:'Transplanting labor',pay:'Cash'},
    {id:uid(),date:ago(55),cat:'Fertilizer',crop:'Maize',field:'West Plot',amount:2600,desc:'Potash fertilizer',pay:'UPI'},
    {id:uid(),date:ago(65),cat:'Pesticides',crop:'Cotton',field:'East Block',amount:1900,desc:'Bollworm spray',pay:'Cash'},
  ],
  yields:[
    {id:uid(),crop:'Rice',field:'North Field',kg:1200,price:22,date:ago(3),revenue:26400,buyer:'APMC Vijayawada'},
    {id:uid(),crop:'Wheat',field:'South Plot',kg:900,price:28,date:ago(10),revenue:25200,buyer:'Local Trader'},
    {id:uid(),crop:'Cotton',field:'East Block',kg:450,price:65,date:ago(18),revenue:29250,buyer:'Ginning Mill'},
    {id:uid(),crop:'Groundnut',field:'West Plot',kg:600,price:48,date:ago(30),revenue:28800,buyer:'APMC Guntur'},
  ],
  loans:[
    {id:1,name:'Kisan Credit Card',source:'SBI Bank',principal:150000,interest:7,months:12,start:ago(180),purpose:'Crop Loan',paid:75000,nextDue:fwd(8)},
    {id:2,name:'Equipment Loan',source:'Andhra Bank',principal:80000,interest:9,months:24,start:ago(365),purpose:'Equipment Purchase',paid:40000,nextDue:fwd(15)},
    {id:3,name:'NABARD Crop Loan',source:'NABARD',principal:50000,interest:4,months:6,start:ago(60),purpose:'Crop Loan',paid:20000,nextDue:fwd(22)},
  ],
  diary:[
    {id:uid(),date:ago(1),crop:'Rice',weather:'Sunny',stage:'Vegetative',work:'Applied nitrogen fertilizer to North Field. Checked irrigation channels.',prob:'Yellowing in north corner — possible iron deficiency.'},
    {id:uid(),date:ago(3),crop:'Wheat',weather:'Partly Cloudy',stage:'Germination',work:'Watered seedbed in South Plot. Removed weeds along borders.',prob:''},
    {id:uid(),date:ago(6),crop:'Cotton',weather:'Sunny',stage:'Flowering',work:'Applied spray for aphids on East Block. Thinned overcrowded plants.',prob:'Aphid presence detected and treated.'},
    {id:uid(),date:ago(10),crop:'All Fields',weather:'Rainy',stage:'Vegetative',work:'No field work. Inspected drainage channels.',prob:'Waterlogging in West Plot — fix drain before next rain.'},
  ],
  tasks:[
    {id:uid(),title:'Apply 2nd dose fertilizer — Rice (North Field)',date:fwd(2),pri:'High',cat:'Fertilizer',done:false},
    {id:uid(),title:'Cotton harvest prep — East Block',date:fwd(5),pri:'High',cat:'Harvest',done:false},
    {id:uid(),title:'SBI KCC EMI due',date:fwd(8),pri:'High',cat:'Loan EMI',done:false},
    {id:uid(),title:'Soil test — South Plot',date:fwd(9),pri:'Medium',cat:'Soil Test',done:false},
    {id:uid(),title:'Irrigation pump maintenance',date:fwd(12),pri:'Low',cat:'Irrigation',done:false},
  ],
};
