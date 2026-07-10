/* ==========================================
   RJAnalyser AI
   Pattern Engine V2
   Part 1 - Classic Candle Patterns
========================================== */

const RJPattern = {};

// ==========================
// Bullish Engulfing
// ==========================
RJPattern.isBullishEngulfing = function(previous,current){

    return (

        previous.close < previous.open &&

        current.close > current.open &&

        current.open < previous.close &&

        current.close > previous.open

    );

};

// ==========================
// Bearish Engulfing
// ==========================
RJPattern.isBearishEngulfing = function(previous,current){

    return (

        previous.close > previous.open &&

        current.close < current.open &&

        current.open > previous.close &&

        current.close < previous.open

    );

};

// ==========================
// Doji
// ==========================
RJPattern.isDoji = function(candle){

    const body = RJFeature.getBodyPercent(candle);

    return body <= 10;

};

// ==========================
// Hammer
// ==========================
RJPattern.isHammer = function(candle){

    return (

        RJFeature.getLowerWickPercent(candle) > 50 &&

        RJFeature.getUpperWickPercent(candle) < 20

    );

};

// ==========================
// Shooting Star
// ==========================
RJPattern.isShootingStar = function(candle){

    return (

        RJFeature.getUpperWickPercent(candle) > 50 &&

        RJFeature.getLowerWickPercent(candle) < 20

    );

};
/* ==========================================
   RJAnalyser AI
   Pattern Engine V2
   Part 2 - Advanced Candle Patterns
========================================== */

// ==========================
// Morning Star
// ==========================
RJPattern.isMorningStar = function(c1,c2,c3){

    return (

        c1.close < c1.open &&

        RJFeature.getBodyPercent(c2) < 20 &&

        c3.close > c3.open &&

        c3.close > ((c1.open + c1.close) / 2)

    );

};

// ==========================
// Evening Star
// ==========================
RJPattern.isEveningStar = function(c1,c2,c3){

    return (

        c1.close > c1.open &&

        RJFeature.getBodyPercent(c2) < 20 &&

        c3.close < c3.open &&

        c3.close < ((c1.open + c1.close) / 2)

    );

};

// ==========================
// Inside Bar
// ==========================
RJPattern.isInsideBar = function(previous,current){

    return (

        current.high < previous.high &&

        current.low > previous.low

    );

};

// ==========================
// Outside Bar
// ==========================
RJPattern.isOutsideBar = function(previous,current){

    return (

        current.high > previous.high &&

        current.low < previous.low

    );

};

// ==========================
// Bullish Marubozu
// ==========================
RJPattern.isBullishMarubozu = function(candle){

    return (

        RJFeature.getBodyPercent(candle) > 90 &&

        RJFeature.getUpperWickPercent(candle) < 5 &&

        RJFeature.getLowerWickPercent(candle) < 5 &&

        candle.close > candle.open

    );

};

// ==========================
// Bearish Marubozu
// ==========================
RJPattern.isBearishMarubozu = function(candle){

    return (

        RJFeature.getBodyPercent(candle) > 90 &&

        RJFeature.getUpperWickPercent(candle) < 5 &&

        RJFeature.getLowerWickPercent(candle) < 5 &&

        candle.close < candle.open

    );

};

// ==========================
// Pin Bar
// ==========================
RJPattern.isPinBar = function(candle){

    return (

        RJFeature.getUpperWickPercent(candle) > 60 ||

        RJFeature.getLowerWickPercent(candle) > 60

    );

};
/* ==========================================
   RJAnalyser AI
   Pattern Engine V2
   Part 3 - Pattern Scanner
========================================== */

// ==========================
// Scan Latest Pattern
// ==========================
RJPattern.scan = function(candles){

    if(!candles || candles.length < 3){

        return {

            pattern:"NONE",

            signal:"WAIT",

            strength:0,

            confidence:0

        };

    }

    const current = candles[candles.length-1];
    const previous = candles[candles.length-2];
    const third = candles[candles.length-3];

    let pattern="NONE";
    let signal="WAIT";

    // Bullish Patterns

    if(this.isBullishEngulfing(previous,current)){

        pattern="Bullish Engulfing";
        signal="BUY";

    }

    else if(this.isHammer(current)){

        pattern="Hammer";
        signal="BUY";

    }

    else if(this.isMorningStar(third,previous,current)){

        pattern="Morning Star";
        signal="BUY";

    }

    // Bearish Patterns

    else if(this.isBearishEngulfing(previous,current)){

        pattern="Bearish Engulfing";
        signal="SELL";

    }

    else if(this.isShootingStar(current)){

        pattern="Shooting Star";
        signal="SELL";

    }

    else if(this.isEveningStar(third,previous,current)){

        pattern="Evening Star";
        signal="SELL";

    }

    // Neutral

    else if(this.isDoji(current)){

        pattern="Doji";
        signal="WAIT";

    }

    else if(this.isInsideBar(previous,current)){

        pattern="Inside Bar";
        signal="WAIT";

    }

    else if(this.isOutsideBar(previous,current)){

        pattern="Outside Bar";
        signal="WAIT";

    }

    // Pattern Strength

    const strength =
    Math.round(RJFeature.getPowerScore(current));

    // Confidence

    let confidence = strength;

    if(signal==="BUY") confidence += 5;

    if(signal==="SELL") confidence += 5;

    if(confidence>100){

        confidence=100;

    }

    return{

        pattern,

        signal,

        strength,

        confidence

    };

};
/* ==========================================
   RJAnalyser AI
   Pattern Engine V2
   Part 4 - AI Pattern Intelligence
========================================== */

// ==========================
// Pattern Memory
// ==========================
RJPattern.memory = [];

// ==========================
// Save Pattern
// ==========================
RJPattern.savePattern = function(result){

    if(!result) return;

    this.memory.push({

        id: "RJ-P" + String(this.memory.length + 1).padStart(6,"0"),

        time: Date.now(),

        pattern: result.pattern,

        signal: result.signal,

        strength: result.strength,

        confidence: result.confidence

    });

};

// ==========================
// Get Pattern Statistics
// ==========================
RJPattern.getStats = function(){

    const stats = {};

    this.memory.forEach(item=>{

        if(!stats[item.pattern]){

            stats[item.pattern]=0;

        }

        stats[item.pattern]++;

    });

    return stats;

};

// ==========================
// Pattern Reliability
// ==========================
RJPattern.getReliability = function(pattern){

    const total = this.memory.length;

    if(total===0) return 0;

    const count = this.memory.filter(p=>p.pattern===pattern).length;

    return Number(((count/total)*100).toFixed(2));

};

// ==========================
// Final AI Scan
// ==========================
RJPattern.analyse = function(candles){

    const result = this.scan(candles);

    this.savePattern(result);

    result.patternId =
    "RJ-P" + String(this.memory.length).padStart(6,"0");

    result.reliability =
    this.getReliability(result.pattern);

    result.totalPatterns =
    this.memory.length;

    return result;

};
