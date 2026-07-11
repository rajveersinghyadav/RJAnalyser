/* =========================================================
   RJAnalyser AI
   reasoning.js
   PART 1 / 2
========================================================= */

const RJReasoning = {

    version: "1.0",

    explain(brain, decision) {

        if (!brain || !decision) {

            return "Waiting for analysis...";

        }

        let reasons = [];

        /* ===============================
           Signal
        =============================== */

        reasons.push(
            "Signal : " + decision.signal
        );

        /* ===============================
           Trend
        =============================== */

        if (brain.trend.state === "Bullish") {

            reasons.push(
                "Bullish Trend Confirmed"
            );

        }

        if (brain.trend.state === "Bearish") {

            reasons.push(
                "Bearish Trend Confirmed"
            );

        }

        if (brain.trend.state === "Sideways") {

            reasons.push(
                "Sideways Market"
            );

        }

        /* ===============================
           Buyer Seller
        =============================== */

        if (brain.buyers > brain.sellers) {

            reasons.push(

                "Buyer Strength : " +

                brain.buyers + "%"

            );

        }

        else {

            reasons.push(

                "Seller Strength : " +

                brain.sellers + "%"

            );

        }

        /* ===============================
           Momentum
        =============================== */

        reasons.push(

            "Momentum : " +

            brain.momentum.state

        );

        /* ===============================
           Volatility
        =============================== */

        reasons.push(

            "Volatility : " +

            brain.volatility.state

        );
                /* ===============================
           Confidence
        =============================== */

        reasons.push(

            "Confidence : " +

            decision.confidence + "%"

        );

        /* ===============================
           Entry
        =============================== */

        reasons.push(

            "Entry : " +

            decision.entry

        );

        /* ===============================
           Stop Loss
        =============================== */

        reasons.push(

            "SL : " +

            decision.stopLoss

        );

        /* ===============================
           Target
        =============================== */

        reasons.push(

            "TP1 : " +

            decision.tp1

        );

        /* ===============================
           Risk Reward
        =============================== */

        reasons.push(

            "RR : " +

            decision.riskReward

        );

        return reasons.join(" | ");

    },

    /* =====================================
       Short Reason
    ===================================== */

    shortReason(brain, decision) {

        if (!brain || !decision)

            return "Waiting...";

        return (

            decision.signal +

            " | " +

            brain.trend.state +

            " | " +

            decision.confidence +

            "%"

        );

    }

};

/* =====================================
   Global Helper
===================================== */

function runReasoning(brain, decision) {

    return RJReasoning.explain(brain, decision);

}
