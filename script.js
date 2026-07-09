/* ==========================================
   RJAnalyser AI
   Main Script V2
========================================== */

window.onload = function () {

    loadMarket();

    loadTradingView();

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

    fakeAI();

}

/* ===========================
   Highlight
=========================== */

function removeSelection(){

    document.querySelectorAll(".asset").forEach(item=>{

        item.classList.remove("active");

    });

}

function highlight(asset){

    document.querySelectorAll(".asset").forEach(item=>{

        if(item.innerHTML===asset){

            item.classList.add("active");

        }

    });

}
/* ==========================================
   RJAnalyser AI
   AI Analysis Engine V1
========================================== */

function fakeAI() {

    const trendList = [
        "Strong Bullish",
        "Bullish",
        "Sideways",
        "Bearish",
        "Strong Bearish"
    ];

    const signalList = [
        "BUY",
        "SELL",
        "WAIT"
    ];

    const trend =
        trendList[Math.floor(Math.random() * trendList.length)];

    const signal =
        signalList[Math.floor(Math.random() * signalList.length)];

    const confidence =
        Math.floor(Math.random() * 20) + 80;

    const score =
        Math.floor(Math.random() * 15) + 85;

    const move =
        Math.floor(Math.random() * 350) + 50;

    const entry =
        (Math.random() * 100000).toFixed(2);

    const sl =
        (entry - (Math.random() * 200)).toFixed(2);

    const tp1 =
        (Number(entry) + 100).toFixed(2);

    const tp2 =
        (Number(entry) + 200).toFixed(2);

    const tp3 =
        (Number(entry) + 350).toFixed(2);

    document.getElementById("trend").innerHTML = trend;

    document.getElementById("signal").innerHTML = signal;

    document.getElementById("confidence").innerHTML =
        confidence + "%";

    document.getElementById("move").innerHTML =
        move + " Points";

    document.getElementById("entry").innerHTML =
        entry;

    document.getElementById("sl").innerHTML =
        sl;

    document.getElementById("tp1").innerHTML =
        tp1;

    document.getElementById("tp2").innerHTML =
        tp2;

    document.getElementById("tp3").innerHTML =
        tp3;

    document.getElementById("score").innerHTML =
        score + " / 100";

    document.getElementById("reason").innerHTML =
        "AI detected market structure, trend momentum and possible continuation.";
}

/* ==========================================
   Timeframe Change
========================================== */

document.querySelectorAll(".timeframes button")
.forEach(button => {

    button.onclick = function () {

        document.querySelectorAll(".timeframes button")
        .forEach(btn => btn.classList.remove("active"));

        this.classList.add("active");

        RJState.timeframe = this.innerText;

        selectAsset(RJState.asset);

    };

});

/* ==========================================
   Start AI
========================================== */

setTimeout(() => {

    fakeAI();

},1000);
