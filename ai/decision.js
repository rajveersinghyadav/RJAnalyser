/*
=========================================
RJAnalyser Decision Engine V1
=========================================
*/

const RJDecision = {

    decide(report) {

        if (!report) {

            return {
                action: "WAIT",
                confidence: 0,
                reason: "No analysis available."
            };

        }

        if (report.confidence >= 80) {

            return {
                action: "BUY",
                confidence: report.confidence,
                reason: report.reason
            };

        }

        if (report.confidence >= 60) {

            return {
                action: "WATCH",
                confidence: report.confidence,
                reason: report.reason
            };

        }

        return {
            action: "WAIT",
            confidence: report.confidence,
            reason: report.reason
        };

    }

};
