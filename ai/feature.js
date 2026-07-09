/* ==========================================
   RJAnalyser AI
   Feature Engine V1
   Part 1 - Basic Candle Features
========================================== */

const RJFeature = {

    // ==========================
    // Candle Body Size
    // ==========================
    getBodySize(candle){

        return Math.abs(candle.close - candle.open);

    },

    // ==========================
    // Upper Wick
    // ==========================
    getUpperWick(candle){

        return candle.high - Math.max(candle.open, candle.close);

    },

    // ==========================
    // Lower Wick
    // ==========================
    getLowerWick(candle){

        return Math.min(candle.open, candle.close) - candle.low;

    },

    // ==========================
    // Total Candle Range
    // ==========================
    getRange(candle){

        return candle.high - candle.low;

    },

    // ==========================
    // Candle Direction
    // ==========================
    getDirection(candle){

        if(candle.close > candle.open){

            return "BULLISH";

        }

        if(candle.close < candle.open){

            return "BEARISH";

        }

        return "DOJI";

    }

};
/* ==========================================
   RJAnalyser AI
   Feature Engine V1
   Part 2 - Candle Power Features
========================================== */

// ==========================
// Body Percentage
// ==========================
RJFeature.getBodyPercent = function(candle){

    const range = this.getRange(candle);

    if(range <= 0) return 0;

    return Number(((this.getBodySize(candle) / range) * 100).toFixed(2));

};

// ==========================
// Upper Wick Percentage
// ==========================
RJFeature.getUpperWickPercent = function(candle){

    const range = this.getRange(candle);

    if(range <= 0) return 0;

    return Number(((this.getUpperWick(candle) / range) * 100).toFixed(2));

};

// ==========================
// Lower Wick Percentage
// ==========================
RJFeature.getLowerWickPercent = function(candle){

    const range = this.getRange(candle);

    if(range <= 0) return 0;

    return Number(((this.getLowerWick(candle) / range) * 100).toFixed(2));

};

// ==========================
// Bullish Strength
// ==========================
RJFeature.getBullStrength = function(candle){

    if(candle.close <= candle.open) return 0;

    return this.getBodyPercent(candle);

};

// ==========================
// Bearish Strength
// ==========================
RJFeature.getBearStrength = function(candle){

    if(candle.close >= candle.open) return 0;

    return this.getBodyPercent(candle);

};

// ==========================
// Candle Power Score
// ==========================
RJFeature.getPowerScore = function(candle){

    let score = 0;

    score += this.getBodyPercent(candle) * 0.60;

    score += (100 - this.getUpperWickPercent(candle)) * 0.20;

    score += (100 - this.getLowerWickPercent(candle)) * 0.20;

    return Number(score.toFixed(2));

};
/* ==========================================
   RJAnalyser AI
   Feature Engine V1
   Part 3 - Market Features
========================================== */

// ==========================
// Average Range (Volatility)
// ==========================
RJFeature.getAverageRange = function(candles){

    if(!candles || candles.length===0) return 0;

    let total = 0;

    candles.forEach(candle=>{

        total += this.getRange(candle);

    });

    return Number((total / candles.length).toFixed(2));

};

// ==========================
// Average Body Size
// ==========================
RJFeature.getAverageBody = function(candles){

    if(!candles || candles.length===0) return 0;

    let total = 0;

    candles.forEach(candle=>{

        total += this.getBodySize(candle);

    });

    return Number((total / candles.length).toFixed(2));

};

// ==========================
// Market Momentum
// ==========================
RJFeature.getMomentum = function(candles){

    if(!candles || candles.length < 2){

        return "NEUTRAL";

    }

    let last = candles[candles.length-1];
    let prev = candles[candles.length-2];

    let change = last.close - prev.close;

    if(change > 0) return "BULLISH";

    if(change < 0) return "BEARISH";

    return "SIDEWAYS";

};

// ==========================
// Bullish Candle Count
// ==========================
RJFeature.getBullCount = function(candles){

    let bulls = 0;

    candles.forEach(candle=>{

        if(candle.close > candle.open){

            bulls++;

        }

    });

    return bulls;

};

