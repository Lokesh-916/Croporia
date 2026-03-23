import React,{useState,useMemo} from 'react';
import Layout from './components/Layout';
import Dashboard   from './pages/Dashboard';
import FieldsPage  from './pages/FieldsPage';
import YieldsPage  from './pages/YieldsPage';
import DiaryPage   from './pages/DiaryPage';
import ExpensesPage from './pages/ExpensesPage';
import LoansPage   from './pages/LoansPage';
import ReportsPage from './pages/ReportsPage';
import TasksPage   from './pages/TasksPage';
import{useStore}   from './hooks/useStore';

const PAGES={
  dashboard: Dashboard,
  fields:    FieldsPage,
  yields:    YieldsPage,
  diary:     DiaryPage,
  expenses:  ExpensesPage,
  loans:     LoansPage,
  reports:   ReportsPage,
  tasks:     TasksPage,
};

export default function App(){
  const store=useStore();
  const[page,setPage]=useState('dashboard');
  const pendingTasks=useMemo(()=>store.tasks.data.filter(t=>!t.done).length,[store.tasks.data]);
  const overdueCount=useMemo(()=>store.tasks.data.filter(t=>!t.done&&new Date(t.date)<new Date()).length,[store.tasks.data]);
  const PageComponent=PAGES[page]||Dashboard;

  return(
    <Layout page={page} onNav={setPage} pendingTasks={pendingTasks} overdueCount={overdueCount}>
      <PageComponent store={store} onNav={setPage}/>
    </Layout>
  );
}
