/**
 * PricingPage — Professional SaaS Pricing Experience
 * Features: Platform tabs, billing toggle, compact cards,
 *           feature comparison modal, premium lifetime section
 */

import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import PublicNavbar from "../../components/layout/PublicNavbar";
import "./PricingPage.css";

/* ───────── Feature comparison data ───────── */
const COMPARISON_FEATURES = [
    { section: "Core" },
    { label: "Students", key: "max_students", format: v => v === -1 ? "Unlimited" : `Up to ${v}` },
    { label: "Faculty", key: "max_faculty", format: v => v === -1 ? "Unlimited" : `${v}` },
    { label: "Classes", key: "max_classes", format: v => v === -1 ? "Unlimited" : `${v}` },
    { label: "Admins", key: "max_admin_users", format: v => v === -1 ? "Unlimited" : `${v}` },
    { label: "Storage", key: "max_storage_mb", format: v => v === -1 ? "Unlimited" : `${(v / 1024).toFixed(0)} GB` },
    { section: "Features" },
    { label: "Attendance Tracking", key: "feature_attendance", format: v => v === "advanced" ? "Advanced" : v === "basic" ? "Basic" : "—" },
    { label: "Fee Management", key: "feature_fees", bool: true },
    { label: "Exams & Marks", key: "feature_exams", bool: true },
    { label: "Timetable", key: "feature_timetable", bool: true },
    { label: "Reports & Analytics", key: "feature_reports", format: v => v === "advanced" ? "Advanced" : v === "basic" ? "Basic" : "—" },
    { label: "Announcements", key: "feature_announcements", bool: true },
    { label: "Notes", key: "feature_notes", bool: true },
    { label: "Chat", key: "feature_chat", bool: true },
    { label: "Assignments", key: "feature_assignment", bool: true },
    { section: "Communication" },
    { label: "SMS Notifications", key: "feature_sms", bool: true },
    { label: "Email Notifications", key: "feature_email", bool: true },
    { label: "WhatsApp", key: "feature_whatsapp", bool: true },
    { section: "Advanced" },
    { label: "Finance & Salary", key: "feature_finance", bool: true },
    { label: "Transport Fees", key: "feature_transport", bool: true },
    { label: "Public Profile Page", key: "feature_public_page", bool: true },
    { label: "Parent Portal", key: "feature_parent_portal", bool: true },
    { label: "Custom Branding", key: "feature_custom_branding", bool: true },
    { label: "Multi-Branch", key: "feature_multi_branch", bool: true },
    { label: "API Access", key: "feature_api_access", bool: true },
    { section: "Mobile" },
    { label: "Mobile App Access", key: "feature_mobile_app", bool: true },
    { label: "Push Notifications", key: "feature_push_notifications", bool: true },
    { label: "Offline Attendance", key: "feature_offline_attendance", bool: true },
    { label: "Parent App", key: "feature_parent_app", bool: true },
    { label: "Student App", key: "feature_student_app", bool: true },
];

