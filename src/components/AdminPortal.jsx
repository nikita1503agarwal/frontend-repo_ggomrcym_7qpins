import { useEffect, useState } from 'react'
import { apiGet, apiPost, apiPut, apiPatch } from './api'

const badge = (text, color) => (
  <span className={`px-2 py-1 rounded text-xs font-semibold bg-${color}-500/20 text-${color}-200 border border-${color}-500/20`}>{text}</span>
)

const statusColors = {
  received: 'green',
  in_production: 'orange',
  ready_for_collection: 'red'
}

const productLabels = {
  suxhuk: 'Suxhuk',
  mish_te_teren: 'Mish te teren',
}

function InventoryTab() {
  const [items, setItems] = useState([])

  const load = async () => {
    const data = await apiGet('/inventory')
    setItems(data)
  }

  useEffect(()=>{ load() }, [])

  const updateItem = async (item, changes) => {
    const payload = { ...item, ...changes }
    await apiPost('/inventory', payload)
    await load()
  }

  return (
    <div className="space-y-4">
      {items.map(item => (
        <div key={item.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-white font-semibold">{productLabels[item.product]}</div>
              <div className="text-blue-200 text-sm">${item.price_per_kg} per kg</div>
              <div className="text-blue-200 text-sm">Min {item.min_kg}kg, step {item.step_kg}kg</div>
              <div className="text-blue-200 text-sm">Available: {item.available_kg} kg</div>
            </div>
            <div className="space-x-2">
              <button className="btn-secondary" onClick={()=>updateItem(item, { available_kg: item.available_kg + 1 })}>+1kg</button>
              <button className="btn-secondary" onClick={()=>updateItem(item, { available_kg: item.available_kg - 1 })}>-1kg</button>
              <button className="btn-secondary" onClick={()=>updateItem(item, { price_per_kg: item.price_per_kg + 1 })}>+$1</button>
              <button className="btn-secondary" onClick={()=>updateItem(item, { price_per_kg: item.price_per_kg - 1 })}>-$1</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ClientsTab() {
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })

  const load = async () => {
    const data = await apiGet('/customers')
    setCustomers(data)
  }
  useEffect(()=>{ load() }, [])

  const save = async () => {
    await apiPost('/customers', form)
    setForm({ name: '', email: '', phone: '', address: '' })
    await load()
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          <input className="input" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
          <input className="input" placeholder="Address" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} />
          <button className="btn-primary" onClick={save}>Add / Update</button>
        </div>
      </div>

      <div className="grid gap-3">
        {customers.map(c => (
          <div key={c.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex justify-between">
              <div>
                <div className="text-white font-semibold">{c.name}</div>
                <div className="text-blue-200 text-sm">{c.email} • {c.phone}</div>
                <div className="text-blue-200 text-sm">{c.address}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OrdersTab() {
  const [orders, setOrders] = useState([])

  const load = async () => {
    const data = await apiGet('/orders')
    setOrders(data)
  }
  useEffect(()=>{ load() }, [])

  const setStatus = async (id, status) => {
    const updated = await apiPatch(`/orders/${id}/status`, { status })
    await load()
  }

  return (
    <div className="space-y-3">
      {orders.map(o => (
        <div key={o.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">{productLabels[o.product]} • {o.quantity_kg} kg • ${o.total_price_nzd}</div>
              <div className="text-blue-200 text-sm">Order for customer {o.customer_id} • {new Date(o.created_at).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2">
              {badge(o.status.replaceAll('_',' '), statusColors[o.status])}
              <button className="btn-secondary" onClick={()=>setStatus(o.id, 'received')}>Green</button>
              <button className="btn-secondary" onClick={()=>setStatus(o.id, 'in_production')}>Orange</button>
              <button className="btn-secondary" onClick={()=>setStatus(o.id, 'ready_for_collection')}>Red</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminPortal() {
  const [tab, setTab] = useState('inventory')

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button onClick={()=>setTab('inventory')} className={`tab ${tab==='inventory'?'tab-active':''}`}>Inventory</button>
        <button onClick={()=>setTab('clients')} className={`tab ${tab==='clients'?'tab-active':''}`}>Clients</button>
        <button onClick={()=>setTab('orders')} className={`tab ${tab==='orders'?'tab-active':''}`}>Orders</button>
      </div>

      {tab==='inventory' && <InventoryTab />}
      {tab==='clients' && <ClientsTab />}
      {tab==='orders' && <OrdersTab />}
    </div>
  )
}
