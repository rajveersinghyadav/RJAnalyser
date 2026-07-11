/* =====================================================
   RJAnalyser AI V5
   market/tradingview.js
===================================================== */

let tvWidget = null;

/* ======================================
   Convert Timeframe
====================================== */

function tvInterval(tf){

    switch(tf){

        case "1m": return "1";
        case "5m": return "5";
        case "15m": return "15";
        case "1H": return "60";
        case "4H": return "240";
        case "1D": return "D";

        default: return "15";

    }

}

/* ======================================
   Load TradingView
====================================== */

function loadTradingView(symbol="BINANCE:BTCUSDT", timeframe="15m"){

    const chart=document.getElementById("tradingview_chart");

    if(!chart) return;

    chart.innerHTML="";

    tvWidget=new TradingView.widget({

        autosize:true,

        symbol:symbol,

        interval:tvInterval(timeframe),

        timezone:"Etc/UTC",

        theme:"dark",

        style:"1",

        locale:"en",

        toolbar_bg:"#11151c",

        enable_publishing:false,

        allow_symbol_change:false,

        hide_side_toolbar:false,

        hide_top_toolbar:false,

        withdateranges:true,

        save_image:false,

        container_id:"tradingview_chart"

    });

}

/* ======================================
   Reload Current Chart
====================================== */

function reloadChart(){

    loadTradingView(

        getTVSymbol(RJState.asset),

        RJState.timeframe

    );

}