// ==========================
// Bearish Candle Count
// ==========================
RJFeature.getBearCount = function(candles){

    let bears = 0;

    candles.forEach(candle=>{

        if(candle.close < candle.open){

            bears++;

        }

    });

    return bears;

};

// ==========================
// Market Bias
// ==========================
RJFeature.getMarketBias = function(candles){

    let bulls = this.getBullCount(candles);

    let bears = this.getBearCount(candles);

    if(bulls > bears){

        return "BUYERS";

    }

    if(bears > bulls){

        return "SELLERS";

    }

    return "BALANCED";

};
/* ==========================================
   RJAnalyser AI
   Feature Engine V1
   Part 4 - Advanced Market Features
========================================== */

// ==========================
// Buyer Pressure
// ==========================
RJFeature.getBuyerPressure = function(candles){

    if(!candles || candles.length===0) return 0;

    let score = 0;

    candles.forEach(candle=>{

        if(candle.close > candle.open){

            score += this.getBodyPercent(candle);

        }

    });

    return Number((score / candles.length).toFixed(2));

};

// ==========================
// Seller Pressure
// ==========================
RJFeature.getSellerPressure = function(candles){

    if(!candles || candles.length===0) return 0;

    let score = 0;

    candles.forEach(candle=>{

        if(candle.close < candle.open){

            score += this.getBodyPercent(candle);

        }

    });

    return Number((score / candles.length).toFixed(2));

};

// ==========================
// Market Speed
// ==========================
RJFeature.getMarketSpeed = function(candles){

    if(!candles || candles.length<2) return 0;

    let last = candles[candles.length-1];
    let prev = candles[candles.length-2];

    return Number(Math.abs(last.close - prev.close).toFixed(2));

};

// ==========================
// Expansion Detection
// ==========================
RJFeature.getExpansion = function(candles){

    if(!candles || candles.length<5){

        return "NORMAL";

    }

    let avgRange = this.getAverageRange(candles.slice(0,-1));

    let lastRange = this.getRange(candles[candles.length-1]);

    if(lastRange > avgRange * 1.5){

        return "EXPANSION";

    }

    return "NORMAL";

};

// ==========================
// Compression Detection
// ==========================
RJFeature.getCompression = function(candles){

    if(!candles || candles.length<5){

        return "NORMAL";

    }

    let avgRange = this.getAverageRange(candles.slice(0,-1));

    let lastRange = this.getRange(candles[candles.length-1]);

    if(lastRange < avgRange * 0.5){

        return "COMPRESSION";

    }

    return "NORMAL";

};

// ==========================
// Market Energy
// ==========================
RJFeature.getMarketEnergy = function(candles){

    const buyer = this.getBuyerPressure(candles);

    const seller = this.getSellerPressure(candles);

    const speed = this.getMarketSpeed(candles);

    return Number((buyer + seller + speed).toFixed(2));

};
/* ==========================================
   RJAnalyser AI
   Feature Engine V1
   Part 5 - Feature Extractor (FINAL)
========================================== */

RJFeature.extractFeatures = function(candles){

    if(!candles || candles.length===0){

        return null;

    }

    const last = candles[candles.length-1];

    return{

        // Candle Features
        bodySize: this.getBodySize(last),

        upperWick: this.getUpperWick(last),

        lowerWick: this.getLowerWick(last),

        range: this.getRange(last),

        direction: this.getDirection(last),

        bodyPercent: this.getBodyPercent(last),

        upperWickPercent: this.getUpperWickPercent(last),

        lowerWickPercent: this.getLowerWickPercent(last),

        bullStrength: this.getBullStrength(last),

        bearStrength: this.getBearStrength(last),

        powerScore: this.getPowerScore(last),

        // Market Features
        averageRange: this.getAverageRange(candles),

        averageBody: this.getAverageBody(candles),

        momentum: this.getMomentum(candles),

        bullCount: this.getBullCount(candles),

        bearCount: this.getBearCount(candles),

        marketBias: this.getMarketBias(candles),

        buyerPressure: this.getBuyerPressure(candles),

        sellerPressure: this.getSellerPressure(candles),

        marketSpeed: this.getMarketSpeed(candles),

        expansion: this.getExpansion(candles),

        compression: this.getCompression(candles),

        marketEnergy: this.getMarketEnergy(candles)

    };

};
