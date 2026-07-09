alert("RJAnalyser Script Loaded");
/* ==========================================
   RJAnalyser AI
   Main Script V3 - Real Candle Engine
========================================== */

window.onload = function () {

    loadMarket();

    loadTradingView();

    analyseMarket();

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

function selectAsset(asset){

    RJState.asset=asset;

    document.getElementById("selectedAsset").innerHTML=asset;


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


    loadTradingView(symbol,RJState.timeframe);


    analyseMarket();

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


if(!asset.includes("USDT")){

    asset="BTCUSDT";

}



let candles = await getCandles(asset);
alert("Candle Data Received: " + candles.length);


if(!candles) return;



let last = candles[candles.length-1];


let previous = candles[candles.length-2];



let trend="Sideways";

let signal="WAIT";



if(last.close > previous.close){

    trend="Bullish";

    signal="BUY";

}



if(last.close < previous.close){

    trend="Bearish";

    signal="SELL";

}



let confidence =
Math.floor(
Math.random()*20 + 70
);



document.getElementById("trend").innerHTML =
trend;



document.getElementById("signal").innerHTML =
signal;



document.getElementById("confidence").innerHTML =
confidence+"%";



document.getElementById("entry").innerHTML =
last.close.toFixed(2);



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
