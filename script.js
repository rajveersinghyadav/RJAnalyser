/* =====================================================
   RJAnalyser AI
   SCRIPT.JS
   PART 1 - FOUNDATION
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

    showPage("chart");

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

    if(RJAssets.forex.includes(asset))
        return "FX:" + asset;

    if(RJAssets.commodities.includes(asset))
        return "OANDA:" + asset;

    if(RJAssets.indices.includes(asset))
        return "FOREXCOM:" + asset;

    return "BINANCE:" + asset;

}

/* ======================================
   CHANGE ASSET
====================================== */

function selectAsset(asset){

    RJState.asset = asset;

    updateSelectedAsset();

    loadTradingView(

        getTVSymbol(asset),

        RJState.timeframe

    );

    analyseMarket();

}

/* ======================================
   TIMEFRAME BUTTONS
====================================== */

function initTimeframes(){

    document
    .querySelectorAll(".timeframes button")
    .forEach(btn=>{

        btn.onclick = function(){

            document
            .querySelectorAll(".timeframes button")
            .forEach(b=>b.classList.remove("active"));

            this.classList.add("active");

            RJState.timeframe = this.innerText;

            loadTradingView(

                getTVSymbol(RJState.asset),

                RJState.timeframe

            );

            analyseMarket();

        };

    });

}

/* ======================================
   PAGE NAVIGATION
====================================== */

function showPage(page){

    document
    .querySelectorAll(".page")
    .forEach(p=>p.style.display="none");

    document
    .querySelector(".chart-section")
    .style.display="none";

    document
    .querySelector(".ai-panel")
    .style.display="none";

    switch(page){

        case "quotes":

            document
            .getElementById("quotesPage")
            .style.display="block";

        break;

        case "ai":

            document
            .getElementById("aiPage")
            .style.display="block";

        break;

        default:

            document
            .querySelector(".chart-section")
            .style.display="flex";

            document
            .querySelector(".ai-panel")
            .style.display="block";

    }

}

/* ======================================
   BOTTOM NAVIGATION
====================================== */

document
.querySelectorAll(".bottom-nav button")
.forEach((btn,index)=>{

    btn.onclick = function(){

        document
        .querySelectorAll(".bottom-nav button")
        .forEach(b=>b.classList.remove("active"));

        this.classList.add("active");

        switch(index){

            case 0:

                showPage("quotes");

            break;

            case 1:

                showPage("chart");

            break;

            case 5:

                showPage("ai");

            break;

            default:

                alert("Coming Soon");

        }

    };

});
/* =====================================================
   RJAnalyser AI
   SCRIPT.JS
   PART 2 - LIVE MARKET ENGINE
===================================================== */

/* ======================================
   BINANCE INTERVAL
====================================== */

function getBinanceInterval(tf){

    switch(tf){

        case "1m": return "1m";
        case "5m": return "5m";
        case "15m": return "15m";
        case "1H": return "1h";
        case "4H": return "4h";
        case "1D": return "1d";

        default:
            return "15m";

    }

}

/* ======================================
   LIVE CANDLE DOWNLOAD
====================================== */

