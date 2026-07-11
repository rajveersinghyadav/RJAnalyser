/* =========================================================
   RJAnalyser AI
   decision.js
   PART 1 / 2
========================================================= */

const RJDecision = {

    version: "1.0",

    analyse(brain, candles = []) {

        if (!brain || !candles.length) {

            return null;

        }

        const last = candles[candles.length - 1];

        const entry = last.close;

        const stopLoss = this.calculateStopLoss(

            brain,

            candles,

            entry

        );

        const targets = this.calculateTargets(

            brain,

            entry,

            stopLoss

        );

        const riskReward = this.calculateRR(

            entry,

            stopLoss,

            targets.tp1,

            brain.signal

        );

        return {

            signal: brain.signal,

            confidence: brain.confidence,

            entry,

            stopLoss,

            tp1: targets.tp1,

            tp2: targets.tp2,

            tp3: targets.tp3,

            riskReward,

            reason: this.generateReason(brain)

        };

    },

    /* =====================================
       Stop Loss Engine
    ===================================== */

    calculateStopLoss(

        brain,

        candles,

        entry

    ) {

        const recent = candles.slice(-10);

        let lowest = recent[0].low;

        let highest = recent[0].high;

        recent.forEach(c => {

            if (c.low < lowest)

                lowest = c.low;

            if (c.high > highest)

                highest = c.high;

        });

        if (brain.signal === "BUY") {

            return Number(lowest.toFixed(4));

        }

        if (brain.signal === "SELL") {

            return Number(highest.toFixed(4));

        }

        return Number(entry.toFixed(4));

    },

    /* =====================================
       Target Engine
    ===================================== */

    calculateTargets(

        brain,

        entry,

        sl

    ) {

        const risk = Math.abs(entry - sl);

        let tp1 = entry;

        let tp2 = entry;

        let tp3 = entry;

        if (brain.signal === "BUY") {

            tp1 = entry + risk;

            tp2 = entry + (risk * 2);

            tp3 = entry + (risk * 3);

        }

        if (brain.signal === "SELL") {

            tp1 = entry - risk;

            tp2 = entry - (risk * 2);

            tp3 = entry - (risk * 3);

        }

        return {

            tp1: Number(tp1.toFixed(4)),

            tp2: Number(tp2.toFixed(4)),

            tp3: Number(tp3.toFixed(4))

        };

    },
        /* =====================================
       Risk Reward Engine
    ===================================== */

    calculateRR(entry, sl, tp1, signal) {

        let risk = Math.abs(entry - sl);

        let reward = Math.abs(tp1 - entry);

        if (risk === 0) return "0 : 0";

        return (reward / risk).toFixed(2) + " : 1";

    },

    /* =====================================
       Decision Reason Engine
    ===================================== */

    generateReason(brain) {

        let reason = [];

        reason.push("Trend : " + brain.trend);

        reason.push("Buyers : " + brain.buyers + "%");

        reason.push("Sellers : " + brain.sellers + "%");

        reason.push("Momentum : " + brain.momentum);

        reason.push("Volatility : " + brain.volatility);

        reason.push("Confidence : " + brain.confidence + "%");

        return reason.join(" | ");

    }

};

/* =====================================
   Global Helper
===================================== */

function runDecision(brain, candles) {

    if (!brain) return null;

    return RJDecision.analyse(brain, candles);

}
