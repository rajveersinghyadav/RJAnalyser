/* ==========================================
   RJAnalyser AI - Telegram Copier Bridge V4
   Safe Mobile MT5 Automation (No-Glitch)
========================================== */

const RJExecutor = {
    // Yeh dono cheezein sirf 2 minute me Telegram se mil jaati hain
    telegramBotToken: "YOUR_TELEGRAM_BOT_TOKEN", 
    telegramChatId: "YOUR_TELEGRAM_CHAT_ID",
    isLive: true,                           // Automation ON
    currentPosition: null,
    symbol: "BTCUSD"
};

// ==========================================
// Send Smart Signal To Telegram Channel
// ==========================================
RJExecutor.executeMT5Order = async function(decision, currentPrice) {
    if (!this.isLive) return;
    if (this.currentPosition !== null) return;

    let side = "";
    if (decision === "BUY" || decision === "STRONG BUY") side = "BUY";
    if (decision === "SELL" || decision === "STRONG SELL") side = "SELL";

    if (side === "") return;

    // Risk Control Settings (Chhota Loss / Bada Profit)
    let stopLoss = side === "BUY" ? currentPrice - 200 : currentPrice + 200;  
    let takeProfit = side === "BUY" ? currentPrice + 400 : currentPrice - 400; 

    // Perfect Format jo Telegram Copier Bots automatic samajhte hain
    let signalMessage = `📢 **RJAnalyser AI SIGNAL**\n\n` +
                        `🔹 **Action:** ${side}\n` +
                        `🔹 **Asset:** ${this.symbol}\n` +
                        `🔹 **Entry:** ${currentPrice}\n` +
                        `🛑 **SL:** ${stopLoss.toFixed(2)}\n` +
                        `🎯 **TP:** ${takeProfit.toFixed(2)}`;

    console.log(`🚀 RJExecutor: Sending Mobile Signal to Telegram...`);

    try {
        const url = `https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: this.telegramChatId,
                text: signalMessage,
                parse_mode: "Markdown"
            })
        });
        
        console.log("✅ Mobile Signal posted to Telegram Group!");
        this.currentPosition = { side: side, status: "OPEN" };
    } catch (error) {
        console.error("❌ Telegram Bridge Safety Triggered:", error);
    }
};