/* ───────── FAQ data ───────── */
const FAQS = [
    { q: "Can I change my plan later?", a: "Yes! You can upgrade or downgrade at any time. Upgrades take effect immediately with prorated billing, and downgrades apply at the end of your current billing cycle." },
    { q: "Is there a free trial?", a: "Yes, every new institute gets a full 14-day free trial with access to all Starter features. No credit card required." },
    { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI, net banking, and popular digital wallets through Razorpay's secure payment gateway." },
    { q: "What's the difference between Web Only and Web + Android?", a: "Web Only gives your institute access via the browser. Web + Android plans include a branded Android mobile app for parents, students, and faculty with push notifications and offline features." },
    { q: "Is my data secure?", a: "Absolutely. We use bank-level encryption (TLS 1.3), automated daily backups, and role-based access controls. Your data is isolated per institute." },
    { q: "What does Lifetime Access include?", a: "A one-time payment gives you permanent access to all features with no recurring charges. Includes all future feature updates and priority support." },
];

function PricingPage() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [plans, setPlans] = useState([]);
    const [lifetimePlan, setLifetimePlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [billingCycle, setBillingCycle] = useState("monthly");
    const [activeTab, setActiveTab] = useState("web_only");
    const [showModal, setShowModal] = useState(false);
    const [modalPlan, setModalPlan] = useState(null); // for single-plan detail view
    const [openFaq, setOpenFaq] = useState(null);

    useEffect(() => {
        fetchPlans();
        fetchLifetimePlan();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await api.get("/plans");
            const activePlans = response.data.data
                .filter(p => p.status === "active" && !p.is_lifetime)
                .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            setPlans(activePlans);
        } catch (error) {
            console.error("Error fetching plans:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLifetimePlan = async () => {
        try {
            const res = await api.get("/lifetime/info");
            if (res.data.success) setLifetimePlan(res.data.plan);
        } catch { /* not configured yet */ }
    };

    const handleChoosePlan = (plan) => {
        if (plan.contact_sales) {
            navigate("/contact");
            return;
        }
        if (user && user.role === "admin") {
            navigate(`/checkout?plan_id=${plan.id}&cycle=${billingCycle}`);
        } else {
            localStorage.setItem("selectedPlan", plan.id);
            navigate("/register");
        }
    };

    const handleChooseLifetime = () => {
        if (user && user.role === "admin") {
            navigate("/billing?tab=lifetime");
        } else {
            navigate("/register?intent=lifetime");
        }
    };

    /* ── Filtered plans by platform tab ── */
    const filteredPlans = plans.filter(p => p.platform_type === activeTab);

    /* ── Get display price ── */
    const getPrice = (plan) => {
        if (plan.contact_sales) return null;
        if (billingCycle === "yearly" && plan.yearly_price) return Number(plan.yearly_price);
        return Number(plan.price);
    };

    const formatPrice = (num) => {
        if (!num && num !== 0) return "";
        return num.toLocaleString("en-IN");
    };

    /* ── Key limits for compact card ── */
    const getKeyLimits = (plan) => {
        const limits = [];
        const ms = plan.max_students;
        limits.push({ icon: "👥", text: ms === -1 ? "Unlimited Students" : `${ms} Students` });
        const mf = plan.max_faculty;
        limits.push({ icon: "👨‍🏫", text: mf === -1 ? "Unlimited Faculty" : `${mf} Faculty` });
        if (plan.max_branches && plan.max_branches !== 1) {
            limits.push({ icon: "🏢", text: plan.max_branches === -1 ? "Multi-Branch" : `${plan.max_branches} Branches` });
        }
        return limits;
    };

    if (loading) {
        return (
            <div className="sp-pricing">
                <PublicNavbar />
                <div style={{ textAlign: "center", padding: "6rem 2rem", color: "#94a3b8" }}>Loading plans...</div>
            </div>
        );
    }

    return (
        <div className="sp-pricing">
            <PublicNavbar />

            {/* ── Header ── */}
            <header className="sp-header">
                <div className="sp-badge">Transparent Pricing</div>
                <h1 className="sp-title">Choose the Perfect Plan for Your Institute</h1>
                <p className="sp-subtitle">
                    No hidden fees. Cancel anytime. Start with our 14-day free trial — no credit card required.
                </p>
            </header>

            {/* ── Trust Bar ── */}
            <div className="sp-trust-bar">
                <div className="sp-trust-item"><span className="icon">🔒</span> Secure Payments</div>
                <div className="sp-trust-item"><span className="icon">⚡</span> Instant Setup</div>
                <div className="sp-trust-item"><span className="icon">📞</span> Free Support</div>
                <div className="sp-trust-item"><span className="icon">🔄</span> Cancel Anytime</div>
            </div>

            {/* ── Controls: Platform Tabs + Billing Toggle ── */}
            <div className="sp-controls">
                <div className="sp-platform-tabs">
                    <button
                        className={`sp-platform-tab ${activeTab === "web_only" ? "active" : ""}`}
                        onClick={() => setActiveTab("web_only")}
                    >
                        💻 Web Only
                    </button>
                    <button
                        className={`sp-platform-tab ${activeTab === "web_android" ? "active" : ""}`}
                        onClick={() => setActiveTab("web_android")}
                    >
                        📱 Web + Android
                    </button>
                </div>

                <div className="sp-billing-toggle">
                    <button
                        className={`sp-billing-btn ${billingCycle === "monthly" ? "active" : ""}`}
                        onClick={() => setBillingCycle("monthly")}
                    >
                        Monthly
                    </button>
                    <button
                        className={`sp-billing-btn ${billingCycle === "yearly" ? "active" : ""}`}
                        onClick={() => setBillingCycle("yearly")}
                    >
                        Annual <span className="sp-save-tag">Save 20%</span>
                    </button>
                </div>
            </div>

            {/* ── Plan Cards ── */}
            <div className="sp-plans-container">
                <div className="sp-plans-grid">
                    {filteredPlans.map((plan) => {
                        const price = getPrice(plan);
                        const isTrial = plan.is_free_trial;
                        const isPopular = plan.is_popular;
                        const isEnterprise = plan.contact_sales;

                        return (
                            <div
                                key={plan.id}
                                className={`sp-plan-card ${isPopular ? "popular" : ""} ${isTrial ? "trial" : ""}`}
                            >
                                {isPopular && <div className="sp-popular-tag">Most Popular</div>}
                                {isTrial && !isPopular && <div className="sp-trial-tag">14-Day Free Trial</div>}

                                <h3 className="sp-plan-name">{plan.name}</h3>

                                {/* Price */}
                                {isEnterprise ? (
                                    <div className="sp-price-block contact-sales">
                                        <div className="sp-price-label">Custom Pricing</div>
                                    </div>
                                ) : (
                                    <div className="sp-price-block">
                                        <span className="sp-currency">₹</span>
                                        <span className="sp-price-amount">{formatPrice(price)}</span>
                                        <span className="sp-price-period">/{billingCycle === "yearly" ? "yr" : "mo"}</span>
                                    </div>
                                )}
                                <div className="sp-price-note">
                                    {isTrial
                                        ? "Free for 14 days, no card needed"
                                        : isEnterprise
                                            ? "Tailored to your institute needs"
                                            : billingCycle === "yearly"
                                                ? `₹${formatPrice(Math.round(price / 12))}/mo billed annually`
                                                : "Billed monthly"
                                    }
                                </div>

                                {/* Key Limits Chips */}
                                <div className="sp-key-limits">
                                    {getKeyLimits(plan).map((l, i) => (
                                        <div key={i} className="sp-limit-chip">
                                            <span className="icon">{l.icon}</span> {l.text}
                                        </div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <button
                                    className={`sp-cta-btn ${isEnterprise ? "sales" : isPopular ? "primary" : "outline"}`}
                                    onClick={() => handleChoosePlan(plan)}
                                >
                                    {isTrial ? "🎁 Start Free Trial" : isEnterprise ? "📞 Contact Sales" : `Choose ${plan.name}`}
                                </button>

                                {/* View Features */}
                                <button
                                    className="sp-features-link"
                                    onClick={() => { setModalPlan(plan); setShowModal(true); }}
                                >
                                    View all features →
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Compare All Plans */}
                <div className="sp-compare-row">
                    {/* <button className="sp-compare-btn" onClick={() => { setModalPlan(null); setShowModal(true); }}>
                        📊 Compare All Plans
                    </button> */}
                </div>
            </div>

            {/* ── Lifetime Access Premium Section ── */}
            {lifetimePlan && (
                <div className="sp-lifetime-section">
                    <div className="sp-lifetime-card">
                        <div className="sp-lifetime-badge">💎 Best Long-Term Value</div>

                        <div className="sp-lifetime-header">
                            <div className="sp-lifetime-info">
                                <h2>Lifetime Access</h2>
                                <p>Pay once. Use forever. No recurring charges — ever.</p>

                                <div className="sp-lifetime-perks">
                                    <span>✅ Unlimited students & faculty</span>
                                    <span>✅ All premium features forever</span>
                                    <span>✅ Full finance & salary module</span>
                                    <span>✅ Priority 24/7 support</span>
                                    <span>✅ Custom subdomain</span>
                                    <span>✅ Free future updates</span>
                                </div>
                            </div>

                            <div className="sp-lifetime-price-box">
                                {lifetimePlan.is_founding_available && (
                                    <div style={{ textDecoration: "line-through", color: "#a78bfa", fontSize: "1rem", marginBottom: 4 }}>
                                        ₹{lifetimePlan.standard_price?.toLocaleString("en-IN") || "24,999"}
                                    </div>
                                )}
                                <div className="sp-lifetime-price">
                                    ₹{lifetimePlan.current_price?.toLocaleString("en-IN") || "19,999"}
                                </div>
                                <div className="sp-lifetime-label">One-time payment</div>

                                {lifetimePlan.slots_remaining != null && (
                                    <div style={{ fontSize: "0.78rem", color: "#fca5a5", marginBottom: 12, fontWeight: 600 }}>
                                        ⚡ Only {lifetimePlan.slots_remaining} slots left!
                                    </div>
                                )}

                                <button className="sp-lifetime-cta" onClick={handleChooseLifetime}>
                                    💎 Get Lifetime Access
                                </button>
                                <div style={{ color: "#9ca3af", fontSize: "0.72rem", marginTop: 8 }}>
                                    🔒 Secure payment via Razorpay
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Feature Comparison Modal ── */}
            {showModal && (
                <div className="sp-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="sp-modal" onClick={e => e.stopPropagation()}>
                        <button className="sp-modal-close" onClick={() => setShowModal(false)}>✕</button>

                        <h2>{modalPlan ? `${modalPlan.name} — Features` : "Compare All Plans"}</h2>

                        <div style={{ overflowX: "auto" }}>
                            <table className="sp-compare-table">
                                <thead>
                                    <tr>
                                        <th>Feature</th>
                                        {modalPlan ? (
                                            <th>{modalPlan.name}</th>
                                        ) : (
                                            filteredPlans.map(p => <th key={p.id}>{p.name}</th>)
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {COMPARISON_FEATURES.map((feat, idx) => {
                                        if (feat.section) {
                                            return (
                                                <tr key={idx} className="section-row">
                                                    <td colSpan={modalPlan ? 2 : filteredPlans.length + 1}>{feat.section}</td>
                                                </tr>
                                            );
                                        }

                                        const renderVal = (plan) => {
                                            const val = plan[feat.key];
                                            if (feat.bool) {
                                                return val ? <span className="sp-check">✓</span> : <span className="sp-cross">—</span>;
                                            }
                                            if (feat.format) return feat.format(val);
                                            return val != null ? String(val) : "—";
                                        };

                                        return (
                                            <tr key={idx}>
                                                <td className="feature-name">{feat.label}</td>
                                                {modalPlan ? (
                                                    <td>{renderVal(modalPlan)}</td>
                                                ) : (
                                                    filteredPlans.map(p => <td key={p.id}>{renderVal(p)}</td>)
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

            {/* ── FAQ Section ── */}
            <section className="sp-faq">
                <h2>Frequently Asked Questions</h2>
                {FAQS.map((item, i) => (
                    <div key={i} className="sp-faq-item">
                        <button className="sp-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                            {item.q}
                            <span className={`arrow ${openFaq === i ? "open" : ""}`}>▼</span>
                        </button>
                        {openFaq === i && <div className="sp-faq-a">{item.a}</div>}
                    </div>
                ))}
            </section>

            {/* ── Final CTA ── */}
            <section style={{ textAlign: "center", padding: "2rem 1.5rem 4rem" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: 8 }}>Still have questions?</h2>
                <p style={{ color: "#94a3b8", marginBottom: 20 }}>Our team is here to help you choose the right plan</p>
                <Link
                    to="/contact"
                    style={{
                        display: "inline-block",
                        padding: "12px 32px",
                        background: "linear-gradient(135deg, #6366f1, #818cf8)",
                        color: "#fff",
                        borderRadius: 12,
                        fontWeight: 700,
                        textDecoration: "none",
                        transition: "all 0.25s",
                    }}
                >
                    Contact Us
                </Link>
            </section>

            {/* ── Footer ── */}
            <footer className="public-footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-col">
                            <h4>ZF Solution</h4>
                            <p>Professional coaching center management software</p>
                        </div>
                        <div className="footer-col">
                            <h4>Product</h4>
                            <Link to="/features">Features</Link>
                            <Link to="/pricing">Pricing</Link>
                            <Link to="/about">About Us</Link>
                        </div>
                        <div className="footer-col">
                            <h4>Support</h4>
                            <Link to="/contact">Contact</Link>
                            <Link to="/terms">Terms of Service</Link>
                            <Link to="/privacy">Privacy Policy</Link>
                        </div>
                        <div className="footer-col">
                            <h4>Connect</h4>
                            <a href="mailto:support@zfsolution.com">support@zfsolution.com</a>
                            <a href="tel:+911234567890">+91 123 456 7890</a>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2026 ZF Solution. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default PricingPage;
