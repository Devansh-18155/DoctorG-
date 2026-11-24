import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  Search,
  ShoppingCart,
  Upload,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  FileText,
  Clock,
  Truck,
  ShieldCheck,
  Star,
  Camera,
  X,
  CreditCard,
  Building2,
  ArrowRight,
  Package,
} from 'lucide-react';
import { MEDICINE_PRODUCTS } from '../../data/mockData';
import { MedicineProduct, CartItem, MedicineOrder } from '../../types';
import { VoiceSearchInput } from '../../components/common/VoiceSearchInput';

export const MedicalStoreScreen: React.FC = () => {
  const {
    goBack,
    navigateTo,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    placeMedicineOrder,
    medicineOrders,
    savedAddresses,
    user,
    requireAuth,
    showToast,
  } = useApp();

  const [viewMode, setViewMode] = useState<'store' | 'product-detail' | 'cart' | 'checkout' | 'order-success' | 'tracking'>('store');
  const [selectedProduct, setSelectedProduct] = useState<MedicineProduct>(MEDICINE_PRODUCTS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Prescription Upload Modal
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [rxUploaded, setRxUploaded] = useState(false);
  const [rxFileName, setRxFileName] = useState('');

  // Active Order for tracking
  const [activeOrder, setActiveOrder] = useState<MedicineOrder | null>(
    medicineOrders[0] || null
  );

  const categories = [
    'All',
    'Medicines',
    'Personal care',
    'Medical devices',
    'First aid',
    'Vitamins',
    'Healthcare products',
  ];

  const filteredProducts = MEDICINE_PRODUCTS.filter((prod) => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.composition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = cartSubtotal > 500 ? 0 : 40;
  const cartGrandTotal = cartSubtotal + deliveryFee;

  // Handle Prescription upload simulation
  const handleUploadRx = () => {
    setRxUploaded(true);
    setRxFileName('Prescription_Dr_Arindam_Nov2026.pdf');
    setIsRxModalOpen(false);
    showToast('Prescription uploaded successfully. Pharmacist will review.', 'success');
  };

  // Checkout Execution
  const handlePlaceOrder = () => {
    requireAuth(() => {
      const newOrder = placeMedicineOrder({
        items: [...cart],
        subtotal: cartSubtotal,
        deliveryFee,
        total: cartGrandTotal,
        deliveryAddress: savedAddresses[0]?.flat + ', ' + savedAddresses[0]?.street + ', ' + savedAddresses[0]?.city,
        deliveryContact: user?.phone || '+91 98301 54321',
        prescriptionUploaded: rxUploaded,
        prescriptionUrl: rxUploaded ? '#' : undefined,
        paymentMethod: 'UPI / Online Payment',
        status: 'PLACED',
        estimatedDelivery: 'Tomorrow, by 1:00 PM',
      });
      setActiveOrder(newOrder);
      setViewMode('order-success');
    }, 'Sign in to complete your pharmacy order');
  };

  return (
    <div className="min-h-full pb-20 bg-[#F6F8FA]">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-20 flex items-center justify-between shadow-2xs">
        <button
          onClick={() => {
            if (viewMode !== 'store') setViewMode('store');
            else goBack();
          }}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{viewMode === 'store' ? 'Home' : 'Back to Store'}</span>
        </button>

        <span className="text-xs font-bold text-[#172B4D]">
          {viewMode === 'cart'
            ? 'Pharmacy Cart'
            : viewMode === 'checkout'
            ? 'Order Checkout'
            : viewMode === 'tracking'
            ? 'Live Order Tracking'
            : 'Doctor G Medical Store'}
        </span>

        {/* Cart Icon with badge */}
        <button
          onClick={() => setViewMode('cart')}
          className="relative p-1.5 rounded-full hover:bg-slate-100 text-slate-700"
        >
          <ShoppingCart className="w-5 h-5 text-teal-700" />
          {cartTotalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
              {cartTotalItems}
            </span>
          )}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* ========================================================
            STORE HOME VIEW
            ======================================================== */}
        {viewMode === 'store' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Search Bar with Reusable Voice Search */}
            <VoiceSearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onChangeValue={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search medicines, salts, health devices..."
              searchCategory="medicine"
            />

            {/* Quick Upload Prescription Banner */}
            <div className="bg-gradient-to-r from-teal-800 to-[#087E8B] p-4 rounded-2xl text-white shadow-sm flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200">
                  Have a Doctor's Prescription?
                </span>
                <h4 className="font-bold text-xs text-white mt-0.5">
                  Upload Rx & Let Pharmacist Add Medicines
                </h4>
                <p className="text-[10px] text-teal-100 mt-0.5">
                  Save time, verified by registered pharmacists
                </p>
              </div>
              <button
                onClick={() => setIsRxModalOpen(true)}
                className="px-3 py-2 bg-white text-teal-800 hover:bg-teal-50 rounded-xl text-xs font-bold shadow-xs flex-shrink-0 flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{rxUploaded ? 'Rx Uploaded ✓' : 'Upload Rx'}</span>
              </button>
            </div>

            {/* Categories horizontal pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#087E8B] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    setSelectedProduct(prod);
                    setViewMode('product-detail');
                  }}
                  className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative mb-2 h-28 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      {prod.requiresPrescription && (
                        <span className="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                          Rx Required
                        </span>
                      )}
                      <span className="absolute top-1.5 right-1.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                        {prod.discountPercentage}% OFF
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-[#172B4D] line-clamp-1">{prod.name}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{prod.composition}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{prod.packageSize}</p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-[#172B4D]">₹{prod.price}</span>
                      <span className="text-[10px] text-slate-400 line-through ml-1">
                        ₹{prod.mrp}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(prod, 1);
                      }}
                      className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-[#087E8B] rounded-lg text-xs font-bold transition-colors"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            PRODUCT DETAIL VIEW
            ======================================================== */}
        {viewMode === 'product-detail' && selectedProduct && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-4 border border-slate-200 text-center">
              <div className="h-48 rounded-2xl overflow-hidden bg-slate-50 mb-3 mx-auto">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-left">
                {selectedProduct.requiresPrescription && (
                  <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200 inline-block mb-1.5">
                    Prescription (Rx) Required
                  </span>
                )}
                <h3 className="font-bold text-base text-[#172B4D]">{selectedProduct.name}</h3>
                <p className="text-xs text-teal-700 font-semibold">{selectedProduct.composition}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">By {selectedProduct.brand}</p>

                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                  <span className="text-lg font-black text-[#172B4D]">₹{selectedProduct.price}</span>
                  <span className="text-xs text-slate-400 line-through">₹{selectedProduct.mrp}</span>
                  <span className="text-xs font-bold text-emerald-600">
                    Save {selectedProduct.discountPercentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Safety & Description */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <h4 className="font-bold text-[#172B4D]">Product Description</h4>
              <p className="text-slate-500 leading-relaxed">{selectedProduct.description}</p>

              <h4 className="font-bold text-[#172B4D] pt-2">Safety & Precautions</h4>
              <p className="text-slate-500 leading-relaxed">{selectedProduct.safetyInstructions}</p>
            </div>

            <button
              onClick={() => {
                addToCart(selectedProduct, 1);
                setViewMode('cart');
              }}
              className="w-full py-3.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart & Checkout</span>
            </button>
          </div>
        )}

        {/* ========================================================
            CART VIEW
            ======================================================== */}
        {viewMode === 'cart' && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-extrabold text-[#172B4D]">Your Shopping Cart</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {cart.length} item{cart.length === 1 ? '' : 's'} added
              </p>
            </div>

            {cart.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-[#172B4D]">Your cart is empty</h4>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  Add medicines or health essentials from the store
                </p>
                <button
                  onClick={() => setViewMode('store')}
                  className="px-4 py-2 bg-[#087E8B] text-white rounded-xl text-xs font-bold"
                >
                  Explore Store
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Cart Items */}
                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 p-2">
                  {cart.map((item) => (
                    <div key={item.product.id} className="p-3 flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-[#172B4D] truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">
                          {item.product.packageSize}
                        </p>
                        <p className="text-xs font-extrabold text-[#172B4D] mt-1">
                          ₹{item.product.price * item.quantity}
                        </p>
                      </div>

                      {/* Quantity buttons */}
                      <div className="flex items-center gap-2 border border-slate-200 rounded-xl p-1 bg-slate-50">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-slate-700 hover:bg-slate-100 shadow-2xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-800 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-slate-700 hover:bg-slate-100 shadow-2xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Price Summary */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{cartSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? 'text-emerald-600 font-bold' : ''}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-extrabold text-sm text-[#172B4D] pt-2 border-t border-slate-100">
                    <span>Total Amount</span>
                    <span>₹{cartGrandTotal}</span>
                  </div>
                </div>

                <button
                  onClick={() => setViewMode('checkout')}
                  className="w-full py-3.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Proceed to Delivery & Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            CHECKOUT VIEW
            ======================================================== */}
        {viewMode === 'checkout' && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-extrabold text-[#172B4D]">Order Delivery Details</h2>
              <p className="text-xs text-slate-500 mt-0.5">Where should we deliver your medicines?</p>
            </div>

            {/* Delivery Address */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Delivery Address
              </span>
              <p className="text-xs font-bold text-[#172B4D]">
                {savedAddresses[0]?.name} • {savedAddresses[0]?.phone}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {savedAddresses[0]?.flat}, {savedAddresses[0]?.street}, {savedAddresses[0]?.area},{' '}
                {savedAddresses[0]?.city} - {savedAddresses[0]?.pincode}
              </p>
            </div>

            {/* Prescription Check */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#172B4D]">Prescription Verification</p>
                <p className="text-[11px] text-slate-500">
                  {rxUploaded ? 'Prescription attached to order' : 'No prescription uploaded yet'}
                </p>
              </div>
              <button
                onClick={() => setIsRxModalOpen(true)}
                className="text-xs font-bold text-[#087E8B] hover:underline"
              >
                {rxUploaded ? 'Change' : 'Upload Rx'}
              </button>
            </div>

            {/* Payment Summary */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-[#172B4D]">
                <span>Total Payable</span>
                <span>₹{cartGrandTotal}</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Mock sandbox order. Delivery simulated for demo.
              </p>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full py-3.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all"
            >
              Confirm Order & Pay ₹{cartGrandTotal}
            </button>
          </div>
        )}

        {/* ========================================================
            ORDER SUCCESS VIEW
            ======================================================== */}
        {viewMode === 'order-success' && activeOrder && (
          <div className="space-y-4 animate-in zoom-in-95 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#172B4D]">Medicine Order Placed!</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Order ID: <strong className="text-slate-800">{activeOrder.orderNumber}</strong>
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Delivery</span>
                <span className="font-bold text-emerald-600">{activeOrder.estimatedDelivery}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Items Ordered</span>
                <span className="font-bold text-slate-800">{activeOrder.items.length} Medicines</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Paid</span>
                <span className="font-bold text-slate-800">₹{activeOrder.total}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setViewMode('tracking')}
                className="w-full py-3 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Track Delivery Status
              </button>
              <button
                onClick={() => setViewMode('store')}
                className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            ORDER TRACKING VIEW (6 STAGES)
            ======================================================== */}
        {viewMode === 'tracking' && activeOrder && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-extrabold text-[#172B4D]">Track Pharmacy Order</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Order #{activeOrder.orderNumber} • ETA: {activeOrder.estimatedDelivery}
              </p>
            </div>

            {/* 6 Stages Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              {[
                { title: 'Order Placed', desc: 'Order received by local partner pharmacy', done: true },
                { title: 'Prescription Verification', desc: 'Pharmacist reviewed doctor prescription', done: true },
                { title: 'Preparing Order', desc: 'Medicines packed and quality checked', done: true },
                { title: 'Ready for Dispatch', desc: 'Assigned to delivery courier partner', done: false },
                { title: 'Out for Delivery', desc: 'Rider is on the way to your address', done: false },
                { title: 'Delivered', desc: 'Handed over securely with OTP', done: false },
              ].map((stage, idx) => (
                <div key={stage.title} className="flex items-start gap-3 relative">
                  {idx < 5 && (
                    <div
                      className={`absolute left-2.5 top-5 w-0.5 h-10 ${
                        stage.done ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    ></div>
                  )}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold z-10 ${
                      stage.done ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    ✓
                  </div>
                  <div>
                    <h5
                      className={`text-xs font-bold leading-tight ${
                        stage.done ? 'text-[#172B4D]' : 'text-slate-400'
                      }`}
                    >
                      {stage.title}
                    </h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">{stage.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setViewMode('store')}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
            >
              Back to Store
            </button>
          </div>
        )}
      </div>

      {/* Prescription Upload Modal */}
      {isRxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-sm text-[#172B4D]">Upload Doctor Prescription</h3>
              <button
                onClick={() => setIsRxModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Ensure doctor details, patient name, and clinic registration stamp are clearly visible.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={handleUploadRx}
                className="p-4 border-2 border-dashed border-teal-300 bg-teal-50/50 hover:bg-teal-100/50 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer"
              >
                <Camera className="w-6 h-6 text-teal-700 mb-1" />
                <span className="text-xs font-bold text-teal-900">Take Photo</span>
              </button>
              <button
                onClick={handleUploadRx}
                className="p-4 border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer"
              >
                <FileText className="w-6 h-6 text-slate-600 mb-1" />
                <span className="text-xs font-bold text-slate-800">Upload PDF</span>
              </button>
            </div>

            <button
              onClick={() => setIsRxModalOpen(false)}
              className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
