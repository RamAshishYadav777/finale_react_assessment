"use client";

import { groceryItems } from "@/data/groceryItems";
import {
  addItem,
  removeItem,
  applyCoupon,
  undoLastAction,
  hydrateCart,
  CartItem,
} from "@/redux/slices/cartSlice";
import { loadCartFromStorage, saveCartToStorage } from "@/utils/localStorage";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Trash2,
  RotateCcw,
  Filter,
  Tag,
  ChevronDown,
  CheckCircle,
  X,
  Twitter,
  Facebook,
  Instagram,
  Linkedin
} from "lucide-react";
import clsx from "clsx";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { items, total, thresholdDiscount, couponDiscount, payable, couponCode } =
    useAppSelector((state) => state.cart);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");
  const [tempCoupon, setTempCoupon] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isMounted = useRef(false);

  // Load from Local Storage on Mount
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    if (savedCart) {
      dispatch(hydrateCart(savedCart));
    }
  }, [dispatch]);

  // Save to Local Storage on Change
  useEffect(() => {
    if (isMounted.current) {
      saveCartToStorage({ items, couponCode });
    } else {
      isMounted.current = true;
    }
  }, [items, couponCode]);

  /* ---------- UI STATE ---------- */
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddItem = (item: CartItem) => {
    dispatch(addItem(item));
    showToast(`Added ${item.name} to cart`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  /* ---------- FILTER + SORT ---------- */
  const filteredItems = useMemo(() => {
    let data = [...groceryItems];

    if (search) {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      data = data.filter((item) => item.category === category);
    }

    if (sort === "low") {
      data.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      data.sort((a, b) => b.price - a.price);
    }

    return data;
  }, [search, category, sort]);

  // Icons for items
  const getItemIcon = (name: string, cat: string) => {
    const n = name.toLowerCase();
    if (n.includes("apple")) return "🍎";
    if (n.includes("banana")) return "🍌";
    if (n.includes("milk")) return "🥛";
    if (n.includes("cheese")) return "🧀";
    if (n.includes("potato")) return "🥔";

    // Fallback to category
    switch (cat) {
      case "fruit": return "🍎";
      case "dairy": return "🥛";
      case "vegetable": return "🥦";
      default: return "📦";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-indigo-100 pb-20 relative overflow-hidden">
      {/* Background Animated Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-3xl mix-blend-multiply filter"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -60, 0],
            x: [0, -50, 0],
            y: [0, 100, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-3xl mix-blend-multiply filter"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] left-[20%] w-[700px] h-[700px] bg-pink-200/20 rounded-full blur-3xl mix-blend-multiply filter"
        />
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-[70] bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md bg-opacity-90"
          >
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="font-medium text-sm">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 transition-all duration-300">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm supports-[backdrop-filter]:bg-white/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-indigo-800 bg-clip-text text-transparent tracking-tight">
                Organic Bazzar
              </h1>
              <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase block -mt-1 ml-0.5">
                Organic Store
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative group z-50">
            <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-300" />
              <input
                className="w-full bg-gray-100/80 border-2 border-transparent hover:bg-white focus:bg-white focus:border-indigo-500/20 rounded-full py-3 pl-14 pr-6 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 shadow-inner group-hover:shadow-lg"
                placeholder="Search specifically (e.g., 'Apple', 'Milk')..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-focus-within:flex items-center gap-1">
                <kbd className="hidden sm:inline-block px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-bold text-gray-400">⌘ K</kbd>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">

            <button className="hidden sm:flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl hover:bg-indigo-600 hover:text-white transition-all text-gray-600">
              <Tag className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-3 bg-white hover:bg-indigo-50 rounded-2xl transition-all active:scale-95 group shadow-sm border border-gray-100"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
              <AnimatePresence>
                {items.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md border-2 border-white"
                  >
                    {items.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-6 mb-12">
        <div className="relative bg-[#0F172A] rounded-[2.5rem] overflow-hidden min-h-[500px] flex items-center shadow-2xl shadow-indigo-500/10">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-[#1e1b4b] to-transparent z-10" />
            <Image
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop"
              alt="Background"
              fill
              className="object-cover opacity-60 mix-blend-overlay"
              priority
            />
          </div>

          {/* Animated decorative circles */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />

          <div className="relative z-20 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-indigo-300 text-sm font-medium mb-6 hover:bg-white/20 transition-colors cursor-default"
              >
                <Tag className="w-4 h-4" />
                <span>50% OFF First Order</span>
              </motion.div>

              <h2 className="text-5xl sm:text-7xl font-black text-white mb-6 leading-[0.9] tracking-tight">
                Freshness <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Delivered.
                </span>
              </h2>

              <p className="text-gray-300 text-lg sm:text-xl max-w-lg leading-relaxed mb-8 font-light">
                Experience the finest organic produce, hand-picked and delivered to your doorstep in minutes. Quality you can taste, convenience you'll love.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                >
                  Shop Now <ChevronDown className="w-5 h-5 -rotate-90" />
                </motion.button>
                <div className="flex items-center gap-[-10px]">
                  <div className="flex -space-x-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`w-12 h-12 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-xl shadow-lg z-${10 - i}`}>
                        {i === 1 ? '👩' : i === 2 ? '👨' : '👧'}
                      </div>
                    ))}
                  </div>
                  <div className="ml-6 text-sm text-gray-400">
                    <span className="text-white font-bold block">15k+</span> Happy Customers
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              {/* 3D Floating layout simulation */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="relative z-10 w-full aspect-square bg-gradient-to-tr from-indigo-500/20 to-purple-500/10 rounded-[3rem] border border-white/10 backdrop-blur-sm p-8 flex items-center justify-center max-w-[400px] mx-auto"
              >
                <div className="text-[8rem] drop-shadow-2xl filter saturate-150">🥗</div>

                {/* Floating Cards */}
                <motion.div
                  animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
                  className="absolute -top-6 -right-6 bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-2xl shadow-xl"
                >
                  <div className="text-2xl mb-1">🥑</div>
                  <div className="text-white text-[10px] font-bold">Organic</div>
                </motion.div>

                <motion.div
                  animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
                  className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-2xl shadow-xl"
                >
                  <div className="text-2xl mb-1">🥕</div>
                  <div className="text-white text-[10px] font-bold">Fresh</div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="lg:w-72 flex-shrink-0 space-y-8">
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-gray-200/50 sticky top-24 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-gray-900 flex items-center gap-3 text-xl tracking-tight">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <Filter className="w-5 h-5" />
                  </div>
                  Filters
                </h3>
                {(category !== 'all' || sort !== '') && (
                  <button
                    onClick={() => { setCategory('all'); setSort(''); }}
                    className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 px-3 py-1 rounded-full transition-colors"
                  >
                    RESET
                  </button>
                )}
              </div>

              <div className="space-y-8">
                <div>
                  <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4 block ml-1">Categories</label>
                  <div className="space-y-2">
                    {["all", "fruit", "dairy", "vegetable"].map((cat) => (
                      <motion.button
                        layout
                        key={cat}
                        onClick={() => setCategory(cat)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={clsx(
                          "w-full text-left px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center justify-between group relative overflow-hidden",
                          category === cat
                            ? "text-white shadow-lg shadow-indigo-500/25 translate-x-2"
                            : "text-gray-600 hover:bg-gray-50 hover:pl-6"
                        )}
                      >
                        {category === cat && (
                          <motion.div
                            layoutId="activeCategory"
                            className="absolute inset-0 bg-gray-900 z-0"
                          />
                        )}
                        <span className="relative z-10 capitalize flex items-center gap-3">
                          {cat === 'all' && <span className="text-lg">🍱</span>}
                          {cat === 'fruit' && <span className="text-lg">🍎</span>}
                          {cat === 'dairy' && <span className="text-lg">🧀</span>}
                          {cat === 'vegetable' && <span className="text-lg">🥦</span>}
                          {cat === 'all' ? 'All Items' : cat}
                        </span>
                        {category === cat && <CheckCircle className="w-4 h-4 text-white relative z-10" />}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4 block ml-1">Sort By</label>
                  <div className="relative group">
                    <select
                      className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3.5 px-5 pr-10 rounded-2xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer hover:bg-white"
                      onChange={(e) => setSort(e.target.value)}
                      value={sort}
                    >
                      <option value="">✨ Recommended</option>
                      <option value="low">💰 Price: Low to High</option>
                      <option value="high">💎 Price: High to Low</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                {category === 'all' ? 'Featured Products' : <span className="capitalize">{category}</span>}
              </h2>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                {filteredItems.length} results
              </span>
            </div>

            <motion.div
              layout
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    variants={itemVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col overflow-hidden relative"
                  >
                    {/* Hover Gradient Overlay */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -mr-8 -mt-8 -z-0 transition-transform group-hover:scale-150 duration-500" />

                    <div className="relative z-10 h-48 rounded-2xl mb-4 flex items-center justify-center text-7xl transition-transform duration-500 group-hover:scale-110 overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-2xl"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-2xl opacity-50" />
                          <span className="drop-shadow-2xl">{getItemIcon(item.name, item.category)}</span>
                        </>
                      )}
                    </div>

                    <div className="relative z-10 flex flex-col flex-1 px-2">
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1 opacity-70">
                        {item.category}
                      </span>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-xl text-gray-900 leading-tight mb-2 group-hover:text-indigo-700 transition-colors">
                          {item.name}
                        </h3>
                      </div>

                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400 font-medium">Price</span>
                          <span className="text-2xl font-extrabold text-gray-900">₹{item.price}</span>
                        </div>
                        <button
                          onClick={() => handleAddItem(item)}
                          className="bg-gray-900 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors shadow-lg shadow-gray-200 group-hover:scale-110 active:scale-95"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-gray-50 p-8 rounded-full mb-4">
                  <Search className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                  We couldn't find anything matching specific "{search}". Try searching properly.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b1120] text-gray-300 pt-24 pb-12 mt-20 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[40%] right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16"
          >

            {/* Brand Column */}
            <div className="md:col-span-4 space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Organic Bazzar</h3>
              </div>
              <p className="text-gray-400 leading-relaxed pr-6">
                Redefining the way you shop for groceries. Experience the freshest produce delivered with speed, care, and a touch of magic.
              </p>
              <div className="flex gap-4 pt-2">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-white hover:scale-110 transition-all cursor-pointer group">
                  <Twitter className="w-5 h-5 text-gray-400 group-hover:text-sky-400 transition-colors" />
                </div>
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-white hover:scale-110 transition-all cursor-pointer group">
                  <Facebook className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-white hover:scale-110 transition-all cursor-pointer group">
                  <Instagram className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
                </div>
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-white hover:scale-110 transition-all cursor-pointer group">
                  <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-2 space-y-6">
              <h4 className="font-bold text-white text-sm uppercase tracking-widest">Shop</h4>
              <ul className="space-y-3 text-sm">
                <li className="hover:text-indigo-400 cursor-pointer transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> Fresh Fruits
                </li>
                <li className="hover:text-indigo-400 cursor-pointer transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> Organic Veggies
                </li>
                <li className="hover:text-indigo-400 cursor-pointer transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> Daily Essentials
                </li>
                <li className="hover:text-indigo-400 cursor-pointer transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> Discounts
                </li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-6">
              <h4 className="font-bold text-white text-sm uppercase tracking-widest">Company</h4>
              <ul className="space-y-3 text-sm">
                <li className="hover:text-indigo-400 cursor-pointer transition-colors">Our Story</li>
                <li className="hover:text-indigo-400 cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-indigo-400 cursor-pointer transition-colors">Terms of Service</li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="md:col-span-4 space-y-6">
              <h4 className="font-bold text-white text-sm uppercase tracking-widest">Stay Updated</h4>
              <p className="text-gray-400 text-sm">Subscribe to our newsletter for exclusive deals and recipes.</p>
              <div className="relative group">
                <input
                  type="email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all pr-24"
                  placeholder="your@email.com"
                />
                <button className="absolute right-1 top-1 bottom-1 bg-indigo-600 text-white px-4 rounded-lg text-xs font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
                  Subscribe
                </button>
              </div>
              <div className="pt-4">
                <p className="text-xs text-gray-500 mb-2">We accept</p>
                <div className="flex gap-3 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                  {/* Visa */}
                  <div className="h-8 w-12 bg-white/5 rounded flex items-center justify-center p-1 border border-white/10">
                    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.89 31.86h-3.03l1.9-11.85h3.03l-1.9 11.85z" fill="#fff" />
                      <path d="M30.64 12.63c-3.56 0-6.07 1.86-6.10 4.5-.03 2.12 1.96 3.29 3.46 4.02 1.53.74 2.05 1.22 2.05 1.89 0 1.02-1.25 1.48-2.4 1.48-1.6 0-2.46-.24-3.77-.82l-.53-.25-.56 3.49c.94.42 2.68.79 4.49.79 4.24 0 7.02-2.06 7.05-5.25.02-1.75-1.06-3.09-3.38-4.2-1.4-.73-2.27-1.22-2.27-1.96 0-.67.76-1.36 2.42-1.36 1.36 0 2.36.29 3.12.62l.37.18.55-3.41c-.76-.28-2.02-.54-3.48-.54" fill="#fff" />
                      <path d="M40.23 29.83l-2.73-13.43c-.11-.5-.45-1.42-1.89-2.02l6.09 15.45h-1.47zM35.03 20.01h-2.31c-.72 0-1.27.21-1.58.94l-5.63 13.39h3.2l.64-1.76h3.92l.37 1.76h2.82l-1.43-14.33z" fill="#fff" />
                      <path d="M7.42 12.63L.15 31.86h3.18l.58-3.18H9.3l.53 3.18h2.81l4.13-19.23H7.42zm1.2 5.14l1.69 8.23H5.97L7.04 17.8c.24-1.06.49-1.99.64-2.88l.38.99.39-1.02.17.88z" fill="#fff" />
                    </svg>
                  </div>
                  {/* Mastercard */}
                  <div className="h-8 w-12 bg-white/5 rounded flex items-center justify-center p-1 border border-white/10">
                    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="9" cy="12" r="7" fill="#EB001B" fillOpacity="0.8" />
                      <circle cx="15" cy="12" r="7" fill="#F79E1B" fillOpacity="0.8" />
                    </svg>
                  </div>
                  {/* Amex */}
                  <div className="h-8 w-12 bg-[#006fcf] rounded flex items-center justify-center p-1 border border-white/10">
                    <span className="text-[8px] font-bold text-white tracking-tighter leading-none text-center">AMERICAN<br />EXPRESS</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>© 2024 Organic Bazzar Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Cookies</span>
            </div>
          </div>
        </div>
      </footer >

      {/* Cart Drawer Overlay */}
      {
        isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60]"
            onClick={() => setIsCartOpen(false)}
          />
        )
      }

      {/* Cart Drawer */}
      <div className={clsx(
        "fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white z-[61] shadow-2xl transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col border-l border-gray-100",
        isCartOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
              Your Cart
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{items.length} items</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={() => dispatch(undoLastAction())}
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors group"
                title="Undo Last Action"
              >
                <RotateCcw className="w-5 h-5 group-hover:-rotate-90 transition-transform duration-300" />
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-indigo-50/50 rounded-full flex items-center justify-center animate-bounce-slow">
                <ShoppingCart className="w-10 h-10 text-indigo-200" />
              </div>
              <div className="space-y-2 max-w-xs">
                <h3 className="font-bold text-gray-900 text-lg">Your cart is empty</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Looks like you haven't added anything yet.
                  Go ahead and explore our fresh produce!
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-shadow shadow-lg shadow-indigo-200 active:scale-95"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {items.map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm group hover:shadow-md transition-shadow"
                >
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-gray-100 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      getItemIcon(item.name, item.category)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-900 truncate pr-2 text-lg">{item.name}</h4>
                      <span className="font-bold text-indigo-600">₹{item.price}</span>
                    </div>
                    <p className="text-sm text-gray-500 capitalize bg-gray-100 inline-block px-2 py-0.5 rounded-full">{item.category}</p>
                  </div>
                  <button
                    onClick={() => dispatch(removeItem(item.id))}
                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    title="Remove Item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-20">
            <div className="space-y-4">
              {/* Coupon */}
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <div className="flex gap-2">
                  <input
                    value={tempCoupon}
                    onChange={(e) => setTempCoupon(e.target.value)}
                    placeholder="Promo Code"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all uppercase placeholder:normal-case font-medium"
                  />
                  <button
                    onClick={() => dispatch(applyCoupon(tempCoupon))}
                    className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-colors active:scale-95"
                  >
                    Apply
                  </button>
                </div>
                {couponCode && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-6 right-0 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1"
                  >
                    <CheckCircle className="w-3 h-3" /> Code Applied: {couponCode}
                  </motion.div>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-dashed border-gray-200">
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                {thresholdDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Bulk Discount (10%)</span>
                    <span>-₹{thresholdDiscount.toFixed(2)}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-indigo-600 font-medium">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Promocode Discount</span>
                    <span>-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-end pt-2">
                  <span className="text-gray-500 font-medium">Total Payable</span>
                  <span className="text-3xl font-extrabold text-gray-900 tracking-tight">₹{payable.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">Proceed to Checkout <ChevronDown className="w-5 h-5 -rotate-90 group-hover:translate-x-1 transition-transform" /></span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}
