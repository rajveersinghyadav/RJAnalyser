/* =========================================================
   RJAnalyser AI
   pattern.js
   PART 1 / 2
========================================================= */

const RJPattern = {

    version: "1.0",

    analyse(candles = []) {

        if (!candles || candles.length < 5) {

            return null;

        }

        const last = candles[candles.length - 1];

        const previous = candles[candles.length - 2];

        return {

            doji: this.isDoji(last),

            hammer: this.isHammer(last),

            shootingStar: this.isShootingStar(last),

            engulfing: this.isEngulfing(previous, last),

            insideBar: this.isInsideBar(previous, last)

        };

    },

    /* =====================================
       DOJI
    ===================================== */

    isDoji(candle) {

        const body = Math.abs(

            candle.close - candle.open

        );

        const range = candle.high - candle.low;

        if (range === 0) return false;

        return (body / range) < 0.10;

    },

    /* =====================================
       HAMMER
    ===================================== */

    isHammer(candle) {

        const body = Math.abs(

            candle.close - candle.open

        );

        const lower =

            Math.min(candle.open, candle.close)

            - candle.low;

        const upper =

            candle.high -

            Math.max(candle.open, candle.close);

        return (

            lower > body * 2 &&

            upper < body

        );

    },

    /* =====================================
       SHOOTING STAR
    ===================================== */

    isShootingStar(candle) {

        const body = Math.abs(

            candle.close - candle.open

        );

        const upper =

            candle.high -

            Math.max(candle.open, candle.close);

        const lower =

            Math.min(candle.open, candle.close)

            - candle.low;

        return (

            upper > body * 2 &&

            lower < body

        );

    },
       /* =====================================
       ENGULFING
    ===================================== */

    isEngulfing(previous, current) {

        // Bullish Engulfing
        if (
            previous.close < previous.open &&
            current.close > current.open &&
            current.open <= previous.close &&
            current.close >= previous.open
        ) {
            return "Bullish";
        }

        // Bearish Engulfing
        if (
            previous.close > previous.open &&
            current.close < current.open &&
            current.open >= previous.close &&
            current.close <= previous.open
        ) {
            return "Bearish";
        }

        return false;

    },

    /* =====================================
       INSIDE BAR
    ===================================== */

    isInsideBar(previous, current) {

        return (
            current.high < previous.high &&
            current.low > previous.low
        );

    },

    /* =====================================
       Pattern Summary
    ===================================== */

    summary(patterns) {

        if (!patterns)
            return "No Pattern";

        let list = [];

        if (patterns.doji)
            list.push("Doji");

        if (patterns.hammer)
            list.push("Hammer");

        if (patterns.shootingStar)
            list.push("Shooting Star");

        if (patterns.engulfing)
            list.push(patterns.engulfing + " Engulfing");

        if (patterns.insideBar)
            list.push("Inside Bar");

        if (list.length === 0)
            return "No Major Pattern";

        return list.join(", ");

    }

};

/* =====================================
   Global Helper
===================================== */

function runPattern(candles) {

    const patterns = RJPattern.analyse(candles);

    return {

        data: patterns,

        summary: RJPattern.summary(patterns)

    };

}
