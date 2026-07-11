/* =========================================================
   RJAnalyser AI
   brain.js
   PART 1 / 2
========================================================= */

const RJBrain = {

    version: "1.0",

    analyse(candles = []) {

        if (!candles || candles.length < 20) {

            return null;

        }

        const trend = this.getTrend(candles);

        const pressure = this.getBuyerSeller(candles);

        const momentum = this.getMomentum(candles);

        const volatility = this.getVolatility(candles);

        const confidence = this.getConfidence(

            trend,

            pressure,

            momentum,

            volatility

        );

        return {

            time: Date.now(),

            asset: RJState.asset,

            timeframe: RJState.timeframe,

            trend,

            buyers: pressure.buyers,

            sellers: pressure.sellers,

            control: pressure.control,

            momentum,

            volatility,

            confidence

        };

    },

    /* =====================================
       Trend Engine
    ===================================== */

    getTrend(candles) {

        const recent = candles.slice(-20);

        let up = 0;

        let down = 0;

        recent.forEach(c => {

            if (c.close > c.open) up++;

            if (c.close < c.open) down++;

        });

        if (up >= 14)

            return {

                state: "Bullish",

                strength: Math.round((up / 20) * 100)

            };

        if (down >= 14)

            return {

                state: "Bearish",

                strength: Math.round((down / 20) * 100)

            };

        return {

            state: "Sideways",

            strength: 50

        };

    },

    /* =====================================
       Buyer Seller Engine
    ===================================== */

    getBuyerSeller(candles) {

        const recent = candles.slice(-20);

        let buyer = 0;

        let seller = 0;

        recent.forEach(c => {

            const range = c.high - c.low;

            if (range <= 0) return;

            const body = Math.abs(c.close - c.open);

            const power = (body / range) * 100;

            if (c.close > c.open)

                buyer += power;

            else

                seller += power;

        });

        const total = buyer + seller || 1;

        buyer = Math.round((buyer / total) * 100);

        seller = Math.round((seller / total) * 100);

        let control = "Neutral";

        if (buyer > seller)

            control = "Buyers";

        if (seller > buyer)

            control = "Sellers";

        return {

            buyers: buyer,

            sellers: seller,

            control

        };

    },

    /* =====================================
       Momentum Engine
    ===================================== */

    getMomentum(candles) {

        const last = candles[candles.length - 1];

        const prev = candles[candles.length - 2];

        const move =

            ((last.close - prev.close) /

                prev.close) *

            100;

        if (move > 0.60)

            return {

                state: "Strong Bullish",

                value: move.toFixed(2)

            };

        if (move > 0)

            return {

                state: "Bullish",

                value: move.toFixed(2)

            };

        if (move < -0.60)

            return {

                state: "Strong Bearish",

                value: move.toFixed(2)

            };

        return {

            state: "Bearish",

            value: move.toFixed(2)

        };

    },
       /* =====================================
       Volatility Engine
    ===================================== */

    getVolatility(candles) {

        const recent = candles.slice(-20);

        let totalRange = 0;

        recent.forEach(c => {

            totalRange += (c.high - c.low);

        });

        const avgRange = totalRange / recent.length;

        let state = "Low";

        if (avgRange > 0.5) state = "Medium";
        if (avgRange > 1.5) state = "High";

        return {

            state,

            averageRange: Number(avgRange.toFixed(4))

        };

    },

    /* =====================================
       Confidence Engine
    ===================================== */

    getConfidence(

        trend,

        pressure,

        momentum,

        volatility

    ) {

        let score = 50;

        if (trend.state === "Bullish")
            score += 10;

        if (trend.state === "Bearish")
            score += 10;

        if (pressure.buyers >= 70)
            score += 15;

        if (pressure.sellers >= 70)
            score += 15;

        if (
            momentum.state === "Strong Bullish" ||
            momentum.state === "Strong Bearish"
        )
            score += 15;

        if (volatility.state === "Medium")
            score += 5;

        if (volatility.state === "High")
            score += 10;

        if (score > 100)
            score = 100;

        return score;

    },

    /* =====================================
       Decision Preparation
    ===================================== */

    prepareDecision(brain) {

        if (!brain)
            return null;

        let signal = "WAIT";

        if (
            brain.control === "Buyers" &&
            brain.trend.state === "Bullish" &&
            brain.confidence >= 75
        ) {

            signal = "BUY";

        }

        if (
            brain.control === "Sellers" &&
            brain.trend.state === "Bearish" &&
            brain.confidence >= 75
        ) {

            signal = "SELL";

        }

        return {

            signal,

            confidence: brain.confidence,

            trend: brain.trend.state,

            buyers: brain.buyers,

            sellers: brain.sellers,

            momentum: brain.momentum.state,

            volatility: brain.volatility.state

        };

    }

};

/* =====================================
   Global Helper
===================================== */

function runBrain(candles) {

    const brain = RJBrain.analyse(candles);

    if (!brain)
        return null;

    return RJBrain.prepareDecision(brain);

}
