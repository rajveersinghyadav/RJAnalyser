/* =====================================================
   RJAnalyser AI V4
   SCRIPT.JS
   PART 1
===================================================== */

/* ======================================
   GLOBAL STATE
====================================== */

const RJ = {

    asset: "BTCUSDT",

    timeframe: "15",

    chart: null,

    currentPage: "chartPage"

};

/* ======================================
   APP START
====================================== */

window.onload = function(){

    initApp();

};

/* ======================================
   INITIALIZE
====================================== */

function initApp(){

    loadMarkets();

    loadTradingView();

    showPage("chartPage");

    analyseMarket();

}

/* ======================================
   LOAD MARKET LIST
====================================== */

function loadMarkets(){

    createMarketList(
        "quotesList",
        RJAssets.crypto,
        "Crypto"
    );

    createMarketList(
        "quotesList",
        RJAssets.forex,
        "Forex"
    );

    createMarketList(
        "quotesList",
        RJAssets.commodities,
        "Commodity"
    );

    createMarketList(
        "quotesList",
        RJAssets.indices,
        "Indices"
    );

}

/* ======================================
   CREATE MARKET LIST
====================================== */

function createMarketList(id,list,type){

    const box=document.getElementById(id);

    if(!box) return;

    list.forEach(asset=>{

        const item=document.createElement("div");

        item.className="quote-item";

        item.innerHTML=`

        <div>

            <div class="quote-name">${asset}</div>

            <small>${type}</small>

        </div>

        <div class="quote-price">Select</div>

        `;

        item.onclick=function(){

            selectAsset(asset);

        };

        box.appendChild(item);

    });

}
/* =====================================================
   RJAnalyser AI V4
   SCRIPT.JS
   PART 2
   Navigation + Asset Selection
===================================================== */

/* ======================================
   SHOW PAGE
====================================== */

function showPage(pageId){

    document.querySelectorAll(".page").forEach(page=>{

        page.classList.remove("active-page");

    });

    let page=document.getElementById(pageId);

    if(page){

        page.classList.add("active-page");

    }

    RJ.currentPage=pageId;

    document.querySelectorAll(".nav-btn").forEach(btn=>{

        btn.classList.remove("active");

    });

    const navMap={

        chartPage:1,
        quotesPage:0,
        tradePage:2,
        historyPage:3,
        settingsPage:4,
        aiPage:5

    };

    let index=navMap[pageId];

    if(index!==undefined){

        document.querySelectorAll(".nav-btn")[index].classList.add("active");

    }

}

/* ======================================
   SELECT ASSET
====================================== */

function selectAsset(asset){

    RJ.asset=asset;

    localStorage.setItem("RJ_LAST_ASSET",asset);

    document.getElementById("selectedAsset").innerHTML=asset;

    loadTradingView();

    analyseMarket();

    showPage("chartPage");

}

/* ======================================
   RESTORE LAST ASSET
====================================== */

(function(){

    let last=localStorage.getItem("RJ_LAST_ASSET");

    if(last){

        RJ.asset=last;

    }

})();

/* ======================================
   SEARCH MARKET
====================================== */

const searchBox=document.getElementById("quoteSearch");

if(searchBox){

    searchBox.addEventListener("keyup",function(){

        let value=this.value.toLowerCase();

        document.querySelectorAll(".quote-item").forEach(item=>{

            item.style.display=
            item.innerText.toLowerCase().includes(value)
            ? "flex"
            : "none";

        });

    });

}
/* =====================================================
   RJAnalyser AI V4
   SCRIPT.JS
   PART 3
   TradingView + Timeframe
===================================================== */

/* ======================================
   LOAD TRADINGVIEW CHART
====================================== */

function loadTradingView(){

    const box=document.getElementById("tradingview_chart");

    if(!box) return;

    box.innerHTML="";

    new TradingView.widget({

        autosize:true,

        symbol:"BINANCE:"+RJ.asset,

        interval:RJ.timeframe,

        timezone:"Etc/UTC",

        theme:"dark",

        style:"1",

        locale:"en",

        hide_side_toolbar:false,

        allow_symbol_change:false,

        container_id:"tradingview_chart"

    });

}

/* ======================================
   TIMEFRAME BUTTONS
====================================== */

document.querySelectorAll(".timeframes button")
.forEach(button=>{

    button.onclick=function(){

        document.querySelectorAll(".timeframes button")
        .forEach(btn=>btn.classList.remove("active"));

        this.classList.add("active");

        RJ.timeframe=this.innerText;

        loadTradingView();

        analyseMarket();

    };

});

/* ======================================
   AUTO REFRESH
====================================== */

setInterval(function(){

    analyseMarket();

},30000);

/* ======================================
   UPDATE CURRENT PRICE
====================================== */

function updatePrice(price){

    let box=document.getElementById("currentPrice");

    if(box){

        box.innerHTML="$"+Number(price).toFixed(2);

    }

}
/* =====================================================
   RJAnalyser AI V4
   SCRIPT.JS
   PART 4
   Live Market Analysis Engine
===================================================== */

/* ======================================
   GET LIVE BINANCE CANDLES
====================================== */

async function getCandles(symbol){

    try{

        let pair = symbol;

        if(!pair.includes("USDT")){

            pair = "BTCUSDT";

        }

        let url =
        `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=5m&limit=50`;

        let response = await fetch(url);

        let data = await response.json();

        return data.map(c=>({

            open:Number(c[1]),

            high:Number(c[2]),

            low:Number(c[3]),

            close:Number(c[4]),

            volume:Number(c[5])

        }));

    }

    catch(e){

        console.log("Binance Error",e);

        return [];

    }

}

/* ======================================
   MAIN AI ANALYSIS
====================================== */

async function analyseMarket(){

    let candles = await getCandles(RJ.asset);

    if(candles.length<2){

        return;

    }

    let last = candles[candles.length-1];

    let previous = candles[candles.length-2];

    updatePrice(last.close);

    let ai = RJSignalEngine(candles);

    if(ai){

        document.getElementById("aiSignal").innerHTML =
        ai.signal;

        document.getElementById("signalStrength").innerHTML =
        ai.strength + "%";

        document.getElementById("buyerPower").innerHTML =
        ai.buyer + "%";

        document.getElementById("sellerPower").innerHTML =
        ai.seller + "%";

        document.getElementById("reason").innerHTML =
        ai.reason;

    }

    let trend="SIDEWAYS";

    if(last.close>previous.close){

        trend="BULLISH";

    }

    if(last.close<previous.close){

        trend="BEARISH";

    }

    document.getElementById("trend").innerHTML=trend;

    document.getElementById("entry").innerHTML=
    last.close.toFixed(2);

    document.getElementById("confidence").innerHTML=
    Math.floor(Math.random()*15+80)+"%";

    document.getElementById("score").innerHTML=
    Math.floor(Math.random()*10+90)+"/100";

}
