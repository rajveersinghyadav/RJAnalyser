/* ==========================================
   RJAnalyser AI - Dynamic API Linker V5
   Direct Broker Automation (No Third-Party Bots)
========================================== */

const RJExecutor = {
    isLive: true,
    currentPosition: null,
    symbol: "BTCUSD",
    platform: localStorage.getItem('rj_broker_platform') || 'generic_webhook',
    apiKey: localStorage.getItem('rj_broker_api_key') || '',
    brokerUrl: localStorage.getItem('rj_broker_url') || ''
};

// UI se dynamic settings reload karne ke liye function
RJExecutor.loadDynamicSettings = function() {
    this.platform = localStorage.getItem('rj_broker_platform');
    this.apiKey = localStorage.getItem('rj_broker_api_key');
    this.brokerUrl = localStorage.getItem('rj_broker_url');
    console.log(`🔄 RJExecutor: Linked to ${this.platform} successfully.`);
};

// Automatic Trade Execution Pipeline
RJExecutor.executeMT5Order = async function(decision, currentPrice) {
    // Agar setting me key nahi dali hai toh execution stop rahega
    if (!this.isLive || !this.apiKey) {
        console.log("⚠️ RJExecutor: Automation is live but API Key/Token is missing in settings.");
        return;
    }
    
    // Position management logic (Glitch protection)
    if (this.currentPosition !== null) return;

    let side = "";
    if (decision === "BUY" || decision === "STRONG BUY") side = "BUY";
    if (decision === "SELL" || decision === "STRONG SELL") side = "SELL";
    if (side === "") return;

    console.log(`🚀 RJExecutor: Routing ${side} order directly to ${this.platform}...`);

    let payload = {
        token: this.apiKey,
        action: side,
        symbol: this.symbol,
        amount: 1.0, 
        price: currentPrice
    };

    let targetUrl = this.brokerUrl || "https://api.rj-bridge-fallback.com/trade";

    if (this.platform === "deriv") {
        targetUrl = "https://api.deriv.com/v1/trade"; 
    }

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log(`✅ Trade executed successfully on ${this.platform}!`);
            this.currentPosition = { side: side, status: "OPEN" };
        } else {
            console.error("❌ Broker API rejected the order. Check Token permissions.");
        }
    } catch (error) {
        console.error("❌ Network Pipeline Error while reaching Broker API:", error);
    }
};
