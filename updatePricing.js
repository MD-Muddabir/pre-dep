const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/landing/Pricing.jsx', 'utf8');

const psReplacement = `const ps = {
    wrap: { padding: '80px 0', background: 'var(--lp-bg, #0F172A)', position: 'relative' },
    inner: { maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' },
    header: { textAlign: 'center', marginBottom: '3.5rem' },
    eyebrow: { display: 'inline-block', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', color: 'var(--lp-primary, #6366f1)', marginBottom: '0.75rem' },
    h2: { fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 800, color: 'var(--lp-text, #fff)', lineHeight: 1.15, marginBottom: '1rem' },
    sub: { fontSize: '1.1rem', color: 'var(--lp-muted, #94a3b8)', maxWidth: '600px', margin: '0 auto' },
    controls: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '3rem' },
    tabGroup: { display: 'flex', background: 'var(--lp-surface, rgba(255,255,255,0.04))', border: '1px solid var(--lp-border, rgba(255,255,255,0.06))', borderRadius: '12px', padding: '4px', gap: '4px' },
    tab: (active) => ({ padding: '9px 20px', border: 'none', borderRadius: '8px', background: active ? 'var(--lp-primary, #6366f1)' : 'transparent', color: active ? '#fff' : 'var(--lp-muted, #94a3b8)', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.22s', whiteSpace: 'nowrap' }),
    
    // NEW GRID & CARDS
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem', alignItems: 'stretch' },
    card: (isFirst, popular) => ({ 
        background: isFirst ? 'var(--lp-primary, #6366f1)' : 'var(--lp-surface, rgba(255,255,255,0.03))', 
        border: \`1px solid \${isFirst ? 'transparent' : 'var(--lp-border, rgba(255,255,255,0.06))'}\`, 
        borderRadius: '16px', 
        padding: '2rem 1.5rem', 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        transition: 'transform 0.2s ease, box-shadow 0.2s ease', 
        boxShadow: popular && !isFirst ? '0 0 0 1px var(--lp-primary, #6366f1), 0 10px 30px rgba(99,102,241,0.1)' : 'var(--lp-shadow-sm, none)',
        cursor: 'default'
    }),
    planHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', height: '24px' },
    planName: (isFirst) => ({ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: isFirst ? 'rgba(255,255,255,0.9)' : 'var(--lp-muted, #94a3b8)' }),
    badgePopular: { background: 'rgba(255,255,255,0.1)', color: 'var(--lp-text, #fff)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.65rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.5px', textTransform: 'uppercase' },
    priceBlock: { marginBottom: '1.75rem', display: 'flex', alignItems: 'baseline' },
    currency: (isFirst) => ({ fontSize: '1.2rem', color: isFirst ? 'rgba(255,255,255,0.9)' : 'var(--lp-text, #fff)', fontWeight: 700, marginRight: '2px' }),
    amount: (isFirst) => ({ fontSize: '2.8rem', fontWeight: 800, color: isFirst ? '#fff' : 'var(--lp-text, #fff)', lineHeight: 1 }),
    period: (isFirst) => ({ fontSize: '0.9rem', color: isFirst ? 'rgba(255,255,255,0.8)' : 'var(--lp-muted, #94a3b8)', marginLeft: '4px' }),
    featureList: { listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' },
    featureItem: (isFirst) => ({ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: isFirst ? 'rgba(255,255,255,0.95)' : 'var(--lp-text, #e2e8f0)', lineHeight: 1.4 }),
    checkIcon: (isFirst) => ({ color: isFirst ? '#fff' : 'var(--lp-primary, #6366f1)', fontSize: '1.1rem', lineHeight: 1 }),
    ctaBtn: (isFirst, isEnterprise, popular) => {
        const base = { width: '100%', padding: '14px', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', marginTop: 'auto' };
        if (isFirst) return { ...base, background: '#fff', color: 'var(--lp-primary, #6366f1)' };
        if (popular) return { ...base, background: 'var(--lp-primary, #6366f1)', color: '#fff' };
        return { ...base, background: 'transparent', border: '1px solid var(--lp-border, rgba(255,255,255,0.2))', color: 'var(--lp-text, #fff)' };
    },
    viewLink: (isFirst) => ({ display: 'block', textAlign: 'center', fontSize: '0.77rem', color: isFirst ? 'rgba(255,255,255,0.8)' : 'var(--lp-muted, #94a3b8)', cursor: 'pointer', background: 'none', border: 'none', width: '100%', padding: '6px 0', marginTop: '10px' }),
    compareRow: { textAlign: 'center', padding: '0.5rem 0 2.5rem' },
    compareBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--lp-surface, rgba(255,255,255,0.03))', border: '1px solid var(--lp-border, rgba(255,255,255,0.06))', color: 'var(--lp-text, #94a3b8)', padding: '10px 24px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.22s' },
    /* Lifetime */
    ltCard: { background: 'linear-gradient(145deg, #1e1b4b, #2e1065, #4c1d95)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '14px', padding: '2rem', position: 'relative', overflow: 'hidden', marginBottom: '2rem', boxShadow: 'var(--lp-shadow-lg, 0 10px 30px rgba(76, 29, 149, 0.15))' },
    ltBadge: { display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', fontSize: '0.67rem', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '1rem' },
    ltRow: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', position: 'relative', zIndex: 1 },
    ltInfo: { flex: 1, minWidth: '240px' },
    ltH: { fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' },
    ltP: { fontSize: '0.9rem', color: '#e2e8f0', marginBottom: '1rem' },
    ltPerks: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '6px' },
    ltPerk: { fontSize: '0.85rem', color: '#f8fafc', padding: '2px 0', display: 'flex', alignItems: 'center', gap: '6px' },
    ltBox: { minWidth: '200px', textAlign: 'center', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.5rem', position: 'relative', zIndex: 1, backdropFilter: 'blur(10px)' },
    ltPrice: { fontSize: '2.2rem', fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: '4px' },
    ltLabel: { fontSize: '0.82rem', color: '#e2e8f0', marginBottom: '1rem' },
    ltCta: { width: '100%', padding: '12px', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 16px rgba(245,158,11,0.3)', textShadow: '0 1px 2px rgba(0,0,0,0.2)' },
    /* Modal */
    overlay: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' },
    modal: { background: 'var(--lp-surface, #111827)', border: '1px solid var(--lp-border, rgba(255,255,255,0.06))', borderRadius: '16px', maxWidth: '880px', width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '2rem', position: 'relative', boxShadow: 'var(--lp-shadow-lg, none)' },
    closeBtn: { position: 'absolute', top: 14, right: 14, width: 32, height: 32, border: '1px solid var(--lp-border, rgba(255,255,255,0.08))', borderRadius: '7px', background: 'var(--lp-bg, rgba(255,255,255,0.04))', color: 'var(--lp-muted)', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
    th: { padding: '12px 12px', textAlign: 'left', color: 'var(--lp-primary, #818cf8)', fontWeight: 700, borderBottom: '1px solid var(--lp-border, rgba(255,255,255,0.06))', whiteSpace: 'nowrap', fontSize: '0.8rem', background: 'var(--lp-bg, transparent)' },
    td: { padding: '12px 12px', borderBottom: '1px solid var(--lp-border, rgba(255,255,255,0.02))', color: 'var(--lp-text, var(--lp-muted))' },
    sectionRow: { padding: '20px 12px 8px', fontWeight: 700, color: 'var(--lp-primary, #818cf8)', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '2px solid var(--lp-border, rgba(99,102,241,0.12))', background: 'var(--lp-surface, transparent)' },
    /* Trust bar */
    trustBar: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem' },
    trustItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--lp-text, var(--lp-muted))', fontWeight: 600 },
};`;

