import { Link } from "react-router-dom";

export default function MarketPage() {
  return (
    <>
      <div className="flex min-h-screen">
        {/*  Left Sidebar  */}
        <aside className="w-20 md:w-24 bg-onyx border-r-4 border-black flex flex-col items-center py-8 sticky top-0 h-screen shrink-0">
          <div className="mb-12">
            <Link to="/" className="block w-12 h-12 bg-primary border-4 border-black flex items-center justify-center neubrutalism-shadow-sm">
              <span className="material-symbols-outlined text-black font-bold">
                bolt
              </span>
            </Link>
          </div>
          <div className="flex-1 flex items-center justify-center" />
          <div className="mt-8 flex flex-col gap-6 text-slate-400">
            <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">
              dashboard
            </span>
            <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">
              analytics
            </span>
            <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">
              account_balance_wallet
            </span>
            <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">
              settings
            </span>
          </div>
        </aside>
        {/*  Main Content Wrapper  */}
        <div className="flex flex-1 flex-col lg:flex-row">
          {/*  Main Content Area  */}
          <main className="flex-1 p-6 md:p-10 bg-background-light dark:bg-background-dark">
            {/*  Header / Breadcrumb  */}
            <nav className="flex items-center gap-3 text-sm font-bold uppercase mb-8">
              <Link className="text-slate-500 hover:text-primary" to="/">
                Markets
              </Link>
              <span className="material-symbols-outlined text-xs">
                arrow_forward_ios
              </span>
              <span className="text-secondary">GPT-5 Release</span>
            </nav>
            {/*  Market Title  */}
            <section className="mb-10">
              <h2 className="text-4xl md:text-6xl font-black leading-none mb-6 tracking-tighter uppercase italic">
                WILL GPT-5 RELEASE <br /> BEFORE{" "}
                <span className="text-primary bg-black px-2">Q4 2024?</span>
              </h2>
              <div className="flex flex-wrap gap-4">
                <div className="bg-primary text-black px-4 py-2 border-4 border-black font-mono font-bold neubrutalism-shadow-sm">
                  VOL: $1.2M
                </div>
                <div className="bg-secondary text-white px-4 py-2 border-4 border-black font-mono font-bold neubrutalism-shadow-sm">
                  ENDS IN 12D
                </div>
                <div className="bg-black text-white px-4 py-2 border-4 border-black font-mono font-bold neubrutalism-shadow-sm">
                  TECH
                </div>
              </div>
            </section>
            {/*  Chart Section  */}
            <section className="mb-10 border-4 border-black bg-white dark:bg-onyx p-6 neubrutalism-shadow">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-sm font-bold uppercase text-slate-500">
                    Current Probability
                  </p>
                  <p className="text-5xl font-black font-mono text-primary">
                    68.42%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold uppercase text-slate-500">
                    24H Change
                  </p>
                  <p className="text-2xl font-black font-mono text-green-500">
                    +4.12%
                  </p>
                </div>
              </div>
              <div className="relative h-64 w-full bg-slate-100 dark:bg-black/40 border-2 border-black overflow-hidden mb-4">
                {/*  Grid Lines  */}
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className={`${i % 6 !== 5 ? "border-r" : ""} ${
                        i < 18 ? "border-b" : ""
                      } border-black/10`}
                    />
                  ))}
                </div>
                {/*  SVG Line Graph  */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 1000 256"
                >
                  <path
                    d="M0,200 Q100,180 200,210 T400,150 T600,100 T800,80 T1000,60"
                    fill="none"
                    stroke="#CCFF00"
                    strokeWidth="6"
                  />
                  <path
                    d="M0,200 Q100,180 200,210 T400,150 T600,100 T800,80 T1000,60 V256 H0 Z"
                    fill="url(#limeGradient)"
                    fillOpacity="0.2"
                  />
                  <defs>
                    <linearGradient
                      id="limeGradient"
                      x1="0%"
                      x2="0%"
                      y1="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#CCFF00" />
                      <stop offset="100%" stopColor="#CCFF00" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex justify-between font-mono text-xs font-bold uppercase text-slate-500">
                <span>May 01</span>
                <span>May 08</span>
                <span>May 15</span>
                <span>May 22</span>
                <span>Today</span>
              </div>
            </section>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-4 border-black p-6 bg-white dark:bg-onyx neubrutalism-shadow-sm">
                <h3 className="text-xl font-black uppercase mb-4">
                  Market Rules
                </h3>
                <p className="text-sm font-medium leading-relaxed">
                  This market will resolve to "Yes" if OpenAI officially
                  announces and releases GPT-5 or its equivalent next-generation
                  frontier model before 11:59 PM PT on Sept 30, 2024. Limited
                  beta access counts as a release.
                </p>
              </div>
              <div className="border-4 border-black p-6 bg-secondary text-white neubrutalism-shadow-sm">
                <h3 className="text-xl font-black uppercase mb-4">
                  Activity Log
                </h3>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-white/20 pb-1">
                    <span>0x4f...2a bought YES</span>
                    <span>$420.00</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 pb-1">
                    <span>Whale_Alert bought NO</span>
                    <span>$2,500.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>0x91...bc bought YES</span>
                    <span>$15.00</span>
                  </div>
                </div>
              </div>
            </section>
          </main>
          {/*  Right Sidebar: Trade & Position  */}
          <aside className="w-full lg:w-96 p-6 md:p-10 bg-white dark:bg-onyx border-l-0 lg:border-l-4 border-black sticky top-0 h-auto lg:h-screen flex flex-col gap-8">
            {/*  Trade Panel  */}
            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                Trade Position
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-primary text-black border-4 border-black py-4 font-black text-xl uppercase neubrutalism-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                  YES
                </button>
                <button className="bg-black text-white border-4 border-black py-4 font-black text-xl uppercase neubrutalism-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                  NO
                </button>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold uppercase">
                  Amount (USDC)
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-slate-100 dark:bg-black border-4 border-black p-4 font-mono text-2xl font-bold focus:ring-0 focus:border-secondary outline-none"
                    placeholder="0.00"
                    type="text"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400">
                    MAX
                  </span>
                </div>
              </div>
              <div className="bg-slate-100 dark:bg-black border-4 border-black p-4 space-y-3">
                <div className="flex justify-between text-sm font-bold uppercase">
                  <span className="text-slate-500">Shares</span>
                  <span className="font-mono">512.24</span>
                </div>
                <div className="flex justify-between text-sm font-bold uppercase">
                  <span className="text-slate-500">Potential Payout</span>
                  <span className="font-mono text-primary">$842.10</span>
                </div>
              </div>
              <button className="w-full bg-secondary text-white border-4 border-black py-5 font-black text-2xl uppercase neubrutalism-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                Buy Shares
              </button>
            </div>
            {/*  Your Position  */}
            <div className="pt-8 border-t-4 border-black space-y-4">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                Your Position
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b-2 border-black pb-2">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">
                      Holding
                    </p>
                    <p className="text-xl font-black font-mono">1,200 YES</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase text-slate-500">
                      Value
                    </p>
                    <p className="text-xl font-black font-mono text-primary">
                      $720.00
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">
                      Avg. Price
                    </p>
                    <p className="text-lg font-black font-mono">$0.45</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase text-slate-500">
                      Return
                    </p>
                    <p className="text-lg font-black font-mono text-green-500">
                      +22.4%
                    </p>
                  </div>
                </div>
                <button className="w-full border-4 border-black py-2 font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors">
                  Sell Position
                </button>
              </div>
            </div>
            {/*  Footer Stats  */}
            <div className="mt-auto pt-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full border-2 border-black bg-primary flex items-center justify-center neubrutalism-shadow-sm overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt="User profile avatar"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSPgIIrZf9SxVuZareDQ_0loMnWpQ0N78tKdOdz4bz6mUVdey43LZD7iFUZ--ynleXOTWzv_FI4mWu2rvVhR-pGG6mKRzncunxgxkpLjNPjqF8qv3Gus6846EHkEwV8mBwRGbt8lLaiw0VOcCThT5kNsK40EueLnGetCumLyX6Z8C8oqEF9dMhYlK1ZqgnhFp2JAWjPNeD4S4GA9iB1_mN_P8xKhKvo4p2zwEryOpxGudGJDwfKzYegm1KT4PZaB1w7jdAE8yYiCqE"
                  />
                </div>
                <div>
                  <p className="text-xs font-black uppercase leading-none">
                    Balance
                  </p>
                  <p className="text-sm font-mono font-bold">$12,450.21</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-black dark:text-white cursor-pointer hover:text-primary transition-colors">
                notifications
              </span>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
