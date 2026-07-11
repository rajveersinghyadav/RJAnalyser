/* ==========================================
   RJAnalyser AI - MT5 Execution Engine V2
   Safe MetaApi Cloud Integration (No-Glitch)
========================================== */

const RJExecutor = {
    // MetaApi Cloud se milne wali account details yahan aayengi
    metaApiToken: "YOUR_META_API_TOKEN", 
    accountId: "YOUR_META_API_ACCOUNT_ID",
    isLive: false,                      // Default off (Settings se on hoga)
    currentPosition: null,              // Double trading protection
    symbol: "BTCUSD"                    // MT5 me BTCUSDT ko aamtaur par BTCUSD kehte hain
};

// ==========================================
// 1. Send Order To MT5 (Cloud Bridge)
// ==========================================
RJExecutor.executeMT5Order = async function(decision, currentPrice) {
    // Safety Checks
    if (!this.isLive) {
        console.log("🤖 RJExecutor: Signal generated but Automation is paused.");
        return;
    }
    if (this.currentPosition !== null) {
        console.log("🤖 RJExecutor: A trade is already active in MT5. Skipping.");
        return;
    }

    let actionType = ""; // BUY or SELL
    if (decision === "BUY" || decision === "STRONG BUY") actionType = "ORDER_TYPE_BUY";
    if (decision === "SELL" || decision === "STRONG SELL") actionType = "ORDER_TYPE_SELL";

    if (actionType === "") return;

    // Loss control system (Chhota Loss / Bada Profit)
    // MT5 points me kaam karta hai, isliye hum points me Stop Loss aur Take Profit calculate karenge
    let stopLossPoints = 1500;  // Chhota Stop Loss (Risk Control)
    let takeProfitPoints = 3000; // Bada Target (Profit Maximizer)

    console.log(`🚀 RJExecutor: Sending ${decision} to MetaQuotes MT5 Server...`);

    try {
        // MetaApi URL jahan se trade MT5 me punch hoti hai
        const url = `https://mt-client-api-v1.new-york.metaapi.cloud/users/current/accounts/${this.accountId}/trade`;
        
        const payload = {
            actionType: actionType,
            symbol: this.symbol,
            volume: 0.01, // Sabse safe aur chhota lot size (Demo Testing ke liye)
            stopLoss: stopLossPoints,
            takeProfit: takeProfitPoints
        };

        // Yeh request bina dashboard ko freeze kiye background me MT5 tak jayegi
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'auth-token': this.metaApiToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.stringCode === 'TRADE_RETCODE_DONE') {
            console.log("✅ MT5 Action Success! Position Opened.");
            this.currentPosition = {
                ticket: result.orderId,
                side: decision,
                status: "OPEN"
            };
        }
    } catch (error) {
        console.error("❌ MT5 Connection Glitch Protected:", error);
    }
};

// ==========================================
// 2. Sync Trade Status with Brain
// ==========================================
RJExecutor.syncWithBrain = function(tradeResult) {
    if (!this.currentPosition) return;

    if (tradeResult === "HIT_TP") {
        console.log("🎉 MT5: Profit Target Hit!");
        RJBrain.updateTradeResult("PROFIT"); // Brain ko feedback bhejo
        this.currentPosition = null;
    } else if (tradeResult === "HIT_SL") {
        console.log("📉 MT5: Stop Loss Hit. Capital Protected.");
        RJBrain.updateTradeResult("LOSS");   // Brain strict mode me chala jayega
        this.currentPosition = null;
    }
};