code = code.replace(/const ps = \{[\s\S]*?\};\n\n\/\* ── Feature comparison rows ── \*\//, psReplacement + '\n\n/* ── Feature comparison rows ── */');

const newGridCode = `                <style>{\`
                    .cg-pricing-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.1); }
                    .cg-pricing-card:active { transform: translateY(0) scale(0.98); }
                    html.dark-mode .cg-pricing-card:hover { box-shadow: 0 12px 30px rgba(0,0,0,0.4); }
                    .cg-pricing-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
                    .cg-pricing-btn:active { filter: brightness(0.95); transform: translateY(1px); }
                \`}</style>
                <div style={ps.grid}>
                    {filteredPlans.map((plan, index) => {
                        const price = getPrice(plan);
                        const isPopular = plan.is_popular;
                        const isTrial = plan.is_free_trial;
                        const isEnterprise = plan.contact_sales;
                        const isFirst = index === 0;

                        // Build feature list mimicking ConsentGuard
                        const features = [];
                        if (plan.max_students === -1) features.push('Unlimited students');
                        else features.push(\`Up to \${plan.max_students.toLocaleString('en-IN')} students\`);
                        
                        if (plan.max_faculty === -1) features.push('Unlimited faculty');
                        else features.push(\`Up to \${plan.max_faculty.toLocaleString('en-IN')} faculty\`);
                        
                        if (plan.feature_fees) features.push('Fee management & payments');
                        if (plan.feature_exams) features.push('Exams & marks portal');
                        if (plan.feature_announcements) features.push('Announcements & SMS');
                        if (plan.feature_mobile_app) features.push('White-labeled Mobile App');
                        else if (plan.feature_parent_portal) features.push('Parent & Student portals');
                        
                        if (plan.max_storage_mb === -1) features.push('Unlimited cloud storage');
                        else if (plan.max_storage_mb >= 5120) features.push(\`\${(plan.max_storage_mb/1024).toFixed(0)} GB cloud storage\`);

                        return (
                            <div key={plan.id} className="cg-pricing-card" style={ps.card(isFirst, isPopular)}>
                                <div style={ps.planHeader}>
                                    <div style={ps.planName(isFirst)}>{plan.name}</div>
                                    {isPopular && <div style={ps.badgePopular}>Most Popular</div>}
                                </div>

                                {isEnterprise ? (
                                    <div style={ps.priceBlock}>
                                        <span style={ps.amount(isFirst)}>Custom</span>
                                    </div>
                                ) : (
                                    <div style={ps.priceBlock}>
                                        <span style={ps.currency(isFirst)}>₹</span>
                                        <span style={ps.amount(isFirst)}>{fmt(price)}</span>
                                        <span style={ps.period(isFirst)}>/{billingCycle === 'yearly' ? 'yr' : 'mo'}</span>
                                    </div>
                                )}

                                <ul style={ps.featureList}>
                                    {features.map((f, i) => (
                                        <li key={i} style={ps.featureItem(isFirst)}>
                                            <span style={ps.checkIcon(isFirst)}>✓</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className="cg-pricing-btn"
                                    style={ps.ctaBtn(isFirst, isEnterprise, isPopular)}
                                    onClick={() => handleChoose(plan)}
                                >
                                    {isTrial || isFirst ? 'Get Started' : isEnterprise ? 'Contact Sales' : isPopular ? \`Try \${plan.name} Free\` : 'Start Free Trial'}
                                </button>
                                
                                <button style={ps.viewLink(isFirst)} onClick={() => { setModalPlan(plan); setShowModal(true); }}>
                                    View all features →
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Compare all plans */}`;

code = code.replace(/<div style=\{ps\.grid\}>[\s\S]*?<\/div>\s*\{\/\* Compare all plans \*\/\}/, newGridCode);
fs.writeFileSync('frontend/src/components/landing/Pricing.jsx', code);
