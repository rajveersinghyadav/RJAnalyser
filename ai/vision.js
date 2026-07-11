/* =========================================================
   RJAnalyser AI
   vision.js
   PART 1 / 2
========================================================= */

const RJVision = {

    version: "1.0",

    analyse(candles = []) {

        if (!candles || candles.length < 30)
            return null;

        return {

            structure: this.marketStructure(candles),

            bos: this.breakOfStructure(candles),

            choch: this.changeOfCharacter(candles)

        };

    },

    /* =====================================
       Market Structure
    ===================================== */

    marketStructure(candles) {

        const recent = candles.slice(-20);

        let highs = [];
        let lows = [];

        recent.forEach(c => {

            highs.push(c.high);

            lows.push(c.low);

        });

        const lastHigh = highs[highs.length - 1];
        const prevHigh = highs[highs.length - 2];

        const lastLow = lows[lows.length - 1];
        const prevLow = lows[lows.length - 2];

        if (
            lastHigh > prevHigh &&
            lastLow > prevLow
        ) {

            return "HH-HL";

        }

        if (
            lastHigh < prevHigh &&
            lastLow < prevLow
        ) {

            return "LH-LL";

        }

        return "RANGE";

    },

    /* =====================================
       Break Of Structure
    ===================================== */

    breakOfStructure(candles) {

        const recent = candles.slice(-10);

        const last = recent[recent.length - 1];

        const highest = Math.max(

            ...recent.map(c => c.high)

        );

        const lowest = Math.min(

            ...recent.map(c => c.low)

        );

        if (last.close > highest)
            return "BULLISH BOS";

        if (last.close < lowest)
            return "BEARISH BOS";

        return "NONE";

    },
        /* =====================================
       Change Of Character (CHoCH)
    ===================================== */

    changeOfCharacter(candles) {

        const recent = candles.slice(-6);

        const last = recent[recent.length - 1];
        const prev = recent[recent.length - 2];

        // Bullish CHoCH
        if (
            prev.close < prev.open &&
            last.close > last.open &&
            last.close > prev.high
        ) {

            return "BULLISH CHOCH";

        }

        // Bearish CHoCH
        if (
            prev.close > prev.open &&
            last.close < last.open &&
            last.close < prev.low
        ) {

            return "BEARISH CHOCH";

        }

        return "NONE";

    },

    /* =====================================
       Summary
    ===================================== */

    summary(data) {

        if (!data)
            return "No Structure";

        return [

            "Structure : " + data.structure,

            "BOS : " + data.bos,

            "CHoCH : " + data.choch

        ].join(" | ");

    }

};

/* =====================================
   Global Helper
===================================== */

function runVision(candles) {

    const data = RJVision.analyse(candles);

    return {

        data,

        summary: RJVision.summary(data)

    };

}
