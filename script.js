/* ==========================================
   RJAnalyser AI
   Main Script V3 - Real Candle Engine
========================================== */

window.onload = async function () {

    try{

        // Load AI Memory
        if(typeof RJMemory !== "undefined"){
            RJMemory.loadFromDisk();
        }

        // Build Asset Lists
        loadMarket();

        // Load Default Chart
        loadTradingView();

        // Run First Analysis
        await analyseMarket();

    }

    catch(error){

        console.error("RJAnalyser Startup Error:", error);

    }

};

/* ===========================
   Load Market
=========================== */

function loadMarket(){

    createList("forexList",RJAssets.forex);

    createList("cryptoList",RJAssets.crypto);

    createList("commodityList",RJAssets.commodities);

    createList("indicesList",RJAssets.indices);

}


/* ===========================
   Create List
=========================== */

function createList(id,list){

    const box=document.getElementById(id);

    if(!box) return;

    box.innerHTML="";

    list.forEach(asset=>{

        const div=document.createElement("div");

        div.className="asset";

        div.innerHTML=asset;


        if(asset==RJState.asset){

            div.classList.add("active");

        }


        div.onclick=function(){

            selectAsset(asset);

        };


        box.appendChild(div);

    });

}


/* ===========================
   Select Asset
=========================== */

async function selectAsset(asset){

    RJState.asset = asset;

    const selected = document.getElementById("selectedAsset");

    if(selected){

        selected.innerHTML = asset;

    }


    removeSelection();

    highlight(asset);


    let symbol="BINANCE:"+asset;


    if(RJAssets.forex.includes(asset)){

        symbol="FX:"+asset;

    }


    if(RJAssets.commodities.includes(asset)){

        symbol="OANDA:"+asset;

    }


    if(RJAssets.indices.includes(asset)){

        symbol="FOREXCOM:"+asset;

    }


    loadTradingView(symbol, RJState.timeframe);

await analyseMarket();

}



/* ===========================
   Highlight
=========================== */

function removeSelection(){

    document.querySelectorAll(".asset")
    .forEach(item=>{

        item.classList.remove("active");

    });

}


function highlight(asset){

    document.querySelectorAll(".asset")
    .forEach(item=>{

        if(item.innerHTML===asset){

            item.classList.add("active");

        }

    });

}



/* ==========================================
   Binance Live Candle Data
========================================== */


async function getCandles(symbol="BTCUSDT"){

    try{


        let url =
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=5m&limit=50`;


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

    catch(error){

        console.log(error);

    }

}



/* ==========================================
   AI Candle Analysis Engine
========================================== */


async function analyseMarket(){

    let asset = RJState.asset;

    // Convert selected asset to Binance symbol
    if(!asset.includes("USDT")){

        if(asset === "BTCUSD") asset = "BTCUSDT";
        else if(asset === "ETHUSD") asset = "ETHUSDT";
        else asset = "BTCUSDT";

    }



const candles = await getCandles(asset);

if(!candles || candles.length < 50){

    console.warn("Not enough candle data.");

    return;

}
   let strength = buyerSellerEngine(candles);

console.log("Buyer Strength:", strength);
   alert(

"Buyer Strength: " + strength.buyer +

"\nSeller Strength: " + strength.seller +

"\n" + strength.control

);
if(!candles) return;



// AI Core Analysis

const ai = RJEngine.analyse(candles);

if(!ai){

    return;

}

const last = candles[candles.length-1];

const trend = ai.features.momentum;

const signal = ai.brain
    ? ai.brain.finalDecision
    : ai.pattern.signal;







const confidence = ai.confidence;



document.getElementById("trend").innerHTML =
trend;



document.getElementById("signal").innerHTML =
signal;



document.getElementById("confidence").innerHTML =
confidence+"%";



document.getElementById("entry").innerHTML =
last.close.toFixed(2);

let volatility = 0;

candles.forEach(c => {
    volatility += (c.high - c.low);
});

volatility = volatility / candles.length;


let entry = last.close;

let stopLoss;
let target1;
let target2;
let target3;


if(signal === "BUY"){

    stopLoss = entry - volatility;

    target1 = entry + volatility;

    target2 = entry + (volatility * 2);

    target3 = entry + (volatility * 3);

}


if(signal === "SELL"){

    stopLoss = entry + volatility;

    target1 = entry - volatility;

    target2 = entry - (volatility * 2);

    target3 = entry - (volatility * 3);

}


document.getElementById("sl").innerHTML =
stopLoss.toFixed(2);


document.getElementById("tp1").innerHTML =
target1.toFixed(2);


document.getElementById("tp2").innerHTML =
target2.toFixed(2);


document.getElementById("tp3").innerHTML =
target3.toFixed(2);


document.getElementById("move").innerHTML =
volatility.toFixed(2)+" Points";

document.getElementById("reason").innerHTML =

"AI analyzed live candle movement, price action and recent market momentum.";



document.getElementById("score").innerHTML =
confidence+" / 100";


}





/* ==========================================
   Timeframe Change
========================================== */


document.querySelectorAll(".timeframes button")
.forEach(button=>{


button.onclick=function(){


document.querySelectorAll(".timeframes button")
.forEach(btn=>btn.classList.remove("active"));


this.classList.add("active");


RJState.timeframe=this.innerText;


selectAsset(RJState.asset);



};


});



/* Auto Refresh */

setInterval(()=>{

analyseMarket();

},30000);
/* ==========================================
   RJAnalyser Buyer Seller Strength Engine V1
========================================== */

function buyerSellerEngine(candles){

    let buyerScore = 0;
    let sellerScore = 0;


    // Last 10 candles analysis

    let recentCandles = candles.slice(-10);


    recentCandles.forEach(candle => {


        let body = candle.close - candle.open;

        let range = candle.high - candle.low;


        if(range === 0) return;


        let strength = Math.abs(body) / range * 100;


        // Buyer pressure

        if(body > 0){

            buyerScore += strength;

        }


        // Seller pressure

        if(body < 0){

            sellerScore += strength;

        }


        // Close position analysis

        if(candle.close > candle.open){

            buyerScore += 5;

        }
        else{

            sellerScore += 5;

        }


    });



    // Convert to percentage

    let total = buyerScore + sellerScore;


    if(total === 0){

        total = 1;

    }


    buyerScore =
    Math.round((buyerScore / total) * 100);


    sellerScore =
    Math.round((sellerScore / total) * 100);



    let control="NEUTRAL";


    if(buyerScore > sellerScore){

        control="BUYERS DOMINATING";

    }


    if(sellerScore > buyerScore){

        control="SELLERS DOMINATING";

    }



    return {

        buyer: buyerScore,

        seller: sellerScore,

        control: control

    };


}
/* ======================================
   RJAnalyser App Navigation V1
====================================== */


function showPage(page){

    // Hide all pages
    document.getElementById("quotesPage").style.display = "none";
    document.getElementById("aiPage").style.display = "none";

    // Show Dashboard
    document.querySelector(".app").style.display = "flex";

    if(page==="quotes"){

        document.querySelector(".app").style.display = "none";
        document.getElementById("quotesPage").style.display = "block";

    }

    if(page==="chart"){

        document.querySelector(".app").style.display = "flex";

    }

    if(page==="ai"){

        document.querySelector(".app").style.display = "none";
        document.getElementById("aiPage").style.display = "block";

    }

}

}
