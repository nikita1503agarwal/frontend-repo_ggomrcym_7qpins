import { useEffect, useState } from 'react'
import { apiGet, apiPost, apiPut, apiPatch } from './api'

const productLabels = {
  suxhuk: 'Suxhuk',
  mish_te_teren: 'Mish te teren',
}

function Profile({ customer, setCustomer }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
      })
    }
  }, [customer])

  const submit = async (e) => {
    e.preventDefault()
    const data = await apiPost('/customers', form)
    setCustomer(data)
    alert('Profile saved')
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="input" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input className="input" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <input className="input" placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
      </div>
      <button className="btn-primary" type="submit">Save Profile</button>
    </form>
  )
}

function OrderTab({ customer }) {
  const [inventory, setInventory] = useState([])
  const [product, setProduct] = useState('suxhuk')
  const [qty, setQty] = useState(1)
  const [note, setNote] = useState('')

  const loadInventory = async () => {
    const data = await apiGet('/inventory')
    setInventory(data)
  }

  useEffect(() => { loadInventory() }, [])

  useEffect(() => {
    const item = inventory.find(i => i.product === product)
    if (item) {
      const min = item.min_kg
      setQty(min)
    }
  }, [product, inventory])

  const currentItem = inventory.find(i => i.product === product)

  const placeOrder = async () => {
    if (!customer) return alert('Please save your profile first')
    const data = await apiPost('/orders', {
      customer_id: customer.id,
      product,
      quantity_kg: qty,
      notes: note || undefined,
    })
    alert(`Order placed: ${productLabels[data.product]} - ${data.quantity_kg} kg - $${data.total_price_nzd}`)
    await loadInventory()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setProduct('suxhuk')} className={`tab ${product==='suxhuk'?'tab-active':''}`}>Suxhuk</button>
        <button onClick={() => setProduct('mish_te_teren')} className={`tab ${product==='mish_te_teren'?'tab-active':''}`}>Mish te teren</button>
      </div>

      {currentItem && (
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex justify-between">
            <div>
              <div className="text-white font-semibold">{productLabels[currentItem.product]}</div>
              <div className="text-blue-200 text-sm">${currentItem.price_per_kg} per kg</div>
              <div className="text-blue-200 text-sm">Min {currentItem.min_kg}kg, increments of {currentItem.step_kg}kg</div>
              <div className="text-blue-200 text-sm">Available: {currentItem.available_kg} kg (can go negative for preorders)</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div>
              <label className="label">Quantity (kg)</label>
              <input type="number" min={currentItem.min_kg} step={currentItem.step_kg} value={qty} onChange={e=>setQty(parseInt(e.target.value||currentItem.min_kg))} className="input" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Notes (optional)</label>
              <input value={note} onChange={e=>setNote(e.target.value)} className="input" placeholder="Any special notes" />
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-blue-200">Total: <span className="text-white font-semibold">${currentItem ? (currentItem.price_per_kg * qty).toFixed(2) : '0.00'}</span></div>
            <button className="btn-primary" onClick={placeOrder}>Place Order</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CustomerPortal() {
  const [tab, setTab] = useState('order')
  const [customer, setCustomer] = useState(null)

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button onClick={()=>setTab('order')} className={`tab ${tab==='order'?'tab-active':''}`}>Order</button>
        <button onClick={()=>setTab('profile')} className={`tab ${tab==='profile'?'tab-active':''}`}>Profile</button>
      </div>

      {tab==='profile' ? (
        <Profile customer={customer} setCustomer={setCustomer} />
      ) : (
        <OrderTab customer={customer} />
      )}
    </div>
  )
}
