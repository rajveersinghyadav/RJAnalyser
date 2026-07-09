/* ==========================================
   RJAnalyser AI
   Main Script V4
   FINAL CORRECTION PART 1
========================================== */


/* ===========================
   APP START
=========================== */

window.onload = function(){

    loadMarket();

    loadTradingView();

    analyseMarket();

};





/* ===========================
   LOAD MARKET
=========================== */

function loadMarket(){


    if(typeof RJAssets === "undefined"){

        console.log("Assets not loaded");

        return;

    }


    createList(
        "forexList",
        RJAssets.forex
    );


    createList(
        "cryptoList",
        RJAssets.crypto
    );


    createList(
        "commodityList",
        RJAssets.commodities
    );


    createList(
        "indicesList",
        RJAssets.indices
    );


}






/* ===========================
   CREATE ASSET LIST
=========================== */

function createList(id,list){


    let box=document.getElementById(id);


    if(!box || !list){

        return;

    }



    box.innerHTML="";



    list.forEach(asset=>{


        let div=document.createElement("div");


        div.className="asset";


        div.innerHTML=asset;



        if(
            typeof RJState !== "undefined" &&
            asset===RJState.asset
        ){

            div.classList.add("active");

        }



        div.onclick=function(){

            selectAsset(asset);

        };



        box.appendChild(div);



    });


}








/* ===========================
   SELECT ASSET
=========================== */

function selectAsset(asset){



    if(typeof RJState !== "undefined"){

        RJState.asset=asset;

    }




    let selector=
    document.getElementById("selectedAsset");



    if(selector){

        selector.innerHTML=
        asset+" ▼";

    }






    let symbol="BINANCE:"+asset;



    if(
        RJAssets.forex &&
        RJAssets.forex.includes(asset)
    ){

        symbol="FX:"+asset;

    }




    if(
        RJAssets.commodities &&
        RJAssets.commodities.includes(asset)
    ){

        symbol="OANDA:"+asset;

    }





    if(
        RJAssets.indices &&
        RJAssets.indices.includes(asset)
    ){

        symbol="FOREXCOM:"+asset;

    }



    loadTradingView(
        symbol,
        RJState.timeframe
    );



    analyseMarket();


}








/* ==========================================
   BINANCE CANDLE DATA
========================================== */


async function getCandles(symbol="BTCUSDT"){



    try{


        let url =
`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=5m&limit=50`;



        let response =
        await fetch(url);



        let data =
        await response.json();




        return data.map(c=>({


            open:Number(c[1]),

            high:Number(c[2]),

            low:Number(c[3]),

            close:Number(c[4]),

            volume:Number(c[5])


        }));



    }

    catch(error){


        console.log(
            "Candle Error:",
            error
        );


        return [];


    }



}








/* ==========================================
   BUYER SELLER ENGINE
========================================== */


function buyerSellerEngine(candles){



    let buyer=0;

    let seller=0;



    let recent =
    candles.slice(-10);




    recent.forEach(c=>{


        let body =
        c.close-c.open;



        let range =
        c.high-c.low;



        if(range<=0){

            return;

        }



        let power =
        Math.abs(body)/range*100;




        if(body>0){

            buyer+=power;

        }

        else if(body<0){

            seller+=power;

        }



    });





    let total =
    buyer+seller;



    if(total===0){

        total=1;

    }




    buyer =
    Math.round(
        buyer/total*100
    );



    seller =
    Math.round(
        seller/total*100
    );





    return {


        buyer:buyer,


        seller:seller



    };



}
/* ==========================================
   AI MARKET ANALYSIS
========================================== */


async function analyseMarket(){



    let asset = RJState.asset;



    if(!asset || !asset.includes("USDT")){


        asset="BTCUSDT";


    }




    let candles =
    await getCandles(asset);



    if(!candles || candles.length<5){

        return;

    }




    /* BUYER SELLER */

    let power =
    buyerSellerEngine(candles);






    /* RJ SIGNAL ENGINE */


    let signal={};



    if(typeof RJSignalEngine==="function"){


        signal =
        RJSignalEngine(candles);


    }







    console.log(
        "RJ AI:",
        signal
    );






    /* DASHBOARD UPDATE */


    if(signal){



        let aiSignal=
        document.getElementById("aiSignal");



        if(aiSignal){

            aiSignal.innerHTML=
            signal.signal;

        }




        let strength=
        document.getElementById("signalStrength");



        if(strength){

            strength.innerHTML=
            signal.strength+"%";

        }





        let buyer=
        document.getElementById("buyerPower");



        if(buyer){

            buyer.innerHTML=
            signal.buyer+"%";

        }




        let seller=
        document.getElementById("sellerPower");



        if(seller){

            seller.innerHTML=
            signal.seller+"%";

        }




        let reason=
        document.getElementById("reason");



        if(reason){

            reason.innerHTML=
            signal.reason;

        }




    }








    /* SIMPLE TREND */


    let last =
    candles[candles.length-1];


    let previous =
    candles[candles.length-2];



    let trend="Sideways";



    if(last.close > previous.close){


        trend="Bullish";


    }



    else if(last.close < previous.close){


        trend="Bearish";


    }






    let trendBox =
    document.getElementById("trend");



    if(trendBox){

        trendBox.innerHTML=
        trend;

    }







    let signalBox =
    document.getElementById("signal");



    if(signalBox && signal.signal){


        signalBox.innerHTML=
        signal.signal;


    }







    let confidence =
    document.getElementById("confidence");



    if(confidence && signal.strength){


        confidence.innerHTML=
        signal.strength+"%";


    }







}










/* ==========================================
   TIMEFRAME BUTTON
========================================== */


document.querySelectorAll(".timeframes button")
.forEach(button=>{


    button.onclick=function(){



        document
        .querySelectorAll(".timeframes button")
        .forEach(btn=>{


            btn.classList.remove("active");


        });





        this.classList.add("active");




        if(typeof RJState!=="undefined"){


            RJState.timeframe=
            this.innerText;


        }





        selectAsset(
            RJState.asset
        );



    };


});









/* ==========================================
   PAGE NAVIGATION
========================================== */


function showPage(page){



    let chart =
    document.querySelector(".chart-section");



    let panel =
    document.querySelector(".ai-panel");



    let quotes =
    document.getElementById("quotesPage");



    let ai =
    document.getElementById("aiPage");






    if(chart){

        chart.style.display="none";

    }



    if(panel){

        panel.style.display="none";

    }



    if(quotes){

        quotes.style.display="none";

    }



    if(ai){

        ai.style.display="none";

    }






    if(page==="quotes"){


        quotes.style.display="block";


    }







    if(page==="chart"){



        chart.style.display="flex";

        panel.style.display="block";


    }







    if(page==="ai"){


        ai.style.display="block";


    }





}









/* ==========================================
   AI CHAT
========================================== */


function askRJAI(){



    let input =
    document.getElementById("aiQuestion");



    let chat =
    document.getElementById("aiChatBox");



    if(!input || !chat){

        return;

    }





    let question =
    input.value.trim();




    if(question===""){

        return;

    }





    chat.innerHTML += `

    <div class="user-message">

    👤 ${question}

    </div>


    <div class="ai-message">

    🤖 RJ AI analyzing market intelligence...

    </div>

    `;




    input.value="";



    chat.scrollTop=
    chat.scrollHeight;



}









/* ==========================================
   AUTO REFRESH
========================================== */


setInterval(()=>{


    analyseMarket();


},30000);
