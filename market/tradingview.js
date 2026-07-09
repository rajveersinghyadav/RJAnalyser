function loadTradingView(symbol = "BINANCE:BTCUSDT") {

document.getElementById("tradingview_chart").innerHTML = "";

new TradingView.widget({

"autosize": true,

"symbol": symbol,

"interval": "15",

"timezone": "Etc/UTC",

"theme": "dark",

"style": "1",

"locale": "en",

"toolbar_bg": "#161b22",

"enable_publishing": false,

"hide_top_toolbar": false,

"allow_symbol_change": false,

"container_id": "tradingview_chart"

});

}
