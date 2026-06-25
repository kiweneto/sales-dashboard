import React, { useState, useEffect, useMemo } from 'react'

const STORAGE_KEY = 'sales_dash_v1'
const PRODUCTS = ['Laptops', 'Phones', 'Accessories', 'IT Services', 'Web Projects']

const seed = [
  { id: 1, product: 'Laptops', qty: 3, price: 450000, date: '2026-06-01' },
  { id: 2, product: 'IT Services', qty: 5, price: 60000, date: '2026-06-08' },
  { id: 3, product: 'Web Projects', qty: 2, price: 250000, date: '2026-06-15' },
  { id: 4, product: 'Accessories', qty: 12, price: 15000, date: '2026-06-20' },
]

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : seed
  } catch { return seed }
}

const naira = (n) => '₦' + n.toLocaleString('en-NG')

export default function App() {
  const [rows, setRows] = useState(load)
  const [form, setForm] = useState({ product: PRODUCTS[0], qty: '', price: '', date: '' })

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(rows)) }, [rows])

  const add = (e) => {
    e.preventDefault()
    const qty = parseInt(form.qty, 10), price = parseFloat(form.price)
    if (!qty || !price) return
    setRows([{ id: Date.now(), product: form.product, qty, price, date: form.date || new Date().toISOString().slice(0, 10) }, ...rows])
    setForm({ product: PRODUCTS[0], qty: '', price: '', date: '' })
  }

  const del = (id) => setRows(rows.filter(r => r.id !== id))

  const totals = useMemo(() => {
    const revenue = rows.reduce((s, r) => s + r.qty * r.price, 0)
    const units = rows.reduce((s, r) => s + r.qty, 0)
    return { revenue, units, orders: rows.length, avg: rows.length ? Math.round(revenue / rows.length) : 0 }
  }, [rows])

  const byProduct = useMemo(() => {
    const map = {}
    rows.forEach(r => { map[r.product] = (map[r.product] || 0) + r.qty * r.price })
    return PRODUCTS.map(p => ({ product: p, value: map[p] || 0 }))
  }, [rows])

  const max = Math.max(1, ...byProduct.map(b => b.value))

  return (
    <div className="app">
      <header className="top">
        <div className="logo">📊</div>
        <h1>Sales Data Dashboard</h1>
      </header>
      <p className="tagline">
        Record sales and watch them roll up into live totals and a revenue-by-product chart.
        It is a web version of the Python automation I built to track sales data. Saves to your browser.
      </p>

      <div className="cards">
        <div className="kpi"><div className="n acc">{naira(totals.revenue)}</div><div className="l">Total revenue</div></div>
        <div className="kpi"><div className="n">{totals.units}</div><div className="l">Units sold</div></div>
        <div className="kpi"><div className="n">{totals.orders}</div><div className="l">Records</div></div>
        <div className="kpi"><div className="n grn">{naira(totals.avg)}</div><div className="l">Avg / record</div></div>
      </div>

      <div className="layout">
        <form className="panel" onSubmit={add}>
          <h2>Record a sale</h2>
          <label>Product / Category</label>
          <select value={form.product} onChange={e => setForm({ ...form, product: e.target.value })}>
            {PRODUCTS.map(p => <option key={p}>{p}</option>)}
          </select>
          <label>Quantity</label>
          <input type="number" min="1" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} placeholder="e.g. 3" />
          <label>Unit price (₦)</label>
          <input type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g. 450000" />
          <label>Date</label>
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          <button className="add" type="submit">+ Add record</button>
        </form>

        <div className="panel">
          <h2>Revenue by product</h2>
          <div className="chart">
            {byProduct.map(b => (
              <div className="bar-wrap" key={b.product}>
                <span className="bar-val">{b.value ? '₦' + Math.round(b.value / 1000) + 'k' : ''}</span>
                <div className="bar" style={{ height: (b.value / max * 100) + '%' }} />
                <span className="bar-label">{b.product.split(' ')[0]}</span>
              </div>
            ))}
          </div>

          <div className="section-title">Records</div>
          {rows.length === 0 ? <div className="empty">No records yet. Add one on the left.</div> : (
            <table>
              <thead>
                <tr><th>Product</th><th className="right">Qty</th><th className="right">Unit ₦</th><th className="right">Total</th><th>Date</th><th></th></tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id}>
                    <td>{r.product}</td>
                    <td className="right">{r.qty}</td>
                    <td className="right">{r.price.toLocaleString('en-NG')}</td>
                    <td className="right">{naira(r.qty * r.price)}</td>
                    <td>{r.date}</td>
                    <td className="right"><button className="del" onClick={() => del(r.id)}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
