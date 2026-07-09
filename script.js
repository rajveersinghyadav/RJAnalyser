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
