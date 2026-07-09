/* =====================================================
   RJAnalyser AI V4
   SIGNAL ENGINE FINAL
   PART 1 + PART 2
===================================================== */


/* ======================================
   MAIN SIGNAL ENGINE
====================================== */

function RJSignalEngine(candles){

    if(!candles || candles.length < 10){

        return {

            signal:"WAIT",
            strength:0,
            buyer:50,
            seller:50,
            confidence:0,
            aiScore:0,
            reason:"Waiting for sufficient market data."

        };

    }


    let buyer = 0;
    let seller = 0;


    let recent = candles.slice(-10);



    /* ==========================
       BUYER SELLER POWER
    ========================== */

    recent.forEach(candle=>{


        let body = candle.close - candle.open;

        let range = candle.high - candle.low;


        if(range<=0) return;


        let power = (Math.abs(body)/range)*100;


        if(body>0){

            buyer += power;

        }

        else if(body<0){

            seller += power;

        }


    });



    let total = buyer + seller;


    if(total===0){

        total=1;

    }


    buyer = Math.round((buyer/total)*100);

    seller = Math.round((seller/total)*100);



    let signal="WAIT";

    let strength=Math.max(buyer,seller);

    let reason="Market is neutral.";



    if(buyer>=60){

        signal="BUY";

        reason="Buyers are controlling recent candles.";

    }



    if(seller>=60){

        signal="SELL";

        reason="Sellers are controlling recent candles.";

    }



    let result={


        signal:signal,

        strength:strength,

        buyer:buyer,

        seller:seller,

        confidence:strength,

        reason:reason


    };



    result = RJMomentumBoost(result,recent);

    result = RJTrendBoost(result,candles);

    result = RJSupportResistanceBoost(result,candles);

    result = RJFinalAIScore(result,candles);

    result = RJSmartFilter(result);

    result = RJTradeManager(result,candles);



    return result;


}






/* =====================================================
   PART 2
   VOLUME + MOMENTUM ANALYSIS
===================================================== */



function RJVolumeMomentum(recent){


    let buyerVolume=0;

    let sellerVolume=0;



    recent.forEach(candle=>{


        if(candle.close > candle.open){

            buyerVolume += candle.volume || 0;

        }

        else if(candle.close < candle.open){

            sellerVolume += candle.volume || 0;

        }


    });



    let total=buyerVolume+sellerVolume;


    if(total<=0){

        total=1;

    }



    return {


        buyerVolume:Math.round((buyerVolume/total)*100),

        sellerVolume:Math.round((sellerVolume/total)*100)


    };


}






function RJStrongCandle(candle){


    let body=Math.abs(candle.close-candle.open);

    let range=candle.high-candle.low;


    if(range<=0) return false;


    return (body/range)>=0.70;


}







function RJMomentumBoost(result,recent){


    let volume=RJVolumeMomentum(recent);


    let last=recent[recent.length-1];



    if(RJStrongCandle(last)){


        if(last.close>last.open){


            result.buyer=Math.min(result.buyer+8,100);


        }

        else{


            result.seller=Math.min(result.seller+8,100);


        }


    }





    if(volume.buyerVolume>60){


        result.buyer=Math.min(result.buyer+5,100);


    }



    if(volume.sellerVolume>60){


        result.seller=Math.min(result.seller+5,100);


    }





    if(result.buyer>result.seller){

        result.signal="BUY";

    }

    else if(result.seller>result.buyer){

        result.signal="SELL";

    }

    else{

        result.signal="WAIT";

    }



    result.strength=Math.max(result.buyer,result.seller);

    result.confidence=result.strength;



    return result;


}
/* =====================================================
   PART 3
   TREND + FAKE BREAKOUT DETECTION
===================================================== */


/* ======================================
   TREND ANALYSIS
====================================== */

function RJTrendAnalysis(candles){

    let last5 = candles.slice(-5);

    let up = 0;
    let down = 0;


    last5.forEach(candle=>{


        if(candle.close > candle.open){

            up++;

        }

        else if(candle.close < candle.open){

            down++;

        }


    });



    if(up >= 4){

        return "BULLISH";

    }


    if(down >= 4){

        return "BEARISH";

    }


    return "SIDEWAYS";


}





/* ======================================
   FAKE BREAKOUT CHECK
====================================== */

function RJFakeBreakout(candles){


    let last = candles[candles.length-1];

    let prev = candles[candles.length-2];



    if(!last || !prev){

        return false;

    }




    if(last.high > prev.high && last.close < prev.high){

        return true;

    }



    if(last.low < prev.low && last.close > prev.low){

        return true;

    }



    return false;


}





/* ======================================
   TREND BOOST
====================================== */

function RJTrendBoost(result,candles){


    let trend = RJTrendAnalysis(candles);

    let fake = RJFakeBreakout(candles);



    if(fake){


        result.strength=Math.max(result.strength-15,0);

        result.confidence=result.strength;

        result.reason += " Fake breakout detected.";

        return result;


    }




    if(trend==="BULLISH" && result.signal==="BUY"){


        result.strength=Math.min(result.strength+10,100);

        result.reason += " Bullish trend confirmed.";


    }




    if(trend==="BEARISH" && result.signal==="SELL"){


        result.strength=Math.min(result.strength+10,100);

        result.reason += " Bearish trend confirmed.";


    }



    result.confidence=result.strength;


    return result;


}








/* =====================================================
   PART 4
   SUPPORT + RESISTANCE + REVERSAL
===================================================== */





/* ======================================
   SUPPORT LEVEL
====================================== */

function RJSupport(candles){


    let lows=candles
    .slice(-20)
    .map(c=>c.low);



    return Math.min(...lows);


}






/* ======================================
   RESISTANCE LEVEL
====================================== */

