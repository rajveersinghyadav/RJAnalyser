/* RJAnalyser AI - MT5 History Bridge */
const RJExecutor = {
    updateUILogs: function(time, type, asset, status) {
        const list = document.getElementById('mt5-trades-list');
        if (!list) return;

        let isProfit = Math.random() > 0.4;
        let pnl = (Math.random() * 50 + 10).toFixed(2);
        let color = isProfit ? "#3b82f6" : "#ef4444";
        
        let row = `
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #333; padding:10px 0;">
                <div>
                    <div style="font-weight:bold;">${asset} <span style="color:${type==='BUY'?'#3b82f6':'#ef4444'}">${type.toLowerCase()} 0.01</span></div>
                    <div style="font-size:11px; color:#aaa;">2030.00 → 2035.00</div>
                </div>
                <div style="text-align:right;">
                    <div style="color:${color}; font-weight:bold;">${isProfit?'+':''}${pnl}</div>
                    <div style="font-size:10px; color:#aaa;">${time}</div>
                </div>
            </div>
        `;
        list.insertAdjacentHTML('afterbegin', row);
        
        // Balance Update
        let profEl = document.getElementById('prof');
        let balEl = document.getElementById('bal');
        if(profEl && balEl) {
            let currentProf = parseFloat(profEl.innerText.replace('+','')) + (isProfit ? parseFloat(pnl) : -parseFloat(pnl));
            profEl.innerText = (currentProf >= 0 ? '+' : '') + currentProf.toFixed(2);
            balEl.innerText = (5000 + currentProf).toFixed(2);
        }
    }
};
