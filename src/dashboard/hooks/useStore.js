import { useState, useCallback, useEffect, useRef } from 'react'
import { DEMO } from '../data/demo'

const API = 'http://localhost:5000/api/dashboard'

function getToken() {
  return localStorage.getItem('croporia_token') || ''
}

// Debounce helper — saves to DB 1.5s after last change
function useDebounce(fn, delay) {
  const timer = useRef(null)
  return useCallback((...args) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => fn(...args), delay)
  }, [fn, delay])
}

function useSlice(key, initial) {
  const [data, setData] = useState(initial)
  const set = useCallback(upd => {
    setData(prev => typeof upd === 'function' ? upd(prev) : upd)
  }, [])
  const add = useCallback(item => set(p => [item, ...p]), [set])
  const remove = useCallback(id => set(p => p.filter(x => x.id !== id)), [set])
  const update = useCallback((id, patch) => set(p => p.map(x => x.id === id ? { ...x, ...patch } : x)), [set])
  return { data, set, add, remove, update }
}

export function useStore() {
  const [loaded, setLoaded] = useState(false)

  const fields = useSlice('fields', DEMO.fields)
  const expenses = useSlice('expenses', DEMO.expenses)
  const yields = useSlice('yields', DEMO.yields)
  const loans = useSlice('loans', DEMO.loans)
  const diary = useSlice('diary', DEMO.diary)
  const tasks = useSlice('tasks', DEMO.tasks)

  // Load from MongoDB on mount
  useEffect(() => {
    const token = getToken()
    if (!token) { setLoaded(true); return }
    fetch(API, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(doc => {
        if (doc.fields?.length)   fields.set(doc.fields)
        if (doc.expenses?.length) expenses.set(doc.expenses)
        if (doc.yields?.length)   yields.set(doc.yields)
        if (doc.loans?.length)    loans.set(doc.loans)
        if (doc.diary?.length)    diary.set(doc.diary)
        if (doc.tasks?.length)    tasks.set(doc.tasks)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, []) // eslint-disable-line

  // Save to MongoDB whenever any slice changes (debounced)
  const saveToDb = useCallback((data) => {
    const token = getToken()
    if (!token) return
    fetch(API, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }).catch(() => {})
  }, [])

  const debouncedSave = useDebounce(saveToDb, 1500)

  useEffect(() => {
    if (!loaded) return
    debouncedSave({ fields: fields.data, expenses: expenses.data, yields: yields.data, loans: loans.data, diary: diary.data, tasks: tasks.data })
  }, [fields.data, expenses.data, yields.data, loans.data, diary.data, tasks.data, loaded]) // eslint-disable-line

  return { fields, expenses, yields, loans, diary, tasks, loaded }
}
