import CustomerPortal from './components/CustomerPortal'
import AdminPortal from './components/AdminPortal'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-blue-100">
      <div className="max-w-5xl mx-auto p-6">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" alt="Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-bold text-white">Suxhuk Orders</h1>
          </div>
          <nav className="flex gap-3">
            <a className="btn-secondary" href="#customer">Customer</a>
            <a className="btn-secondary" href="#admin">Admin</a>
          </nav>
        </header>

        <section id="customer" className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Customer Portal</h2>
          <CustomerPortal />
        </section>

        <section id="admin" className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Admin Portal</h2>
          <AdminPortal />
        </section>

        <footer className="text-center text-blue-300/60 text-sm">
          Prices: Suxhuk $50/kg (min 1kg). Mish te teren $65/kg (min 3kg). Orders in kg increments.
        </footer>
      </div>
    </div>
  )
}

export default App
