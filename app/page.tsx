import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/*  Sidebar Navigation  */}
        <aside className="w-72 border-r-4 border-black bg-white dark:bg-background-dark flex flex-col p-6 gap-8 z-20">
          <div className="flex flex-col gap-2">
            <div className="size-12 bg-primary neubrutal-border shadow-neubrutal flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-black font-bold">
                bolt
              </span>
            </div>
            <h2 className="text-3xl font-black leading-none slanted-display italic tracking-tighter">
              PREDICT
              <br />
              FUTURE
              <br />
              FOR FUN
            </h2>
          </div>
          <nav className="flex flex-col gap-4 grow">
            <button className="flex items-center gap-4 p-3 bg-primary text-black font-bold neubrutal-border shadow-neubrutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              <span className="material-symbols-outlined">explore</span>
              <span>Markets</span>
            </button>
            <button className="flex items-center gap-4 p-3 font-bold border-4 border-transparent hover:border-black transition-all">
              <span className="material-symbols-outlined">
                account_balance_wallet
              </span>
              <span>Portfolio</span>
            </button>
            <button className="flex items-center gap-4 p-3 font-bold border-4 border-transparent hover:border-black transition-all">
              <span className="material-symbols-outlined">leaderboard</span>
              <span>Rankings</span>
            </button>
            <button className="flex items-center gap-4 p-3 font-bold border-4 border-transparent hover:border-black transition-all">
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </button>
          </nav>
          <div className="flex flex-col gap-4 pt-6 border-t-4 border-black">
            <button className="w-full py-4 bg-secondary text-white font-black uppercase tracking-widest neubrutal-border shadow-neubrutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              Create Market
            </button>
            <div className="flex items-center gap-3 p-2 bg-slate-100 dark:bg-slate-900 neubrutal-border">
              <div
                className="size-10 rounded-full bg-cover border-2 border-black"
                data-alt="User profile avatar with colorful geometric pattern"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCL38SGZk--t58uopcrcW8T7VXiwfhTXlgKX8VCsQnpqd8wXUKPxVvgLHeID51mLXCmWxCZVueyE-5Tcra7mZ8HFjTGiaK8q_V2MjwdJf5r8jEogiHeUjjt1GLE91ItmvJVvrZhSlnHh-SJPYjOJ8d1iQUIjEeKARVMagjr4VcgxQzYsZULiVYmw-Eku1VyjMUW6ISeHimttml7qfJ-XF3AUnmbhEmSzArE9a0bfxQMCsAvkIpmn5AQZHOrATpAxEYcYno204FLd3hl')",
                }}
              ></div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold uppercase opacity-60">
                  Balance
                </span>
                <span className="text-lg font-black text-primary">
                  $12,450.00
                </span>
              </div>
            </div>
          </div>
        </aside>
        {/*  Main Content Area  */}
        <main className="flex-1 overflow-y-auto bg-[#f0f0f0] dark:bg-[#1a1a1a] p-8">
          {/*  Header/Search  */}
          <header className="flex justify-between items-center mb-12">
            <div className="relative w-full max-w-xl">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-black neubrutal-border shadow-neubrutal focus:ring-0 focus:outline-none font-bold placeholder:text-slate-500 uppercase"
                placeholder="SEARCH THE FUTURE..."
                type="text"
              />
            </div>
            <div className="flex gap-4">
              <div className="px-6 py-3 bg-white dark:bg-black neubrutal-border shadow-neubrutal font-black flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">
                  local_fire_department
                </span>
                TRENDING
              </div>
            </div>
          </header>
          {/*  Categories Tabs  */}
          <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
            <button className="px-8 py-2 bg-black text-white font-black neubrutal-border">
              ALL
            </button>
            <button className="px-8 py-2 bg-white dark:bg-slate-800 font-bold neubrutal-border hover:bg-primary hover:text-black transition-colors">
              POLITICS
            </button>
            <button className="px-8 py-2 bg-white dark:bg-slate-800 font-bold neubrutal-border hover:bg-primary hover:text-black transition-colors">
              TECH
            </button>
            <button className="px-8 py-2 bg-white dark:bg-slate-800 font-bold neubrutal-border hover:bg-primary hover:text-black transition-colors">
              SPORTS
            </button>
            <button className="px-8 py-2 bg-white dark:bg-slate-800 font-bold neubrutal-border hover:bg-primary hover:text-black transition-colors">
              CRYPTO
            </button>
          </div>
          {/*  Market Grid  */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/*  Card 1: Tech/AI  */}
            <div className="bg-white dark:bg-slate-900 neubrutal-border shadow-neubrutal flex flex-col">
              <div
                className="h-48 bg-cover bg-center border-b-4 border-black"
                data-alt="Abstract neural network representation in neon colors"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA69toKJ_WjQEpY9ggv2n16cMi32jvX3d7bne-VRyhaek1U70YSfL83hok9FD-kHho8hMXtXJ62FTtwDozjeUXmv5vS-nmCYi5MlpikHD-VnmRurPfxilRWx8x-VE96-tSAS7BQ78inX1W6Ovi2NMhgR2l3lCKIwRuyE1kesIcFbKNAuyaaYqjZxXbJ8mpWNzdrKA-It8QIyR5O4bSYuxiIMvVRKG4xbi-4lF31uFjr9edEtLdWndUcA9_xfxO1FmYw6xdjFIjWU2Go')",
                }}
              ></div>
              <div className="p-6 flex flex-col grow">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-secondary text-white text-xs font-black uppercase neubrutal-border">
                    TECH
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    $2.4M VOL
                  </span>
                </div>
                <h3 className="text-2xl font-black leading-tight mb-6 grow">
                  WILL OPENAI ANNOUNCE GPT-5 BEFORE JUNE 2025?
                </h3>
                {/*  Probability Bar  */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm font-black mb-2 uppercase">
                    <span>Probability</span>
                    <span className="text-primary">68%</span>
                  </div>
                  <div className="w-full h-6 bg-slate-200 dark:bg-slate-800 neubrutal-border p-1">
                    <div className="h-full bg-primary"></div>
                  </div>
                </div>
                {/*  Betting Buttons  */}
                <div className="grid grid-cols-2 gap-4">
                  <button className="py-3 bg-accent-green text-black font-black uppercase neubrutal-border shadow-neubrutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    YES $0.68
                  </button>
                  <button className="py-3 bg-accent-red text-white font-black uppercase neubrutal-border shadow-neubrutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    NO $0.32
                  </button>
                </div>
              </div>
            </div>
            {/*  Card 2: Politics  */}
            <div className="bg-white dark:bg-slate-900 neubrutal-border shadow-neubrutal flex flex-col">
              <div
                className="h-48 bg-cover bg-center border-b-4 border-black"
                data-alt="Blurred government building with dramatic lighting"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBNfidmuRF12FQQGLJ7J2t-m-Y8TP0F3c1EFgvcnPCIh63IFhoviWfsUnnMUaUVh8kn5yE1p32ADDxkOoq-qg6FfvAwyfivFLTL_76V5JWWf1YOjv7f-4t4O9btz_ooM0qHDjhCQfmiz54faG0k01qu1s3JjBJhdeK0JptE7rfalNRkp-8IVP-LU30fzzdhVoJNJmn3cTh0Nyhi13CSSJLw18aDFN-KBf4NAIl5vSS4mcsonbIKdDs5EPUF4-VWrB3rZUI8CV8Luk8c')",
                }}
              ></div>
              <div className="p-6 flex flex-col grow">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-primary text-black text-xs font-black uppercase neubrutal-border">
                    POLITICS
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    $18.9M VOL
                  </span>
                </div>
                <h3 className="text-2xl font-black leading-tight mb-6 grow">
                  WHO WILL WIN THE 2024 PRESIDENTIAL ELECTION?
                </h3>
                {/*  Probability Bar  */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm font-black mb-2 uppercase">
                    <span>Probability</span>
                    <span className="text-secondary">42%</span>
                  </div>
                  <div className="w-full h-6 bg-slate-200 dark:bg-slate-800 neubrutal-border p-1">
                    <div className="h-full bg-secondary"></div>
                  </div>
                </div>
                {/*  Betting Buttons  */}
                <div className="grid grid-cols-2 gap-4">
                  <button className="py-3 bg-accent-green text-black font-black uppercase neubrutal-border shadow-neubrutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    BUY CAND A
                  </button>
                  <button className="py-3 bg-accent-red text-white font-black uppercase neubrutal-border shadow-neubrutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    BUY CAND B
                  </button>
                </div>
              </div>
            </div>
            {/*  Card 3: Sports  */}
            <div className="bg-white dark:bg-slate-900 neubrutal-border shadow-neubrutal flex flex-col">
              <div
                className="h-48 bg-cover bg-center border-b-4 border-black"
                data-alt="High-speed motion blur of a basketball game"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDM6kPfDW9rBViTCWJwmm9GYC0d9rFJ3_V_XFNuV_SyC7LKOup3NFTTYiWIYSaGtuFAVRsR3m3IGjqIXOw_0UQAKvG0EqzWkD0hk2-sBkCEK57snWA3ZX1H66fWVmrrzNT3cnNhbylyglSFgc5oSqm427z2d2OEDZAjN8wPR26zOAupN8rkQ1DmoMkDvHYbvtxpfjo33R-xwh-PEguAxKmJvqa8edm0O2TSJ143TVtr7N1dT4jCFFVtu6WtZsTu5FmewM7-5IGZZN80')",
                }}
              ></div>
              <div className="p-6 flex flex-col grow">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-[#FFD700] text-black text-xs font-black uppercase neubrutal-border">
                    SPORTS
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    $500K VOL
                  </span>
                </div>
                <h3 className="text-2xl font-black leading-tight mb-6 grow">
                  WILL THE LAKERS MAKE THE PLAYOFFS THIS SEASON?
                </h3>
                {/*  Probability Bar  */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm font-black mb-2 uppercase">
                    <span>Probability</span>
                    <span className="text-primary">15%</span>
                  </div>
                  <div className="w-full h-6 bg-slate-200 dark:bg-slate-800 neubrutal-border p-1">
                    <div className="h-full bg-primary"></div>
                  </div>
                </div>
                {/*  Betting Buttons  */}
                <div className="grid grid-cols-2 gap-4">
                  <button className="py-3 bg-accent-green text-black font-black uppercase neubrutal-border shadow-neubrutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    YES $0.15
                  </button>
                  <button className="py-3 bg-accent-red text-white font-black uppercase neubrutal-border shadow-neubrutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    NO $0.85
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/*  Integrated Portfolio Section  */}
          <section className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-4xl font-black slanted-display italic uppercase">
                Your Portfolio
              </h2>
              <div className="h-1 grow bg-black dark:bg-white/20"></div>
            </div>
            <div className="bg-white dark:bg-black neubrutal-border shadow-neubrutal-purple overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-4 border-black bg-slate-50 dark:bg-slate-900">
                    <th className="p-4 font-black uppercase italic">Market</th>
                    <th className="p-4 font-black uppercase italic">
                      Position
                    </th>
                    <th className="p-4 font-black uppercase italic">Value</th>
                    <th className="p-4 font-black uppercase italic">Change</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black/10 dark:divide-white/10">
                  <tr>
                    <td className="p-4 font-bold">GPT-5 Announcement</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-accent-green/20 text-accent-green text-xs font-black uppercase border-2 border-accent-green">
                        YES (1,200 Shares)
                      </span>
                    </td>
                    <td className="p-4 font-black">$816.00</td>
                    <td className="p-4 font-black text-accent-green">+12.4%</td>
                    <td className="p-4 text-right">
                      <button className="px-4 py-2 bg-black text-white text-xs font-black uppercase neubrutal-border">
                        Sell
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">
                      2024 Presidential Election
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-accent-red/20 text-accent-red text-xs font-black uppercase border-2 border-accent-red">
                        NO (500 Shares)
                      </span>
                    </td>
                    <td className="p-4 font-black">$290.00</td>
                    <td className="p-4 font-black text-accent-red">-4.2%</td>
                    <td className="p-4 text-right">
                      <button className="px-4 py-2 bg-black text-white text-xs font-black uppercase neubrutal-border">
                        Sell
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
