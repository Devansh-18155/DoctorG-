import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Store,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Search,
  Upload,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Building2,
  Check,
  AlertCircle,
  Pill,
  FileText,
} from 'lucide-react';

export const MedicalShopDashboard: React.FC = () => {
  const { loginAsPatient, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'prescriptions' | 'inventory' | 'profile' | 'subscription'>('prescriptions');

  // Simulated pharmacy orders state
  const [orders, setOrders] = useState([
    {
      id: 'RX-ORD-401',
      patientName: 'Aarav Gupta',
      phone: '+91 98765 43210',
      prescriptionUrl: 'https://doctorg.in/prescriptions/rx-sample-401.jpg',
      medicines: 'Paracetamol 650mg, Azithromycin 500mg, Pantoprazole 40mg',
      deliveryType: 'HOME_DELIVERY',
      address: 'House 14, Sector B, Indrapuri, Bhopal',
      date: 'Today',
      time: '11:15 AM',
      amount: 420,
      status: 'PENDING',
    },
    {
      id: 'RX-ORD-402',
      patientName: 'Sunita Varma',
      phone: '+91 98112 33445',
      prescriptionUrl: 'https://doctorg.in/prescriptions/rx-sample-402.jpg',
      medicines: 'Metformin 500mg, Telmisartan 40mg, Atorvastatin 10mg',
      deliveryType: 'STORE_PICKUP',
      address: 'Counter Pickup',
      date: 'Today',
      time: '12:30 PM',
      amount: 680,
      status: 'DISPATCHED',
    },
  ]);

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    showToast(`Order ${orderId} marked as ${newStatus}`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white">
              Apollo Pharmacy & Medical Store
            </h1>
            <p className="text-xs text-slate-400">
              Pharmacy & Retail Medical Store Portal • Bhopal Center
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loginAsPatient(false)}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            Switch to Patient App
          </button>
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Licensed Pharmacy ✓
          </span>
        </div>
      </header>

      {/* Tabs Bar */}
      <div className="bg-slate-950/60 border-b border-slate-800 px-6 flex gap-2">
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'prescriptions'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" /> Prescription Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'inventory'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Pill className="w-4 h-4" /> Fast-Moving Inventory
        </button>
        <button
          onClick={() => setActiveTab('subscription')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'subscription'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" /> Subscription & Payouts
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-6">
        {activeTab === 'prescriptions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-white">Live Medicine Orders</h2>
                <p className="text-xs text-slate-400">Prescription verification & doorstep delivery dispatch</p>
              </div>
              <span className="text-xs font-bold bg-slate-800 text-slate-300 px-3 py-1 rounded-lg">
                2 Pending Dispense
              </span>
            </div>

            <div className="grid gap-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 hover:border-slate-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                        {ord.id}
                      </span>
                      <span className="text-sm font-extrabold text-white">{ord.patientName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ord.deliveryType === 'HOME_DELIVERY'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {ord.deliveryType === 'HOME_DELIVERY' ? 'Doorstep Delivery' : 'Store Pickup'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      <strong>Prescribed:</strong> {ord.medicines}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <a href={`tel:${ord.phone}`} className="hover:text-emerald-400">
                          {ord.phone}
                        </a>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {ord.date} • {ord.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {ord.address}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-700">
                    <div className="text-right">
                      <span className="text-base font-black text-white">₹{ord.amount}</span>
                      <span className="block text-[10px] font-bold text-slate-400">Paid Online</span>
                    </div>

                    <div className="flex gap-2">
                      {ord.status === 'PENDING' ? (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'DISPATCHED')}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Dispatch
                        </button>
                      ) : (
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold">
                          ✓ Dispatched
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-white">Essential Stock Tracking</h3>
            <p className="text-xs text-slate-400">Track life-saving medicine availability synced with nearby Doctor G patients</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Insulin Glargine 100IU', stock: '28 vials', status: 'IN_STOCK' },
                { name: 'Amoxicillin + Clavulanate 625mg', stock: '140 strips', status: 'IN_STOCK' },
                { name: 'Paracetamol 650mg Tabs', stock: '520 strips', status: 'IN_STOCK' },
                { name: 'ORS Packets WHO Formula', stock: '350 packs', status: 'IN_STOCK' },
                { name: 'Salbutamol Inhaler 100mcg', stock: '15 units', status: 'LOW_STOCK' },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
                  <h4 className="font-bold text-xs text-white">{item.name}</h4>
                  <div className="flex items-center justify-between mt-2 text-[11px]">
                    <span className="text-slate-400">{item.stock}</span>
                    <span className={item.status === 'LOW_STOCK' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {item.status === 'LOW_STOCK' ? 'Low Stock' : 'Available'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-white">Monthly Subscription Plan</h3>
            <p className="text-xs text-slate-400">Doctor G Verified Pharmacy Partner Tier</p>
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Active Partner Plan</span>
                <h4 className="text-base font-black text-white mt-0.5">Doctor G Pharmacy Network (₹1,499 / mo)</h4>
                <p className="text-xs text-slate-300 mt-1">Direct e-prescription routing within 5km delivery radius</p>
              </div>
              <span className="text-xs font-extrabold text-emerald-300 bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-500/30">
                Auto-Renew Active
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
