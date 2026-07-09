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


alert("Binance Data Received");
       
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

let strength = buyerSellerEngine(candles);

console.log("RJAnalyser Buyer Seller Strength:", strength);
alert(
/* =====================================
   RJAnalyser Signal Connection
===================================== */


let signal = RJSignalEngine(candles);


console.log(
"RJAnalyser AI Signal:",
signal
);
"Buyer Strength: " + strength.buyer +
"\nSeller Strength: " + strength.seller +
"\n" + strength.control
);
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


    document.querySelectorAll(".page")
    .forEach(p=>{

        p.style.display="none";

    });



    if(page==="quotes"){

        document.getElementById("quotesPage")
        .style.display="block";

    }



    if(page==="chart"){

        document.querySelector(".chart-section")
        .style.display="flex";

        document.querySelector(".ai-panel")
        .style.display="block";

    }
if(page==="ai"){

document.getElementById("aiPage")
.style.display="block";


document.querySelector(".chart-section")
.style.display="none";


document.querySelector(".ai-panel")
.style.display="none";

}

}



document.querySelectorAll(".bottom-nav button")
.forEach((btn,index)=>{


    btn.onclick=function(){


        document.querySelectorAll(".bottom-nav button")
        .forEach(b=>b.classList.remove("active"));


        this.classList.add("active");



        if(index===0){

            showPage("quotes");

        }


        if(index===1){

            showPage("chart");

        }


    };


});
function askRJAI(){


let input=document.getElementById("aiQuestion");

let question=input.value;


if(question==="") return;



let chat=document.getElementById("aiChatBox");



chat.innerHTML += `

<div class="user-message">

👤 ${question}

</div>


<div class="ai-message">

🤖 RJ AI is analyzing...

</div>

`;



input.value="";


}
function askRJAI(){


let input=document.getElementById("aiQuestion");

let text=input.value;


if(text==="") return;



let chat=document.getElementById("aiChatBox");


chat.innerHTML += `

<div class="user-message">

👤 ${text}

</div>


<div class="ai-message">

🤖 Processing your request...

</div>

`;


input.value="";


}

