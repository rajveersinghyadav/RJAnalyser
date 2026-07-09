/* =====================================
   RJAnalyser AI Signal Engine V1
===================================== */


function RJSignalEngine(candles){


    if(!candles || candles.length < 5){

        return {

            signal:"WAIT",
            strength:0,
            reason:"Not enough candle data"

        };

    }



    let last = candles[candles.length-1];

    let previous = candles[candles.length-2];



    let buyer = 0;

    let seller = 0;



    // Candle body analysis

    if(last.close > last.open){

        buyer += 30;

    }
    else{

        seller += 30;

    }



    // Engulfing Pattern Check


    if(

        last.close > previous.open &&
        last.open < previous.close

    ){

        buyer += 35;

    }



    if(

        last.close < previous.open &&
        last.open > previous.close

    ){

        seller += 35;

    }



    // Total score


    let score = buyer - seller;



    let signal="WAIT";

    let reason="Market unclear";



    if(score >= 40){

        signal="BUY";

        reason="Bullish candle structure and buyer pressure detected";

    }


    else if(score <= -40){

        signal="SELL";

        reason="Bearish candle structure and seller pressure detected";

    }



    let strength = Math.abs(score);



    return {


        signal:signal,

        strength:strength,

        buyer:buyer,

        seller:seller,

        reason:reason


    };


}
