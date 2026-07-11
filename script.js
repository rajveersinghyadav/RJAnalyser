/* =====================================================
   RJAnalyser AI
   SCRIPT.JS - FULL INTEGRATED AUTOMATED BUILD
===================================================== */

/* ======================================
   APP START
====================================== */
window.addEventListener("load", () => {
    initializeApp();
});

/* ======================================
   INITIALIZE
====================================== */
function initializeApp(){
    loadQuotes();
    loadTradingView(
        getTVSymbol(RJState.asset),
        RJState.timeframe.replace("m","").replace("H","60").replace("D","1D")
    );
    initTimeframes();
    updateSelectedAsset();
    switchView("chart"); // Default view set to Chart
    analyseMarket();
}

/* ======================================
   UPDATE TOP BAR
====================================== */
function updateSelectedAsset(){
    const btn = document.getElementById("selectedAsset");
    if(btn){
        btn.innerHTML = RJState.asset + " ▼";
    }
}

/* ======================================
   TRADINGVIEW SYMBOL
====================================== */
function getTVSymbol(asset){
    if(RJAssets.forex.includes(asset)) return "FX:" + asset;
    if(RJAssets.commodities.includes(asset)) return "OANDA:" + asset;
    if(RJAssets.indices.includes(asset)) return "FOREXCOM:" + asset;
    return "BINANCE:" + asset;
}

/* ======================================
   CHANGE ASSET
====================================== */
function selectAsset(asset){
    RJState.asset = asset;
    updateSelectedAsset();
    loadTradingView(getTVSymbol(asset), RJState.timeframe);
    analyseMarket();
}

/* ======================================
   TIMEFRAME BUTTONS
====================================== */
function initTimeframes(){
    document.querySelectorAll(".timeframes button").forEach(btn=>{
        btn.onclick = function(){
            document.querySelectorAll(".timeframes button").forEach(b=>b.classList.remove("active"));
            this.classList.add("active");
            RJState.timeframe = this.innerText;
            loadTradingView(getTVSymbol(RJState.asset), RJState.timeframe);
            analyseMarket();
        };
    });
}

/* ======================================
   DYNAMIC PAGE ROUTER (REPLACES OLD NAV)
====================================== */
function switchView(viewName) {
    // Structural switching alignment
    document.querySelectorAll('.page, .app').forEach(el => {
        el.classList.remove('active');
        el.style.display = 'none'; // Fallback mapping compatibility
    });
    
    const target = document.getElementById(viewName + 'Page');
    if(target) {
        target.classList.add('active');
        target.style.display = (viewName === 'chart') ? 'flex' : 'block';
    }
}

/* ======================================
   BOTTOM NAVIGATION CONTROLLER
====================================== */
document.querySelectorAll(".bottom-nav button").forEach((btn, index)=>{
    btn.onclick = function(){
        document.querySelectorAll(".bottom-nav button").forEach(b=>b.classList.remove("active"));
        this.classList.add("active");

        switch(index){
            case 0: switchView("quotes"); break;
            case 1: switchView("chart"); break;
            case 2: switchView("trade"); break;
            case 3: switchView("history"); break;
            case 4: switchView("settings"); break;
            case 5: switchView("ai"); break;
        }
    };
});

/* =====================================================
   PART 2 - LIVE MARKET ENGINE
===================================================== */

function getBinanceInterval(tf){
    switch(tf){
        case "1m": return "1m";
        case "5m": return "5m";
        case "15m": return "15m";
        case "1H": return "1h";
        case "4H": return "4h";
        case "1D": return "1d";
        default: return "15m";
    }
}

async function getCandles(){
    try{
        if(!RJState.asset.includes("USDT")){
            return [];
        }
        const url = `https://api.binance.com/api/v3/klines?symbol=${RJState.asset}&interval=${getBinanceInterval(RJState.timeframe)}&limit=100`;
        const response = await fetch(url);
        if(!response.ok) throw new Error("Network Error");
        const data = await response.json();
        return data.map(c=>({
            open:Number(c[1]),
            high:Number(c[2]),
            low:Number(c[3]),
            close:Number(c[4]),
            volume:Number(c[5])
        }));
    }
    catch(error){
        console.error("Binance Error:",error);
        updateOfflineStatus();
        return [];
    }
}

function updateOfflineStatus(){
    setText("trend","Offline");
    setText("signal","WAIT");
    setText("confidence","0%");
    setText("aiSignal","WAIT");
    setText("signalStrength","0%");
    setText("buyerPower","0%");
    setText("sellerPower","0%");
    setText("reason","Unable to fetch live market data.");
}

function setText(id,value){
    const el=document.getElementById(id);
    if(el) el.innerHTML=value;
}

/* =====================================================
   PART 3 - AI ENGINE CONNECTION & ROUTING LINK
===================================================== */

async function analyseMarket(){
    const candles = await getCandles();
    if(!candles || candles.length < 20){
        updateOfflineStatus();
        return;
    }

    let aiResult;
    try{
        aiResult = RJSignalEngine(candles);
    } catch(error) {
        console.error("RJSignalEngine Error:", error);
        return;
    }
    updateAIPanel(aiResult, candles);
}

function updateAIPanel(result, candles){
    setText("aiSignal", result.signal);
    setText("signalStrength", result.strength + "%");
    setText("buyerPower", result.buyer + "%");
    setText("sellerPower", result.seller + "%");
    setText("confidence", result.confidence + "%");
    setText("reason", result.reason);

    updateTrend(candles, result); // Integrated result connection pass
    updateStrength(result);
    updateTarget(candles, result);
}

