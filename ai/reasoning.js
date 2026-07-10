/*
=========================================
RJAnalyser Reasoning Engine V1
=========================================
*/

const RJReasoning = {

    analyse(data) {

        let report = {

            trend: "Unknown",

            confidence: 0,

            decision: "WAIT",

            brainScore: 0,
            
            riskLevel: "LOW",

            reason: []

        };

        if (data.trend === "Bullish") {

            report.trend = "Bullish";
            report.confidence += 30;
            report.reason.push("Market trend is bullish.");

        }

        if (data.pattern === "Bullish Engulfing") {

            report.confidence += 40;
            report.reason.push("Bullish Engulfing detected.");

        }

        if (report.confidence >= 70) {

            report.decision = "BUY";

        }

        return report;

    }

};
