const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/landing/Pricing.jsx', 'utf8');

// 1. Add state
code = code.replace(
    /const \[modalPlan, setModalPlan\] = useState\(null\);/,
    `const [modalPlan, setModalPlan] = useState(null);\n    const [selectedPlanId, setSelectedPlanId] = useState(null);`
);

// 2. Update ps.card definition
code = code.replace(
    /card: \(isFirst, popular\) => \(\{[\s\S]*?cursor: 'default'\n    \}\),/,
    `card: (isHighlight, isSelected) => ({ 
        background: isSelected ? 'linear-gradient(145deg, #1e1b4b, #2e1065, #4c1d95)' : isHighlight ? 'var(--lp-primary, #6366f1)' : 'var(--lp-surface, rgba(255,255,255,0.03))', 
        border: \`1px solid \${isSelected ? 'rgba(167,139,250,0.5)' : isHighlight ? 'transparent' : 'var(--lp-border, rgba(255,255,255,0.06))'}\`, 
        borderRadius: '16px', 
        padding: '2rem 1.5rem', 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        transition: 'all 0.3s ease', 
        boxShadow: isSelected ? '0 10px 30px rgba(76, 29, 149, 0.4)' : 'var(--lp-shadow-sm, none)',
        cursor: 'pointer'
    }),`
);

// 3. Update the hover CSS block to have blue border and fix dark mode CSS
code = code.replace(
    /<style>\{`[\s\S]*?`\}<\/style>/,
    `<style>{\`
                    .cg-pricing-card:hover { transform: translateY(-4px); box-shadow: 0 0 0 2px var(--lp-primary, #6366f1), 0 12px 30px rgba(99,102,241,0.15); }
                    .cg-pricing-card:active { transform: translateY(0) scale(0.98); }
                    html.dark-mode .cg-pricing-card:hover { box-shadow: 0 0 0 2px var(--lp-primary, #6366f1), 0 12px 30px rgba(0,0,0,0.4); }
                    .cg-pricing-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
                    .cg-pricing-btn:active { filter: brightness(0.95); transform: translateY(1px); }
                \`}</style>`
);

// 4. In the map loop, update the variables
const loopRegex = /const isFirst = index === 0;/;
code = code.replace(
    loopRegex,
    `const isFirst = index === 0;\n                        const isSelected = selectedPlanId === plan.id;\n                        const isHighlight = isFirst || isSelected;`
);

// 5. In the loop, change all instances of 'isFirst' to 'isHighlight'
// This will naturally affect ps.planName, ps.amount, etc...
// But we have to be careful not to replace the variable declaration itself.
// Let's replace the whole card return block.
const returnBlockRegex = /return \(\s*<div key=\{plan\.id\} className="cg-pricing-card" style=\{ps\.card\(isFirst, isPopular\)\}>[\s\S]*?<\/div>\s*\);/;

if (returnBlockRegex.test(code)) {
    let block = code.match(returnBlockRegex)[0];
    
    // Replace the div attributes
    block = block.replace(
        /<div key=\{plan\.id\} className="cg-pricing-card" style=\{ps\.card\(isFirst, isPopular\)\}>/,
        `<div key={plan.id} className="cg-pricing-card" style={ps.card(isHighlight, isSelected)} onClick={() => setSelectedPlanId(plan.id)}>`
    );
    
    // Replace isFirst with isHighlight for all ps styling calls inside the block
    block = block.replace(/ps\.planName\(isFirst\)/g, 'ps.planName(isHighlight)');
    block = block.replace(/ps\.amount\(isFirst\)/g, 'ps.amount(isHighlight)');
    block = block.replace(/ps\.currency\(isFirst\)/g, 'ps.currency(isHighlight)');
    block = block.replace(/ps\.period\(isFirst\)/g, 'ps.period(isHighlight)');
    block = block.replace(/ps\.featureItem\(isFirst\)/g, 'ps.featureItem(isHighlight)');
    block = block.replace(/ps\.checkIcon\(isFirst\)/g, 'ps.checkIcon(isHighlight)');
    block = block.replace(/ps\.ctaBtn\(isFirst, isEnterprise, isPopular\)/g, 'ps.ctaBtn(isHighlight, isEnterprise, isPopular)');
    block = block.replace(/ps\.viewLink\(isFirst\)/g, 'ps.viewLink(isHighlight)');
    
    code = code.replace(returnBlockRegex, block);
}

fs.writeFileSync('frontend/src/components/landing/Pricing.jsx', code);