function updateTrend(candles, result){
    const last = candles[candles.length-1];
    const prev = candles[candles.length-2];
    let trend="SIDEWAYS";
    let signal="WAIT";

    if(last.close > prev.close){
        trend="BULLISH";
        signal="BUY";
    } else if(last.close < prev.close){
        trend="BEARISH";
        signal="SELL";
    }

    setText("trend", trend);
    setText("signal", signal);

    // ==========================================
    // 🚀 FULL AUTOMATION LOOP (ENGINE TO BROKER BRIDGE)
    // ==========================================
    if (signal === "BUY" || signal === "SELL") {
        if (typeof RJExecutor !== 'undefined' && typeof RJExecutor.executeMT5Order === 'function') {
            console.log(`🤖 Auto-Engine Trigger: Sending global ${signal} execution command...`);
            RJExecutor.executeMT5Order(signal, last.close);
        }
    }
}

function updateStrength(result){
    let buyer="Weak";
    let seller="Weak";
    if(result.buyer>=70) buyer="Very Strong";
    else if(result.buyer>=55) buyer="Strong";
    if(result.seller>=70) seller="Very Strong";
    else if(result.seller>=55) seller="Strong";
    setText("buyerStrength", buyer);
    setText("sellerStrength", seller);
}

function updateTarget(candles, result){
    const last = candles[candles.length-1];
    let target = last.close;
    if(result.signal==="BUY") target = last.close * 1.005;
    else if(result.signal==="SELL") target = last.close * 0.995;
    setText("dynamicTarget", target.toFixed(2));
}

/* =====================================================
   PART 4 - QUOTES + AI ASSISTANT
===================================================== */

function loadQuotes(){
    const box = document.getElementById("quotesList");
    if(!box) return;
    box.innerHTML = "";
    const markets = [...RJAssets.crypto, ...RJAssets.forex, ...RJAssets.commodities, ...RJAssets.indices];
    
    markets.forEach(asset=>{
        const item = document.createElement("div");
        item.className = "quote-item";
        item.innerHTML = `<div><b>${asset}</b><small>Tap to Open Chart</small></div><span>›</span>`;
        item.onclick = ()=>{
            selectAsset(asset);
            switchView("chart");
        };
        box.appendChild(item);
    });
}

function searchQuotes(){
    const value = document.getElementById("quoteSearch").value.toUpperCase();
    document.querySelectorAll(".quote-item").forEach(item=>{
        item.style.display = item.innerText.toUpperCase().includes(value) ? "flex" : "none";
    });
}

function askRJAI(){
    const input = document.getElementById("aiQuestion");
    if(!input) return;
    const question = input.value.trim();
    if(question==="") return;
    const chat = document.getElementById("aiChatBox");

    chat.innerHTML += `<div class="user-message">👤 ${question}</div>`;
    const answer = generateAIReply(question);
    chat.innerHTML += `<div class="ai-message">🤖 ${answer}</div>`;
    chat.scrollTop = chat.scrollHeight;
    input.value="";
}

function generateAIReply(question){
    const q = question.toLowerCase();
    if(q.includes("buy")) return "Current market data is being analyzed before confirming a BUY opportunity.";
    if(q.includes("sell")) return "RJ AI is checking seller pressure before confirming a SELL.";
    if(q.includes("trend")) return document.getElementById("trend")?.innerText || "Trend unavailable.";
    if(q.includes("signal")) return document.getElementById("aiSignal")?.innerText || "Signal unavailable.";
    if(q.includes("confidence")) return document.getElementById("confidence")?.innerText || "Confidence unavailable.";
    return "Learning... This feature will become smarter after the AI Brain module is connected.";
}

window.addEventListener("load",()=>{
    const input = document.getElementById("aiQuestion");
    if(input){
        input.addEventListener("keypress", e => {
            if(e.key==="Enter") askRJAI();
        });
    }
});

/* =====================================================
   PART 5 - FINAL STABLE RUNTIME MANAGER
===================================================== */

const RJRuntime = {
    online: true,
    lastUpdate: null,
    refreshTime: 30000,
    analysing: false
};

async function safeAnalyse(){
    if(RJRuntime.analysing) return;
    RJRuntime.analysing = true;
    try{
        await analyseMarket();
        RJRuntime.online = true;
        RJRuntime.lastUpdate = new Date();
        updateSystemStatus();
    } catch(error){
        console.error(error);
        RJRuntime.online = false;
        updateSystemStatus();
    }
    RJRuntime.analysing = false;
}

function updateSystemStatus(){
    const learning = document.getElementById("learningStatus");
    const data = document.getElementById("dataStatus");
    if(learning) learning.innerHTML = RJRuntime.online ? "🟢 AI Monitoring Live Market" : "🔴 Connection Lost";
    if(data) data.innerHTML = RJRuntime.online ? "Receiving Live Candles" : "Waiting For Data";
}

function startBackgroundEngine(){
    safeAnalyse();
    setInterval(()=>{
        safeAnalyse();
    }, RJRuntime.refreshTime);
}

document.addEventListener("visibilitychange", ()=>{
    if(!document.hidden) safeAnalyse();
});

window.addEventListener("online", ()=>{
    RJRuntime.online = true;
    safeAnalyse();
});

window.addEventListener("offline", ()=>{
    RJRuntime.online = false;
    updateSystemStatus();
});

window.addEventListener("load", ()=>{
    startBackgroundEngine();
    updateSystemStatus();
});

console.log("====================================");
console.log("RJAnalyser AI Stable Build Loaded V5.0");
console.log("Founder: Rajveer | Status: FULLY AUTOMATED & READY");
console.log("====================================");
