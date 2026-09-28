"use client";

import React, { useState } from "react";
import { Star, MapPin, Phone, Clock, Camera, ArrowRight, ShoppingBag, ShoppingCart, Check, X, Eye, CreditCard } from "lucide-react";

// Reliable, tested Unsplash IDs for premium aesthetic
const CATALOG = {
  womens: [
    { id: "w1", title: "Archive Silk Dress", price: "₹2999", desc: "A flawless drape and asymmetrical cut makes this silk piece a modern classic. Features a hidden side zip and adjustable straps.", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" },
    { id: "w2", title: "Utility Cargo Skirt", price: "₹4299", desc: "Heavyweight cotton twill skirt with oversized pockets and silver hardware detailing.", img: "https://images.unsplash.com/photo-1551489186-cf8726f514f8?auto=format&fit=crop&q=80&w=800" },
    { id: "w3", title: "Ribbed Knit Dress", price: "₹5499", desc: "Form-fitting ribbed midi dress in a neutral earth tone. Perfect for layering.", img: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=800" },
    { id: "w4", title: "Faux Leather Jacket", price: "₹4999", desc: "Oversized faux leather biker jacket with a vintage wash finish.", img: "https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&q=80&w=800" },
  ],
  mens: [
    { id: "m1", title: "Heavyweight Graphic Hoodie", price: "₹1899", desc: "500gsm cotton fleece hoodie with subtle puff print branding.", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800" },
    { id: "m2", title: "Vintage Wash Tee", price: "₹2799", desc: "Boxy fit, garment-dyed t-shirt with a perfectly worn-in feel.", img: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=800" },
    { id: "m3", title: "Nylon Track Jacket", price: "₹6499", desc: "Lightweight windbreaker with contrasting piping and a mesh lining.", img: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80&w=800" },
    { id: "m4", title: "Flannel Overshirt", price: "₹5599", desc: "Heavy brushed flannel, perfect for throwing over a basic tee.", img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800" },
  ],
  jeans: [
    { id: "j1", title: "Distressed Baggy Denim", price: "₹3499", desc: "Y2K inspired wide-leg fit with strategic knee distressing.", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800" },
    { id: "j2", title: "Classic Straight Leg", price: "₹3999", desc: "Timeless straight cut in a faded vintage blue wash.", img: "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&q=80&w=800" },
    { id: "j3", title: "Washed Black Cargo Jeans", price: "₹4299", desc: "Tactical cargo pockets meet classic black denim.", img: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=800" },
    { id: "j4", title: "Slim Fit Ripped Jeans", price: "₹3299", desc: "Modern slim silhouette with a bit of stretch for comfort.", img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800" },
  ],
  kids: [
    { id: "k1", title: "Mini Street Set", price: "₹1899", desc: "Matching hoodie and jogger set for the little ones.", img: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&q=80&w=800" },
    { id: "k2", title: "Kids Varsity Jacket", price: "₹2499", desc: "Classic collegiate style shrunk down to miniature proportions.", img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=800" },
    { id: "k3", title: "Toddler Denim Overalls", price: "₹1999", desc: "Durable denim overalls with adjustable straps.", img: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=800" },
    { id: "k4", title: "Graphic Print Onesie", price: "₹1699", desc: "Soft cotton onesie featuring playful street-art graphics.", img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800" },
  ],
  bags: [
    { id: "b1", title: "Utility Crossbody Bag", price: "₹2199", desc: "Tactical everyday carry with adjustable strap and multiple compartments. Made with waterproof nylon.", img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800" },
    { id: "b2", title: "Minimalist Leather Tote", price: "₹3499", desc: "Sleek and spacious tote bag made from premium vegan leather.", img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800" },
    { id: "b3", title: "Urban Backpack", price: "₹4299", desc: "Heavy-duty canvas backpack with padded laptop sleeve.", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800" },
    { id: "b4", title: "Chain Link Mini Bag", price: "₹1899", desc: "Statement mini bag with thick silver hardware chain.", img: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800" },
  ],
  sunglasses: [
    { id: "s1", title: "Minimalist Shades", price: "₹1299", desc: "Sleek, lightweight frames with UV400 protection.", img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800" },
    { id: "s2", title: "Retro Aviators", price: "₹1499", desc: "Classic wireframes with a modern amber tint.", img: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800" },
    { id: "s3", title: "Chunky Frame Sunnies", price: "₹1799", desc: "Thick acetate frames for a bold statement look.", img: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=800" },
    { id: "s4", title: "Hexagon Tinted Glasses", price: "₹1199", desc: "Geometric frames with a subtle gradient lens.", img: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=800" },
  ]
};

interface CartItem {
  id: string;
  title: string;
  price: string;
  img: string;
  quantity: number;
}

const ProductCard = ({ product, category, onAdd, onView }: { product: any, category: string, onAdd: (p: any) => void, onView: (p: any) => void }) => (
  <div className="group relative flex flex-col gap-4 cursor-pointer" onClick={() => onView(product)}>
    <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900 rounded-sm">
      <img 
        src={product.img} 
        alt={product.title} 
        loading="lazy"
        className="object-cover w-full h-full transition-all duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100 grayscale-[0.2] contrast-[1.05]" 
      />
      {/* Quick Actions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 w-[90%] flex gap-2">
        <button onClick={(e) => { e.stopPropagation(); onView(product); }} className="flex-1 py-3 bg-black/60 backdrop-blur-md border border-white/20 text-white font-medium text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2">
          <Eye size={14} /> View
        </button>
        <button onClick={(e) => { e.stopPropagation(); onAdd(product); }} className="flex-1 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2">
          <ShoppingBag size={14} /> Add
        </button>
      </div>
    </div>
    <div>
      <div className="flex justify-between items-start mb-1">
        <h4 className="text-white text-sm font-medium tracking-wide">{product.title}</h4>
        <span className="text-white/70 font-mono text-sm">{product.price}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-white/40 text-[10px] uppercase tracking-widest">{category}</span>
        <div className="flex items-center gap-1 text-[#CBA153]">
          <Star size={10} fill="currentColor" />
          <span className="text-white text-[10px] font-mono ml-1">4.9</span>
        </div>
      </div>
    </div>
  </div>
);

const CategorySection = ({ title, subtitle, items, categoryName, onAdd, onView }: { title: string, subtitle: string, items: any[], categoryName: string, onAdd: (p: any) => void, onView: (p: any) => void }) => (
  <section className="py-20 px-6 md:px-12 max-w-[1600px] mx-auto border-t border-white/5">
    <div className="flex justify-between items-end mb-12">
      <div>
        <h3 className="text-white/50 text-[10px] font-mono tracking-[0.3em] uppercase mb-3">{subtitle}</h3>
        <h2 className="text-3xl md:text-4xl text-white font-light tracking-tight">{title}</h2>
      </div>
      <button className="hidden md:flex items-center gap-2 text-white/70 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] pb-1 border-b border-white/20 hover:border-white">
        Explore <ArrowRight size={14} />
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
      {items.map((item) => (
        <ProductCard key={item.id} product={item} category={categoryName} onAdd={onAdd} onView={onView} />
      ))}
    </div>
  </section>
);

export default function Storefront() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showAddedToast, setShowAddedToast] = useState(false);
  
  // Cart & Checkout States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "form">("cart");
  const [showOrderSuccessPopup, setShowOrderSuccessPopup] = useState(false);
  
  // Product Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const handleAddToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 2000);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const priceNum = parseInt(item.price.replace("₹", ""));
      return total + (priceNum * item.quantity);
    }, 0);
  };

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCartOpen(false);
    setCart([]);
    setCheckoutStep("cart");
    setShowOrderSuccessPopup(true);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="w-full bg-[#050505] min-h-screen relative z-10 border-t border-white/5">
      
      {/* Floating Cart Button */}
      <div className="fixed bottom-8 right-8 z-[90]">
        <button 
          onClick={() => { setIsCartOpen(true); setCheckoutStep("cart"); }}
          className="relative flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-105 transition-transform duration-300 group"
        >
          <ShoppingCart size={18} />
          <span className="font-bold tracking-[0.2em] uppercase text-[10px]">Order Now</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#CBA153] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Item Added Toast */}
      <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[150] transition-all duration-500 ${showAddedToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
        <div className="bg-[#CBA153] text-black px-6 py-3 rounded-sm font-medium text-[10px] tracking-[0.2em] uppercase flex items-center gap-2 shadow-xl">
          <Check size={14} /> Added to Cart
        </div>
      </div>

      {/* Product Detail Modal */}
      <div className={`fixed inset-0 z-[120] flex items-center justify-center transition-colors duration-500 ${selectedProduct ? 'bg-black/80 pointer-events-auto backdrop-blur-md' : 'bg-transparent pointer-events-none'}`}>
        <div className={`relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-[70vh] transition-all duration-500 transform ${selectedProduct ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10'}`}>
          <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 text-white/50 hover:text-white z-10 bg-black/50 p-2 rounded-full backdrop-blur-sm">
            <X size={20} />
          </button>
          
          {selectedProduct && (
            <>
              {/* Product Images Area */}
              <div className="w-full md:w-1/2 h-1/2 md:h-full bg-neutral-900 grid grid-cols-2 grid-rows-2 gap-1 p-1">
                <img src={selectedProduct.img} className="w-full h-full object-cover col-span-2 row-span-2 md:col-span-1 md:row-span-2" alt="Main" />
                <img src={selectedProduct.img} className="hidden md:block w-full h-full object-cover filter brightness-75 contrast-125" alt="Detail 1" />
                <img src={selectedProduct.img} className="hidden md:block w-full h-full object-cover filter brightness-125 saturate-50" alt="Detail 2" />
              </div>
              
              {/* Product Info Area */}
              <div className="w-full md:w-1/2 h-1/2 md:h-full p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
                <h3 className="text-[#CBA153] text-[10px] font-mono tracking-[0.3em] uppercase mb-4">Archive Collection</h3>
                <h2 className="text-3xl md:text-5xl text-white font-light tracking-tight mb-4">{selectedProduct.title}</h2>
                <div className="text-white font-mono text-xl mb-6">{selectedProduct.price}</div>
                
                <p className="text-neutral-400 font-light text-sm leading-relaxed mb-8">
                  {selectedProduct.desc} Carefully curated for the modern wardrobe. Featuring durable, premium fabrics that maintain their structural fit wash after wash.
                </p>
                
                <div className="mb-6">
                  <h4 className="text-white/60 text-[10px] tracking-[0.2em] uppercase mb-3">Color Variants</h4>
                  <div className="flex gap-3">
                    <button className="w-8 h-8 rounded-full bg-black border border-white/40 focus:border-white focus:ring-1 focus:ring-white transition-all"></button>
                    <button className="w-8 h-8 rounded-full bg-neutral-600 border border-transparent focus:border-white focus:ring-1 focus:ring-white transition-all"></button>
                    <button className="w-8 h-8 rounded-full bg-[#3d3d3d] border border-transparent focus:border-white focus:ring-1 focus:ring-white transition-all"></button>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-white/60 text-[10px] tracking-[0.2em] uppercase mb-3">Select Size</h4>
                  <div className="flex gap-3">
                    {["S", "M", "L", "XL"].map(size => (
                      <button key={size} className="w-12 h-12 border border-white/20 text-white font-mono text-sm hover:border-white hover:bg-white hover:text-black transition-colors">
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleAddToCart(selectedProduct)}
                  className="w-full py-4 bg-white text-black font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-neutral-200 transition-colors flex items-center justify-center gap-3"
                >
                  <ShoppingBag size={16} /> Add to Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Shopping Cart & Checkout Sidebar Modal */}
      <div className={`fixed inset-0 z-[200] pointer-events-none transition-colors duration-500 ${isCartOpen ? 'bg-black/60 pointer-events-auto backdrop-blur-sm' : 'bg-transparent'}`}>
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          <div className="flex justify-between items-center p-8 border-b border-white/5">
            <h2 className="text-white text-xl font-light tracking-widest uppercase">
              {checkoutStep === "cart" ? "Your Cart" : "Checkout"}
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="text-white/50 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 flex flex-col">
            
            {/* CART VIEW */}
            {checkoutStep === "cart" && (
              <>
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/40 gap-4">
                    <ShoppingCart size={48} strokeWidth={1} />
                    <p className="text-sm font-mono uppercase tracking-widest">Cart is empty</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-6 items-center">
                        <div className="w-20 h-24 bg-neutral-900 shrink-0">
                          <img src={item.img} className="w-full h-full object-cover grayscale-[0.2]" alt={item.title} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white text-sm tracking-wide mb-1">{item.title}</h4>
                          <p className="text-white/50 font-mono text-xs mb-3">{item.price} x {item.quantity}</p>
                          <button onClick={() => handleRemoveFromCart(item.id)} className="text-white/30 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* CHECKOUT FORM VIEW */}
            {checkoutStep === "form" && (
              <form id="checkout-form" onSubmit={submitOrder} className="flex flex-col gap-6">
                <div>
                  <h3 className="text-[#CBA153] text-[10px] tracking-[0.2em] uppercase mb-4">Shipping Details</h3>
                  <div className="space-y-4">
                    <input required type="text" placeholder="Full Name" className="w-full bg-neutral-900 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/40 transition-colors" />
                    <input required type="email" placeholder="Email Address" className="w-full bg-neutral-900 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/40 transition-colors" />
                    <input required type="text" placeholder="Complete Address" className="w-full bg-neutral-900 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/40 transition-colors" />
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-[#CBA153] text-[10px] tracking-[0.2em] uppercase mb-4">Payment Information</h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                      <input required type="text" placeholder="Card Number" className="w-full bg-neutral-900 border border-white/10 text-white pl-12 pr-4 py-3 text-sm outline-none focus:border-white/40 transition-colors font-mono" />
                    </div>
                    <div className="flex gap-4">
                      <input required type="text" placeholder="MM/YY" className="w-1/2 bg-neutral-900 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/40 transition-colors font-mono" />
                      <input required type="text" placeholder="CVC" className="w-1/2 bg-neutral-900 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/40 transition-colors font-mono" />
                    </div>
                  </div>
                </div>
              </form>
            )}


          </div>

          {/* Footer Actions */}
          {cart.length > 0 && (
            <div className="p-8 border-t border-white/5 bg-[#050505]">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/60 text-sm tracking-widest uppercase">Total</span>
                <span className="text-white font-mono text-lg">₹{calculateTotal()}</span>
              </div>
              
              {checkoutStep === "cart" ? (
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setCheckoutStep("form");
                  }}
                  className="w-full py-4 bg-white text-black font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-neutral-200 transition-colors flex items-center justify-center relative z-50 cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              ) : (
                <button 
                  type="submit"
                  form="checkout-form"
                  className="w-full py-4 bg-[#CBA153] text-black font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-[#d8b571] transition-colors flex items-center justify-center relative z-50 cursor-pointer"
                >
                  Place Order Now
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order Success Popup Modal */}
      <div className={`fixed inset-0 z-[300] flex items-center justify-center transition-all duration-500 ${showOrderSuccessPopup ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowOrderSuccessPopup(false)} />
        <div className={`relative bg-[#0a0a0a] border border-white/10 p-12 max-w-lg w-full shadow-2xl flex flex-col items-center text-center transform transition-all duration-500 delay-100 ${showOrderSuccessPopup ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'}`}>
          <button onClick={() => setShowOrderSuccessPopup(false)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <div className="w-20 h-20 rounded-full bg-[#CBA153]/20 border border-[#CBA153]/50 flex items-center justify-center text-[#CBA153] mb-8">
            <Check size={40} />
          </div>
          <h3 className="text-[#CBA153] text-[10px] tracking-[0.3em] uppercase mb-4">Transaction Complete</h3>
          <h2 className="text-3xl text-white font-light mb-4">Order Placed Successfully</h2>
          <p className="text-white/50 font-light text-sm mb-8 leading-relaxed">
            Thank you for shopping at The Street Fashion Hub. Your exclusive pieces are being prepared for dispatch. An email confirmation has been sent to your registered address.
          </p>
          <button 
            onClick={() => setShowOrderSuccessPopup(false)}
            className="px-10 py-4 bg-white text-black font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-neutral-200 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* About Section */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-[#CBA153] text-[10px] font-mono tracking-[0.4em] uppercase mb-6">The Street Fashion Hub</h3>
            <h2 className="text-4xl md:text-5xl font-light text-white tracking-tighter mb-8 leading-[1.2]">
              Redefining <span className="font-serif italic text-white/80">Streetwear</span> for the Modern Era.
            </h2>
            <p className="text-neutral-400 leading-relaxed mb-8 font-light text-sm">
              Proudly women-owned, we are obsessed with delivering high-quality archive fabrics, structural silhouettes, and premium aesthetics without the luxury markup. Our curated collections are designed to make you stand out.
            </p>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-neutral-900 border border-[#050505] flex items-center justify-center">
                    <Star size={12} className="text-[#CBA153]" fill="currentColor" />
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase">490+ Verified Reviews</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] bg-neutral-900 overflow-hidden mt-12">
               <img src={CATALOG.mens[0].img} className="w-full h-full object-cover opacity-80 grayscale-[0.3] hover:grayscale-0 transition-all duration-700" alt="Mens wear" loading="lazy" />
            </div>
            <div className="aspect-[3/4] bg-neutral-900 overflow-hidden">
               <img src={CATALOG.womens[0].img} className="w-full h-full object-cover opacity-80 grayscale-[0.3] hover:grayscale-0 transition-all duration-700" alt="Womens wear" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Vast Catalogue Layout */}
      <CategorySection title="Archive Womens" subtitle="Editorial Fits" categoryName="Womens Wear" items={CATALOG.womens} onAdd={handleAddToCart} onView={setSelectedProduct} />
      <CategorySection title="Structured Denim" subtitle="Premium Washes" categoryName="Jeans" items={CATALOG.jeans} onAdd={handleAddToCart} onView={setSelectedProduct} />
      <CategorySection title="Mens Upper Wear" subtitle="Heavyweight Essentials" categoryName="Mens Wear" items={CATALOG.mens} onAdd={handleAddToCart} onView={setSelectedProduct} />
      <CategorySection title="Mini Archive" subtitle="Kids Street Styles" categoryName="Kids" items={CATALOG.kids} onAdd={handleAddToCart} onView={setSelectedProduct} />
      <CategorySection title="Bags & Accessories" subtitle="Everyday Carry" categoryName="Bags" items={CATALOG.bags} onAdd={handleAddToCart} onView={setSelectedProduct} />
      <CategorySection title="Eyewear" subtitle="Shade Season" categoryName="Accessories" items={CATALOG.sunglasses} onAdd={handleAddToCart} onView={setSelectedProduct} />

      {/* Testimonial Ticker */}
      <section className="py-24 bg-neutral-900/20 border-y border-white/5 overflow-hidden">
        <div className="flex gap-16 whitespace-nowrap animate-[slide_25s_linear_infinite]">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16">
              <div className="px-8 flex items-center gap-6">
                <Star className="text-[#CBA153]" fill="currentColor" size={16} />
                <span className="text-2xl text-white/70 font-serif italic tracking-wide">"The fabric quality is unreal for the price."</span>
              </div>
              <div className="px-8 flex items-center gap-6">
                <Star className="text-[#CBA153]" fill="currentColor" size={16} />
                <span className="text-2xl text-white/70 font-serif italic tracking-wide">"Best aesthetic collection in Nagpur."</span>
              </div>
              <div className="px-8 flex items-center gap-6">
                <Star className="text-[#CBA153]" fill="currentColor" size={16} />
                <span className="text-2xl text-white/70 font-serif italic tracking-wide">"Editorial silhouettes and trendy fits."</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram Showcase */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <h3 className="text-[#CBA153] text-[10px] font-mono tracking-[0.4em] uppercase mb-6">Join the Archive</h3>
        <h2 className="text-4xl md:text-5xl font-light text-white tracking-tighter mb-16">@TheStreetFashionHub</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-16">
          {[CATALOG.mens[1].img, CATALOG.womens[1].img, CATALOG.jeans[1].img, CATALOG.sunglasses[1].img].map((src, idx) => (
            <div key={idx} className="aspect-square bg-neutral-900 overflow-hidden relative group cursor-pointer">
              <img src={src} className="w-full h-full object-cover opacity-60 grayscale-[0.2] group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt="Insta post" loading="lazy" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/20 backdrop-blur-sm">
                <Camera className="text-white" size={24} />
              </div>
            </div>
          ))}
        </div>
        <button className="px-10 py-4 border border-white/20 text-white uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black transition-colors">
          Follow on Instagram
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-black pt-24 pb-12 border-t border-white/5 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          
          <div className="md:col-span-1">
            <h2 className="text-white font-light tracking-[0.1em] uppercase mb-6 text-xl">The Street<br/>Fashion Hub</h2>
            <p className="text-neutral-500 text-xs leading-relaxed font-light">
              Curating the finest archive aesthetics. Women-owned business delivering premium editorial style to the community.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium tracking-[0.2em] uppercase text-[10px] mb-8">Contact & Visit</h4>
            <ul className="space-y-6 text-neutral-400 text-xs font-light">
              <li className="flex items-start gap-4">
                <MapPin size={14} className="text-[#CBA153] shrink-0 mt-0.5" />
                <span className="leading-relaxed">Gurudev Nagar Square, opposite Zudio, near Keshav Enclave, Bapu Nagar, Nandanvan, Nagpur, MH 440009</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={14} className="text-[#CBA153] shrink-0" />
                <span>082630 55540</span>
              </li>
              <li className="flex items-center gap-4">
                <Clock size={14} className="text-[#CBA153] shrink-0" />
                <span>Opens 11:00 AM Daily</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium tracking-[0.2em] uppercase text-[10px] mb-8">Client Services</h4>
            <ul className="space-y-4 text-neutral-400 text-xs font-light">
              <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium tracking-[0.2em] uppercase text-[10px] mb-8">The Newsletter</h4>
            <p className="text-neutral-500 text-xs font-light mb-6">Subscribe for exclusive early access to archive drops.</p>
            <div className="flex border-b border-white/20 pb-2 focus-within:border-white transition-colors">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-transparent text-white text-xs px-2 outline-none w-full placeholder:text-neutral-600 font-mono tracking-widest"
              />
              <button className="text-white px-2 text-[10px] font-bold tracking-[0.2em] uppercase hover:text-[#CBA153] transition-colors">
                Join
              </button>
            </div>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-neutral-600 text-[10px] font-mono tracking-widest uppercase">
          <p>© {new Date().getFullYear()} The Street Fashion Hub. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Global CSS for Ticker Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}
