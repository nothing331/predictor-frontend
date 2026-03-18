import AppSidebar from "../components/AppSidebar";

const categories = ["All", "Politics", "Tech", "Sports", "Crypto"];

const markets = [
  {
    category: "Tech",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA69toKJ_WjQEpY9ggv2n16cMi32jvX3d7bne-VRyhaek1U70YSfL83hok9FD-kHho8hMXtXJ62FTtwDozjeUXmv5vS-nmCYi5MlpikHD-VnmRurPfxilRWx8x-VE96-tSAS7BQ78inX1W6Ovi2NMhgR2l3lCKIwRuyE1kesIcFbKNAuyaaYqjZxXbJ8mpWNzdrKA-It8QIyR5O4bSYuxiIMvVRKG4xbi-4lF31uFjr9edEtLdWndUcA9_xfxO1FmYw6xdjFIjWU2Go",
    title: "Will OpenAI announce GPT-5 before June 2025?",
    volume: "$2.4M vol",
    probability: 68,
    probabilityTone: "text-primary",
    yesLabel: "Yes $0.68",
    noLabel: "No $0.32",
  },
  {
    category: "Politics",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBNfidmuRF12FQQGLJ7J2t-m-Y8TP0F3c1EFgvcnPCIh63IFhoviWfsUnnMUaUVh8kn5yE1p32ADDxkOoq-qg6FfvAwyfivFLTL_76V5JWWf1YOjv7f-4t4O9btz_ooM0qHDjhCQfmiz54faG0k01qu1s3JjBJhdeK0JptE7rfalNRkp-8IVP-LU30fzzdhVoJNJmn3cTh0Nyhi13CSSJLw18aDFN-KBf4NAIl5vSS4mcsonbIKdDs5EPUF4-VWrB3rZUI8CV8Luk8c",
    title: "Who will win the next presidential election cycle?",
    volume: "$18.9M vol",
    probability: 42,
    probabilityTone: "text-secondary",
    yesLabel: "Buy Reform",
    noLabel: "Buy Status Quo",
  },
  {
    category: "Sports",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDM6kPfDW9rBViTCWJwmm9GYC0d9rFJ3_V_XFNuV_SyC7LKOup3NFTTYiWIYSaGtuFAVRsR3m3IGjqIXOw_0UQAKvG0EqzWkD0hk2-sBkCEK57snWA3ZX1H66fWVmrrzNT3cnNhbylyglSFgc5oSqm427z2d2OEDZAjN8wPR26zOAupN8rkQ1DmoMkDvHYbvtxpfjo33R-xwh-PEguAxKmJvqa8edm0O2TSJ143TVtr7N1dT4jCFFVtu6WtZsTu5FmewM7-5IGZZN80",
    title: "Will the Lakers make the playoffs this season?",
    volume: "$500K vol",
    probability: 15,
    probabilityTone: "text-primary",
    yesLabel: "Yes $0.15",
    noLabel: "No $0.85",
  },
];

const portfolioRows = [
  {
    market: "GPT-5 Announcement",
    position: "Yes (1,200 shares)",
    value: "$816.00",
    change: "+12.4%",
    changeTone: "status-positive",
    badgeClass: "border-[color:var(--color-accent-green)] bg-[color:rgba(61,215,168,0.14)] text-accent-green",
  },
  {
    market: "Election Reform Market",
    position: "No (500 shares)",
    value: "$290.00",
    change: "-4.2%",
    changeTone: "status-negative",
    badgeClass: "border-[color:var(--color-accent-red)] bg-[color:rgba(255,100,116,0.14)] text-accent-red",
  },
];

export default function HomePage() {
  return (
    <div className="page-shell">
      <div className="page-content">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <AppSidebar />

          <main className="flex flex-col gap-6">
            <section className="app-panel app-panel-strong p-5 md:p-8">
              <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <p className="eyebrow">Forecast Desk</p>
                    <h1 className="display-title">
                      Trade the signal.
                      <br />
                      Ignore the noise.
                    </h1>
                    <p className="max-w-2xl text-base leading-relaxed text-[color:var(--text-muted)] md:text-lg">
                      PredictKaro turns every market into one consistent trading
                      desk, with fast reads, shared conviction, and cleaner dark
                      mode across the entire product.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
                    <label className="app-panel field-shell">
                      <span className="material-symbols-outlined">search</span>
                      <input
                        className="app-input uppercase"
                        placeholder="Search markets, creators, or topics"
                        type="text"
                      />
                    </label>

                    <button className="action-primary">
                      <span className="material-symbols-outlined">local_fire_department</span>
                      Trending now
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                  <div className="app-panel metric-card">
                    <span className="eyebrow">Open Interest</span>
                    <span className="metric-value text-primary">$94.2M</span>
                    <span className="muted-copy text-sm">
                      Across 218 active markets
                    </span>
                  </div>
                  <div className="app-panel metric-card">
                    <span className="eyebrow">Hit Rate</span>
                    <span className="metric-value text-secondary">72%</span>
                    <span className="muted-copy text-sm">
                      Top traders this week
                    </span>
                  </div>
                  <div className="app-panel metric-card">
                    <span className="eyebrow">Settlement Speed</span>
                    <span className="metric-value">&lt; 3 min</span>
                    <span className="muted-copy text-sm">
                      Median market resolution
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <button
                  key={category}
                  className={`chip ${
                    index === 0 ? "chip-primary" : "chip-soft"
                  }`}
                >
                  {category}
                </button>
              ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
              {markets.map((market) => (
                <article key={market.title} className="app-panel market-card">
                  <div
                    className="market-cover"
                    style={{ backgroundImage: `url("${market.image}")` }}
                  />

                  <div className="flex grow flex-col gap-5 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`chip ${
                          market.category === "Politics"
                            ? "chip-secondary"
                            : "chip-primary"
                        }`}
                      >
                        {market.category}
                      </span>
                      <span className="eyebrow text-right">{market.volume}</span>
                    </div>

                    <h2 className="section-title !text-[2rem] leading-[0.92]">
                      {market.title}
                    </h2>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="eyebrow">Probability</span>
                        <span className={`font-mono text-lg font-semibold ${market.probabilityTone}`}>
                          {market.probability}%
                        </span>
                      </div>
                      <div className="probability-track">
                        <div
                          className="probability-fill"
                          style={{ width: `${market.probability}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-auto grid gap-3 sm:grid-cols-2">
                      <button className="action-primary">{market.yesLabel}</button>
                      <button className="action-secondary">{market.noLabel}</button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <section className="app-panel p-5 md:p-8">
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="eyebrow mb-2">Portfolio Snapshot</p>
                  <h2 className="section-title">Your live positions</h2>
                </div>
                <span className="chip chip-soft">2 markets in profit</span>
              </div>

              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Market</th>
                      <th>Position</th>
                      <th>Value</th>
                      <th>Change</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioRows.map((row) => (
                      <tr key={row.market}>
                        <td className="font-semibold">{row.market}</td>
                        <td>
                          <span
                            className={`chip ${row.badgeClass}`}
                          >
                            {row.position}
                          </span>
                        </td>
                        <td className="font-mono font-semibold">{row.value}</td>
                        <td className={`font-mono font-semibold ${row.changeTone}`}>
                          {row.change}
                        </td>
                        <td className="text-right">
                          <button className="action-ghost !px-4 !py-2">
                            Sell
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