async function getCandles(){

    try{

        if(!RJState.asset.includes("USDT")){

            return [];

        }

        const url =
        `https://api.binance.com/api/v3/klines?symbol=${RJState.asset}&interval=${getBinanceInterval(RJState.timeframe)}&limit=100`;

        const response = await fetch(url);

        if(!response.ok){

            throw new Error("Network Error");

        }

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

/* ======================================
   OFFLINE STATUS
====================================== */

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

/* ======================================
   SAFE HTML UPDATE
====================================== */

function setText(id,value){

    const el=document.getElementById(id);

    if(el){

        el.innerHTML=value;

    }

}

/* ======================================
   AUTO REFRESH
====================================== */

function startLiveEngine(){

    analyseMarket();

    setInterval(()=>{

        analyseMarket();

    },30000);

}
/* =====================================================
   RJAnalyser AI
   SCRIPT.JS
   PART 3 - AI ENGINE CONNECTION
===================================================== */

/* ======================================
   MAIN MARKET ANALYSIS
====================================== */

async function analyseMarket(){

    const candles = await getCandles();

    if(!candles || candles.length < 20){

        updateOfflineStatus();

        return;

    }

    let aiResult;

    try{

        aiResult = RJSignalEngine(candles);

    }

    catch(error){

        console.error("RJSignalEngine Error:", error);

        return;

    }

    updateAIPanel(aiResult, candles);

}

/* ======================================
   UPDATE AI PANEL
====================================== */

function updateAIPanel(result,candles){

    setText("aiSignal", result.signal);

    setText("signalStrength", result.strength + "%");

    setText("buyerPower", result.buyer + "%");

    setText("sellerPower", result.seller + "%");

    setText("confidence", result.confidence + "%");

    setText("reason", result.reason);

    updateTrend(candles);

    updateStrength(result);

    updateTarget(candles,result);

}

/* ======================================
   TREND
====================================== */

function updateTrend(candles){

    const last = candles[candles.length-1];

    const prev = candles[candles.length-2];

    let trend="SIDEWAYS";

    let signal="WAIT";

    if(last.close > prev.close){

        trend="BULLISH";

        signal="BUY";

    }

    else if(last.close < prev.close){

        trend="BEARISH";

        signal="SELL";

    }

    setText("trend",trend);

    setText("signal",signal);

}

/* ======================================
   BUYER SELLER STRENGTH
====================================== */

function updateStrength(result){

    let buyer="Weak";

    let seller="Weak";

    if(result.buyer>=70) buyer="Very Strong";
    else if(result.buyer>=55) buyer="Strong";

    if(result.seller>=70) seller="Very Strong";
    else if(result.seller>=55) seller="Strong";

    setText("buyerStrength",buyer);

    setText("sellerStrength",seller);

}

/* ======================================
   DYNAMIC TARGET
====================================== */

function updateTarget(candles,result){

    const last = candles[candles.length-1];

    let target = last.close;

    if(result.signal==="BUY"){

        target = last.close * 1.005;

    }

    else if(result.signal==="SELL"){

        target = last.close * 0.995;

    }

    setText("dynamicTarget", target.toFixed(2));

}
/* =====================================================
   RJAnalyser AI
   SCRIPT.JS
   PART 4 - QUOTES + AI ASSISTANT
===================================================== */

/* ======================================
   LOAD QUOTES
====================================== */

function loadQuotes(){

    const box = document.getElementById("quotesList");

    if(!box) return;

    box.innerHTML = "";

    const markets = [

        ...RJAssets.crypto,

        ...RJAssets.forex,

        ...RJAssets.commodities,

        ...RJAssets.indices

    ];

    markets.forEach(asset=>{

        const item = document.createElement("div");

        item.className = "quote-item";

        item.innerHTML = `

            <div>

                <b>${asset}</b>

                <small>Tap to Open Chart</small>

            </div>

            <span>›</span>

        `;

        item.onclick = ()=>{

            selectAsset(asset);

            showPage("chart");

        };

        box.appendChild(item);

    });

}

/* ======================================
   SEARCH QUOTES
====================================== */

function searchQuotes(){

    const value = document
        .getElementById("quoteSearch")
        .value
        .toUpperCase();

    document
        .querySelectorAll(".quote-item")
        .forEach(item=>{

            item.style.display =
                item.innerText.toUpperCase().includes(value)
                ? "flex"
                : "none";

        });

}

/* ======================================
   AI CHAT
====================================== */

function askRJAI(){

    const input = document.getElementById("aiQuestion");

    if(!input) return;

    const question = input.value.trim();

    if(question==="") return;

    const chat = document.getElementById("aiChatBox");

    chat.innerHTML += `

        <div class="user-message">

            👤 ${question}

        </div>

    `;

    const answer = generateAIReply(question);

    chat.innerHTML += `

        <div class="ai-message">

            🤖 ${answer}

        </div>

    `;

    chat.scrollTop = chat.scrollHeight;

    input.value="";

}

/* ======================================
   SIMPLE AI REPLY
====================================== */

function generateAIReply(question){

    const q = question.toLowerCase();

    if(q.includes("buy"))

        return "Current market data is being analyzed before confirming a BUY opportunity.";

    if(q.includes("sell"))

        return "RJ AI is checking seller pressure before confirming a SELL.";

    if(q.includes("trend"))

        return document.getElementById("trend")?.innerText || "Trend unavailable.";

    if(q.includes("signal"))

        return document.getElementById("aiSignal")?.innerText || "Signal unavailable.";

    if(q.includes("confidence"))

        return document.getElementById("confidence")?.innerText || "Confidence unavailable.";

    return "Learning... This feature will become smarter after the AI Brain module is connected.";

}

/* ======================================
   KEEP CHAT SIZE LIMITED
====================================== */

function trimChat(){

    const chat = document.getElementById("aiChatBox");

    if(!chat) return;

    while(chat.children.length > 40){

        chat.removeChild(chat.firstChild);

    }

}

/* ======================================
   ENTER KEY SUPPORT
====================================== */

window.addEventListener("load",()=>{

    const input = document.getElementById("aiQuestion");

    if(input){

        input.addEventListener("keypress",e=>{

            if(e.key==="Enter"){

                askRJAI();

            }

        });

    }

});
/* =====================================================
   RJAnalyser AI
   SCRIPT.JS
   PART 5 - FINAL STABLE BUILD
===================================================== */

/* ======================================
   APP STATUS
====================================== */

const RJRuntime = {

    online: true,

    lastUpdate: null,

    refreshTime: 30000,

    analysing: false

};

/* ======================================
   SAFE ANALYSIS
====================================== */

async function safeAnalyse(){

    if(RJRuntime.analysing) return;

    RJRuntime.analysing = true;

    try{

        await analyseMarket();

        RJRuntime.online = true;

        RJRuntime.lastUpdate = new Date();

        updateSystemStatus();

    }

    catch(error){

        console.error(error);

        RJRuntime.online = false;

        updateSystemStatus();

    }

    RJRuntime.analysing = false;

}

/* ======================================
   SYSTEM STATUS
====================================== */

function updateSystemStatus(){

    const learning = document.getElementById("learningStatus");

    const data = document.getElementById("dataStatus");

    if(learning){

        learning.innerHTML =

        RJRuntime.online ?

        "🟢 AI Monitoring Live Market"

        :

        "🔴 Connection Lost";

    }

    if(data){

        data.innerHTML =

        RJRuntime.online ?

        "Receiving Live Candles"

        :

        "Waiting For Data";

    }

}

/* ======================================
   AUTO REFRESH
====================================== */

function startBackgroundEngine(){

    safeAnalyse();

    setInterval(()=>{

        safeAnalyse();

    },RJRuntime.refreshTime);

}

/* ======================================
   PAGE VISIBILITY
====================================== */

document.addEventListener(

    "visibilitychange",

    ()=>{

        if(!document.hidden){

            safeAnalyse();

        }

    }

);

/* ======================================
   NETWORK CHANGE
====================================== */

window.addEventListener(

    "online",

    ()=>{

        RJRuntime.online = true;

        safeAnalyse();

    }

);

window.addEventListener(

    "offline",

    ()=>{

        RJRuntime.online = false;

        updateSystemStatus();

    }

);

/* ======================================
   FINAL START
====================================== */

window.addEventListener(

    "load",

    ()=>{

        startBackgroundEngine();

        updateSystemStatus();

    }

);

/* ======================================
   VERSION
====================================== */

console.log(

"===================================="

);

console.log(

"RJAnalyser AI Stable Build Loaded"

);

console.log(

"Version : 5.0"

);

console.log(

"Founder : Rajveer"

);

console.log(

"Status : READY"

);

console.log(

"====================================");
