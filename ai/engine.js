/*
=========================================
RJAnalyser Engine V1
Main AI Workflow
=========================================
*/

const RJEngine = {

    version: "1.0",

    analyse(input) {

        console.log("===== RJAnalyser Started =====");

        // Brain
        RJBrain.start();

        // Memory
        RJMemory.add("analysis", input);

        // Pattern
        let pattern = RJPattern.find("Bullish Engulfing");

        // Reasoning
        let report = RJReasoning.analyse({

            trend: "Bullish",

            pattern: pattern ? pattern.name : ""

        });

        // Decision
        let decision = RJDecision.decide(report);

        return {

            input,

            pattern,

            report,

            decision

        };

    }

};
