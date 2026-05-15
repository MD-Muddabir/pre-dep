const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/landing/Pricing.jsx', 'utf8');

// 1. Update ps.card to remove isHighlight and just use isSelected
code = code.replace(
    /card: \(isHighlight, isSelected\) => \(\{[\s\S]*?cursor: 'pointer'\n    \}\),/,
    `card: (isSelected) => ({ 
        background: isSelected ? 'linear-gradient(145deg, #1e1b4b, #2e1065, #4c1d95)' : 'var(--lp-surface, rgba(255,255,255,0.03))', 
        border: \`1px solid \${isSelected ? 'rgba(167,139,250,0.5)' : 'var(--lp-border, rgba(255,255,255,0.06))'}\`, 
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

// 2. In the render loop, update the variables
const loopRegex = /const isFirst = index === 0;\n                        const isSelected = selectedPlanId === plan\.id;\n                        const isHighlight = isFirst \|\| isSelected;/;
code = code.replace(
    loopRegex,
    `const activeSelectedId = selectedPlanId || (filteredPlans.length > 0 ? filteredPlans[0].id : null);\n                        const isSelected = activeSelectedId === plan.id;`
);

// 3. Update the ps.card call in the render loop to pass only isSelected
// Since we used ps.card(isHighlight, isSelected), we need to change it to ps.card(isSelected)
const returnBlockRegex = /return \(\s*<div key=\{plan\.id\} className="cg-pricing-card" style=\{ps\.card\(isHighlight, isSelected\)\} onClick=\{\(\) => setSelectedPlanId\(plan\.id\)\}>[\s\S]*?<\/div>\s*\);/;

if (returnBlockRegex.test(code)) {
    let block = code.match(returnBlockRegex)[0];
    
    block = block.replace(
        /style=\{ps\.card\(isHighlight, isSelected\)\}/,
        `style={ps.card(isSelected)}`
    );
    
    // Replace all ps.*(isHighlight) with ps.*(isSelected)
    block = block.replace(/isHighlight\)/g, 'isSelected)');
    block = block.replace(/isHighlight,/g, 'isSelected,');
    
    code = code.replace(returnBlockRegex, block);
}

// Update the ps.* definitions to accept isSelected instead of isFirst
code = code.replace(/planName: \(isFirst\)/, 'planName: (isSelected)');
code = code.replace(/currency: \(isFirst\)/, 'currency: (isSelected)');
code = code.replace(/amount: \(isFirst\)/, 'amount: (isSelected)');
code = code.replace(/period: \(isFirst\)/, 'period: (isSelected)');
code = code.replace(/featureItem: \(isFirst\)/, 'featureItem: (isSelected)');
code = code.replace(/checkIcon: \(isFirst\)/, 'checkIcon: (isSelected)');
code = code.replace(/ctaBtn: \(isFirst, isEnterprise, popular\)/, 'ctaBtn: (isSelected, isEnterprise, popular)');
code = code.replace(/viewLink: \(isFirst\)/, 'viewLink: (isSelected)');

// Fix usages of isFirst inside the ps.* functions
const psBlockRegex = /planName: \(isSelected\) => \(\{[\s\S]*?compareRow: \{ textAlign:/;
if (psBlockRegex.test(code)) {
    let psBlock = code.match(psBlockRegex)[0];
    psBlock = psBlock.replace(/isFirst/g, 'isSelected');
    code = code.replace(psBlockRegex, psBlock);
}

fs.writeFileSync('frontend/src/components/landing/Pricing.jsx', code);
