/* ======================================
   RJAnalyser AI
   TradingView Engine V1
====================================== */

function loadTradingView(symbol = "BINANCE:BTCUSDT", interval = "15") {

    const chart = document.getElementById("tradingview_chart");

    if (!chart) return;

    chart.innerHTML = "";

    new TradingView.widget({

        autosize: true,

        symbol: symbol,

        interval: interval,

        timezone: "Etc/UTC",

        theme: "dark",

        style: "1",

        locale: "en",

        enable_publishing: false,

        allow_symbol_change: false,

        hide_top_toolbar: false,

        hide_legend: false,

        save_image: false,

        toolbar_bg: "#161b22",

        container_id: "tradingview_chart"

    });

}

/* ==========================
   Change Asset
========================== */

function changeAsset(symbol){

    RJState.asset = symbol;

    document.getElementById("selectedAsset").innerText = symbol;

    loadTradingView("BINANCE:" + symbol);

}

/* ==========================
   Change Timeframe
========================== */

function changeTimeframe(tf){

    RJState.timeframe = tf;

    loadTradingView(

        "BINANCE:" + RJState.asset,

        tf

    );

}

/* ==========================
   Start
========================== */

window.addEventListener("load",()=>{

    loadTradingView();

});