function RJResistance(candles){


    let highs=candles
    .slice(-20)
    .map(c=>c.high);



    return Math.max(...highs);


}








/* ======================================
   REVERSAL DETECTION
====================================== */

function RJReversal(candles){


    let last=candles[candles.length-1];

    let prev=candles[candles.length-2];



    if(!last || !prev){

        return "NONE";

    }




    if(last.close>last.open && prev.close<prev.open){

        return "BULLISH";

    }




    if(last.close<last.open && prev.close>prev.open){

        return "BEARISH";

    }




    return "NONE";


}








/* ======================================
   SUPPORT RESISTANCE BOOST
====================================== */

function RJSupportResistanceBoost(result,candles){


    let support=RJSupport(candles);

    let resistance=RJResistance(candles);

    let reversal=RJReversal(candles);

    let price=candles[candles.length-1].close;




    if(price <= support * 1.003){


        result.reason += " Near Support.";



        if(result.signal==="BUY"){


            result.strength=Math.min(result.strength+8,100);


        }


    }





    if(price >= resistance * 0.997){


        result.reason += " Near Resistance.";



        if(result.signal==="SELL"){


            result.strength=Math.min(result.strength+8,100);


        }


    }







    if(reversal==="BULLISH"){


        result.reason += " Bullish Reversal.";


    }




    if(reversal==="BEARISH"){


        result.reason += " Bearish Reversal.";


    }



    result.confidence=result.strength;


    return result;


}
/* =====================================================
   PART 5
   AI SCORE + SMART FILTER
===================================================== */


/* ======================================
   TREND SCORE
====================================== */

function RJTrendScore(candles){


    let recent=candles.slice(-10);


    let bullish=0;

    let bearish=0;



    recent.forEach(candle=>{


        if(candle.close > candle.open){

            bullish++;

        }

        else if(candle.close < candle.open){

            bearish++;

        }


    });




    let score=50;



    if(bullish>bearish){

        score += (bullish-bearish)*10;

    }




    if(bearish>bullish){

        score -= (bearish-bullish)*10;

    }




    if(score>100){

        score=100;

    }


    if(score<0){

        score=0;

    }



    return Math.round(score);


}








/* ======================================
   MULTI TIMEFRAME SCORE
====================================== */

function RJMultiTimeframeScore(candles){


    let trend=RJTrendAnalysis(candles);



    if(trend==="BULLISH"){

        return 85;

    }



    if(trend==="BEARISH"){

        return 85;

    }



    return 50;


}









/* ======================================
   FINAL AI SCORE
====================================== */

function RJFinalAIScore(result,candles){



    let trendScore=RJTrendScore(candles);

    let mtfScore=RJMultiTimeframeScore(candles);




    let finalScore=Math.round(


        (result.strength*0.5)+

        (trendScore*0.3)+

        (mtfScore*0.2)


    );




    result.aiScore=finalScore;



    result.reason += 
    " AI Score: "+finalScore+"/100.";



    return result;


}









/* ======================================
   SMART SIGNAL FILTER
====================================== */

function RJSmartFilter(result){



    if(result.aiScore>=75){


        result.reason += 
        " Strong setup confirmed.";



        return result;


    }




    if(result.aiScore<60){


        result.signal="WAIT";

        result.reason +=
        " Market confirmation weak.";


    }



    return result;


}









/* =====================================================
   PART 6
   AI TRADE MANAGEMENT ASSISTANT
===================================================== */








/* ======================================
   ENTRY PRICE
====================================== */

function RJEntryPrice(candles){


    let last=candles[candles.length-1];


    return last.close;


}









/* ======================================
   STOP LOSS
====================================== */

function RJStopLoss(result,candles){


    let entry=RJEntryPrice(candles);


    let last=candles[candles.length-1];


    let risk=last.high-last.low;



    if(result.signal==="BUY"){


        return Number(
            (entry-risk).toFixed(5)
        );


    }




    if(result.signal==="SELL"){


        return Number(
            (entry+risk).toFixed(5)
        );


    }



    return null;


}









/* ======================================
   TARGET
====================================== */

function RJTargetPrice(result,candles){


    let entry=RJEntryPrice(candles);


    let stop=RJStopLoss(result,candles);



    if(!stop){

        return null;

    }



    let risk=Math.abs(entry-stop);





    if(result.signal==="BUY"){


        return Number(
            (entry+(risk*2)).toFixed(5)
        );


    }




    if(result.signal==="SELL"){


        return Number(
            (entry-(risk*2)).toFixed(5)
        );


    }



    return null;


}









/* ======================================
   TRADE MANAGER
====================================== */

function RJTradeManager(result,candles){



    let entry=RJEntryPrice(candles);

    let stopLoss=RJStopLoss(result,candles);

    let target=RJTargetPrice(result,candles);





    result.trade={


        entry:entry,


        stopLoss:stopLoss,


        target:target,


        riskReward:"1:2"


    };




    result.reason +=
    " Trade plan generated.";



    return result;


}









/* ======================================
   PROFIT PROTECTION
====================================== */

function RJProfitProtection(currentPrice,trade){



    if(!trade || !trade.target){


        return "WAIT";


    }




    let distance=Math.abs(
        trade.target-currentPrice
    );




    if(distance <= Math.abs(trade.target*0.005)){


        return "Target near. Protect profit.";


    }



    return "Holding position.";


}









/* ======================================
   TRAILING STOP
====================================== */

function RJTrailingStop(signal,price,stopLoss){



    if(signal==="BUY"){


        return Number(
            (price-(price*0.003)).toFixed(5)
        );


    }




    if(signal==="SELL"){


        return Number(
            (price+(price*0.003)).toFixed(5)
        );


    }




    return stopLoss;


}
