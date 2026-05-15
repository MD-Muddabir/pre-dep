/**
 * Landing Page Pricing Section
 * Uses the same professional design as PricingPage.jsx:
 * - Platform tabs (Web Only / Web + Android)
 * - Monthly / Annual billing toggle
 * - Compact cards with limit chips
 * - Feature comparison modal
 * - Lifetime plan premium banner
 */

import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

/* ── Inline styles scoped to pricing section (no CSS file conflict) ── */
const ps = {
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
    card: (isSelected) => ({
        background: isSelected ? 'linear-gradient(145deg, #1e1b4b, #2e1065, #4c1d95)' : 'var(--lp-surface, rgba(255,255,255,0.03))',
        border: `1px solid ${isSelected ? 'rgba(167,139,250,0.5)' : 'var(--lp-border, rgba(255,255,255,0.06))'}`,
        borderRadius: '16px',
        padding: '2rem 1.5rem',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        boxShadow: isSelected ? '0 10px 30px rgba(76, 29, 149, 0.4)' : 'var(--lp-shadow-sm, none)',
        cursor: 'pointer'
    }),
    planHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', height: '24px' },
    planName: (isSelected) => ({ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: isSelected ? 'rgba(255,255,255,0.9)' : 'var(--lp-muted, #94a3b8)' }),
    badgePopular: { background: 'rgba(255,255,255,0.1)', color: 'var(--lp-text, #fff)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.65rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.5px', textTransform: 'uppercase' },
    priceBlock: { marginBottom: '1.75rem', display: 'flex', alignItems: 'baseline' },
    currency: (isSelected) => ({ fontSize: '1.2rem', color: isSelected ? 'rgba(255,255,255,0.9)' : 'var(--lp-text, #fff)', fontWeight: 700, marginRight: '2px' }),
    amount: (isSelected) => ({ fontSize: '2.8rem', fontWeight: 800, color: isSelected ? '#fff' : 'var(--lp-text, #fff)', lineHeight: 1 }),
    period: (isSelected) => ({ fontSize: '0.9rem', color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--lp-muted, #94a3b8)', marginLeft: '4px' }),
    featureList: { listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' },
    featureItem: (isSelected) => ({ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: isSelected ? 'rgba(255,255,255,0.95)' : 'var(--lp-text, #e2e8f0)', lineHeight: 1.4 }),
    checkIcon: (isSelected) => ({ color: isSelected ? '#fff' : 'var(--lp-primary, #6366f1)', fontSize: '1.1rem', lineHeight: 1 }),
    ctaBtn: (isSelected, isEnterprise, popular) => {
        const base = { width: '100%', padding: '14px', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', marginTop: 'auto' };
        if (isSelected) return { ...base, background: '#fff', color: 'var(--lp-primary, #6366f1)' };
        if (popular) return { ...base, background: 'var(--lp-primary, #6366f1)', color: '#fff' };
        return { ...base, background: 'transparent', border: '1px solid var(--lp-border, rgba(255,255,255,0.2))', color: 'var(--lp-text, #fff)' };
    },
    viewLink: (isSelected) => ({ display: 'block', textAlign: 'center', fontSize: '0.77rem', color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--lp-muted, #94a3b8)', cursor: 'pointer', background: 'none', border: 'none', width: '100%', padding: '6px 0', marginTop: '10px' }),
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
};

/* ── Feature comparison rows ── */
const COMPARE_ROWS = [
    { section: 'Core Limits' },
    { label: 'Students', key: 'max_students', fmt: v => v === -1 ? 'Unlimited' : `Up to ${v}` },
    { label: 'Faculty', key: 'max_faculty', fmt: v => v === -1 ? 'Unlimited' : String(v) },
    { label: 'Storage', key: 'max_storage_mb', fmt: v => v === -1 ? 'Unlimited' : `${(v / 1024).toFixed(0)} GB` },
    { label: 'AI Messages/mo', key: 'max_ai_messages', fmt: v => v === -1 ? 'Unlimited' : String(v) },
    { section: 'Features' },
    { label: 'Fee Management', key: 'feature_fees', bool: true },
    { label: 'Exams & Marks', key: 'feature_exams', bool: true },
    { label: 'Timetable', key: 'feature_timetable', bool: true },
    { label: 'Reports', key: 'feature_reports', fmt: v => v === 'advanced' ? 'Advanced' : v === 'basic' ? 'Basic' : '—' },
    { label: 'Announcements', key: 'feature_announcements', bool: true },
    { label: 'Finance & Salary', key: 'feature_finance', bool: true },
    { label: 'SMS / Email', key: 'feature_sms', bool: true },
    { label: 'Parent Portal', key: 'feature_parent_portal', bool: true },
    { label: 'Custom Branding', key: 'feature_custom_branding', bool: true },
    { label: 'API Access', key: 'feature_api_access', bool: true },
    { section: 'Mobile (Web + Android only)' },
    { label: 'Mobile App', key: 'feature_mobile_app', bool: true },
    { label: 'Push Notifications', key: 'feature_push_notifications', bool: true },
    { label: 'Offline Attendance', key: 'feature_offline_attendance', bool: true },
    { label: 'Parent App', key: 'feature_parent_app', bool: true },
    { label: 'Student App', key: 'feature_student_app', bool: true },
];

export default function Pricing() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [allPlans, setAllPlans] = useState([]);
    const [lifetimePlan, setLifetimePlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [activeTab, setActiveTab] = useState('web_only');
    const [showModal, setShowModal] = useState(false);
    const [modalPlan, setModalPlan] = useState(null);
    const [selectedPlanId, setSelectedPlanId] = useState(null);

    useEffect(() => {
        api.get('/plans')
            .then(res => {
                const active = res.data.data
                    .filter(p => p.status === 'active' && !p.is_lifetime)
                    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
                setAllPlans(active);
            })
            .catch(() => { })
            .finally(() => setLoading(false));

        api.get('/lifetime/info')
            .then(res => { if (res.data.success) setLifetimePlan(res.data.plan); })
            .catch(() => { });
    }, []);

    const filteredPlans = allPlans.filter(p => p.platform_type === activeTab);

    const getPrice = (plan) => {
        if (plan.contact_sales) return null;
        if (billingCycle === 'yearly' && plan.yearly_price) return Number(plan.yearly_price);
        return Number(plan.price);
    };

    const fmt = num => num != null ? num.toLocaleString('en-IN') : '';

    const getChips = (plan) => {
        const chips = [];
        const ms = plan.max_students;
        chips.push({ icon: '👥', text: ms === -1 ? 'Unlimited Students' : `${ms} Students` });
        const mf = plan.max_faculty;
        chips.push({ icon: '👨‍🏫', text: mf === -1 ? 'Unlimited Faculty' : `${mf} Faculty` });
        return chips;
    };

    const handleChoose = (plan) => {
        if (plan.contact_sales) {
            if (window.location.pathname === '/') {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            } else {
                navigate('/#contact', { replace: false });
            }
            return;
        }
        if (user?.role === 'admin') navigate(`/checkout?plan_id=${plan.id}&cycle=${billingCycle}`);
        else { localStorage.setItem('selectedPlan', plan.id); navigate('/register'); }
    };

    const handleLifetime = () => {
        if (user?.role === 'admin') navigate('/billing?tab=lifetime');
        else navigate('/register?intent=lifetime');
    };

    const renderVal = (plan, row) => {
        if (row.bool) return plan[row.key] ? <span style={{ color: '#10b981' }}>✓</span> : <span style={{ color: '#374151' }}>—</span>;
        if (row.fmt) return row.fmt(plan[row.key]);
        return plan[row.key] != null ? String(plan[row.key]) : '—';
    };

    if (loading) return (
        <section id="pricing" style={ps.wrap}>
            <div style={ps.inner}>
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--lp-muted)' }}>Loading plans...</div>
            </div>
        </section>
    );

    return (
        <section id="pricing" style={ps.wrap}>
            <div style={ps.inner}>
                {/* Header */}
                <div style={ps.header}>
                    <span style={ps.eyebrow}>Transparent Pricing</span>
                    <h2 style={ps.h2}>Choose the Perfect Plan for Your Institute</h2>
                    <p style={ps.sub}>No hidden fees. Cancel anytime. Start with our 14-day free trial — no credit card required.</p>
                </div>

                {/* Trust bar */}
                <div style={ps.trustBar}>
                    {[['🔒', 'Secure Payments'], ['⚡', 'Instant Setup'], ['📞', 'Free Support'], ['🔄', 'Cancel Anytime']].map(([icon, text]) => (
                        <div key={text} style={ps.trustItem}><span>{icon}</span> {text}</div>
                    ))}
                </div>

                {/* Platform tabs + billing toggle */}
                <div style={ps.controls}>
                    <div style={ps.tabGroup}>
                        {[['web_only', '💻 Web Only'], ['web_android', '📱 Web + Android']].map(([val, label]) => (
                            <button key={val} style={ps.tab(activeTab === val)} onClick={() => setActiveTab(val)}>{label}</button>
                        ))}
                    </div>
                    <div style={ps.tabGroup}>
                        <button style={ps.tab(billingCycle === 'monthly')} onClick={() => setBillingCycle('monthly')}>Monthly</button>
                        <button style={ps.tab(billingCycle === 'yearly')} onClick={() => setBillingCycle('yearly')}>
                            Annual <span style={{ background: '#10b981', color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: '12px', marginLeft: '5px', verticalAlign: 'middle' }}>Save 20%</span>
                        </button>
                    </div>
                </div>

                {/* Plan cards */}
                <style>{`
                    .cg-pricing-card { border: 1px solid transparent; }
                    .cg-pricing-card:hover { transform: translateY(-4px); border-color: var(--lp-primary, #6366f1) !important; box-shadow: 0 12px 30px rgba(99,102,241,0.15); }
                    .cg-pricing-card:active { transform: translateY(0) scale(0.98); }
                    html.dark-mode .cg-pricing-card:hover { border-color: var(--lp-primary, #6366f1) !important; box-shadow: 0 12px 30px rgba(0,0,0,0.4); }
                    .cg-pricing-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
                    .cg-pricing-btn:active { filter: brightness(0.95); transform: translateY(1px); }
                `}</style>
                <div style={ps.grid}>
                    {filteredPlans.map((plan, index) => {
                        const price = getPrice(plan);
                        const isPopular = plan.is_popular;
                        const isTrial = plan.is_free_trial;
                        const isEnterprise = plan.contact_sales;
                        const isFirst = index === 0;
                        const activeSelectedId = selectedPlanId || (filteredPlans.length > 0 ? filteredPlans[0].id : null);
                        const isSelected = activeSelectedId === plan.id;

                        // Build feature list mimicking ConsentGuard
                        const features = [];
                        if (plan.max_students === -1) features.push('Unlimited students');
                        else features.push(`Up to ${plan.max_students.toLocaleString('en-IN')} students`);

                        if (plan.max_faculty === -1) features.push('Unlimited faculty');
                        else features.push(`Up to ${plan.max_faculty.toLocaleString('en-IN')} faculty`);

                        if (plan.feature_fees) features.push('Fee management & payments');
                        if (plan.feature_exams) features.push('Exams & marks portal');
                        if (plan.feature_announcements) features.push('Announcements & SMS');
                        if (plan.feature_mobile_app) features.push('White-labeled Mobile App');
                        else if (plan.feature_parent_portal) features.push('Parent & Student portals');

                        if (plan.max_storage_mb === -1) features.push('Unlimited cloud storage');
                        else if (plan.max_storage_mb >= 5120) features.push(`${(plan.max_storage_mb / 1024).toFixed(0)} GB cloud storage`);

                        return (
                            <div key={plan.id} className="cg-pricing-card" style={ps.card(isSelected)} onClick={() => setSelectedPlanId(plan.id)}>
                                <div style={ps.planHeader}>
                                    <div style={ps.planName(isSelected)}>{plan.name}</div>
                                    {isPopular && <div style={ps.badgePopular}>Most Popular</div>}
                                </div>

                                {isEnterprise ? (
                                    <div style={ps.priceBlock}>
                                        <span style={ps.amount(isSelected)}>Custom</span>
                                    </div>
                                ) : (
                                    <div style={ps.priceBlock}>
                                        <span style={ps.currency(isSelected)}>₹</span>
                                        <span style={ps.amount(isSelected)}>{fmt(price)}</span>
                                        <span style={ps.period(isSelected)}>/{billingCycle === 'yearly' ? 'yr' : 'mo'}</span>
                                    </div>
                                )}

                                <ul style={ps.featureList}>
                                    {features.map((f, i) => (
                                        <li key={i} style={ps.featureItem(isSelected)}>
                                            <span style={ps.checkIcon(isSelected)}>✓</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className="cg-pricing-btn"
                                    style={ps.ctaBtn(isSelected, isEnterprise, isPopular)}
                                    onClick={() => handleChoose(plan)}
                                >
                                    {isTrial ? 'Start Free Trial' : isEnterprise ? 'Contact Sales' : isPopular ? `Upgrade to ${plan.name} ` : 'Upgrade to pro'}
                                </button>

                                <button style={ps.viewLink(isSelected)} onClick={() => { setModalPlan(plan); setShowModal(true); }}>
                                    View all features →
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Compare all plans */}
                <div style={ps.compareRow}>
                    {/* <button style={ps.compareBtn} onClick={() => { setModalPlan(null); setShowModal(true); }}>
                        📊 Compare All {activeTab === 'web_only' ? 'Web Only' : 'Web + Android'} Plans
                    </button> */}
                </div>

                {/* ── Lifetime Premium Section ── */}
                {lifetimePlan ? (
                    <div style={ps.ltCard}>
                        <div style={ps.ltBadge}>💎 Best Long-Term Value</div>
                        <div style={ps.ltRow}>
                            <div style={ps.ltInfo}>
                                <div style={ps.ltH}>Lifetime Access</div>
                                <div style={ps.ltP}>Pay once. Use forever. No recurring charges — ever.</div>
                                <div style={ps.ltPerks}>
                                    {['✅ Unlimited students & faculty', '✅ All premium features forever', '✅ Full finance & salary module', '✅ Priority 24/7 support', '✅ Custom subdomain', '✅ Free future updates'].map(p => (
                                        <span key={p} style={ps.ltPerk}>{p}</span>
                                    ))}
                                </div>
                            </div>
                            <div style={ps.ltBox}>
                                {lifetimePlan.is_founding_available && (
                                    <div style={{ textDecoration: 'line-through', color: '#a78bfa', fontSize: '0.95rem', marginBottom: 3 }}>
                                        ₹{lifetimePlan.standard_price?.toLocaleString('en-IN') || '24,999'}
                                    </div>
                                )}
                                <div style={ps.ltPrice}>₹{lifetimePlan.current_price?.toLocaleString('en-IN') || '19,999'}</div>
                                <div style={ps.ltLabel}>One-time payment</div>
                                {lifetimePlan.slots_remaining != null && (
                                    <div style={{ fontSize: '0.75rem', color: '#fca5a5', fontWeight: 600, marginBottom: '10px' }}>
                                        ⚡ Only {lifetimePlan.slots_remaining} slots left!
                                    </div>
                                )}
                                <button style={ps.ltCta} onClick={handleLifetime}>💎 Get Lifetime Access</button>
                                <div style={{ color: '#6b7280', fontSize: '0.7rem', marginTop: '8px' }}>🔒 Secure via Razorpay</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Lifetime fallback when /lifetime/info endpoint not set up yet */
                    <div style={ps.ltCard}>
                        <div style={ps.ltBadge}>💎 Best Long-Term Value</div>
                        <div style={ps.ltRow}>
                            <div style={ps.ltInfo}>
                                <div style={ps.ltH}>Lifetime Access</div>
                                <div style={ps.ltP}>Pay once. Use forever. No recurring charges — ever.</div>
                                <div style={ps.ltPerks}>
                                    {['✅ Unlimited students & faculty', '✅ All premium features forever', '✅ Full finance & salary module', '✅ Priority 24/7 support', '✅ Custom subdomain', '✅ Free future updates'].map(p => (
                                        <span key={p} style={ps.ltPerk}>{p}</span>
                                    ))}
                                </div>
                            </div>
                            <div style={ps.ltBox}>
                                <div style={{ textDecoration: 'line-through', color: '#a78bfa', fontSize: '0.95rem', marginBottom: 3 }}>₹39,999</div>
                                <div style={ps.ltPrice}>₹24,999</div>
                                <div style={ps.ltLabel}>One-time payment · Web + Android</div>
                                <div style={{ fontSize: '0.75rem', color: '#fca5a5', fontWeight: 600, marginBottom: '10px' }}>⚡ Limited founding slots!</div>
                                <button style={ps.ltCta} onClick={handleLifetime}>💎 Get Lifetime Access</button>
                                <div style={{ color: '#6b7280', fontSize: '0.7rem', marginTop: '8px' }}>🔒 Secure via Razorpay</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Feature Comparison Modal */}
                {showModal && (
                    <div style={ps.overlay} onClick={() => setShowModal(false)}>
                        <div style={ps.modal} onClick={e => e.stopPropagation()}>
                            <button style={ps.closeBtn} onClick={() => setShowModal(false)}>✕</button>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--lp-text)', marginBottom: '1.5rem' }}>
                                {modalPlan ? `${modalPlan.name} — All Features` : `Compare ${activeTab === 'web_only' ? 'Web Only' : 'Web + Android'} Plans`}
                            </h3>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={ps.table}>
                                    <thead>
                                        <tr>
                                            <th style={ps.th}>Feature</th>
                                            {modalPlan ? (
                                                <th style={ps.th}>{modalPlan.name}</th>
                                            ) : (
                                                filteredPlans.map(p => <th key={p.id} style={ps.th}>{p.name}</th>)
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {COMPARE_ROWS.map((row, idx) => {
                                            if (row.section) return (
                                                <tr key={idx}>
                                                    <td colSpan={modalPlan ? 2 : filteredPlans.length + 1} style={ps.sectionRow}>{row.section}</td>
                                                </tr>
                                            );
                                            return (
                                                <tr key={idx}>
                                                    <td style={{ ...ps.td, color: 'var(--lp-text)', fontWeight: 600 }}>{row.label}</td>
                                                    {modalPlan ? (
                                                        <td style={ps.td}>{renderVal(modalPlan, row)}</td>
                                                    ) : (
                                                        filteredPlans.map(p => <td key={p.id} style={ps.td}>{renderVal(p, row)}</td>)
                                                    )}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
