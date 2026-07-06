/*
=========================================
RJAnalyser Brain V2
Main Controller
=========================================
*/

const RJBrain = {

    version: "2.0",

    status: "OFFLINE",

    modules: {
        memory: false,
        knowledge: false,
        learning: false,
        reasoning: false,
        pattern: false,
        decision: false
    },

    start() {

        this.status = "ONLINE";

        this.modules.memory = true;
        this.modules.knowledge = true;
        this.modules.learning = true;
        this.modules.reasoning = true;
        this.modules.pattern = true;
        this.modules.decision = true;

        console.log("RJBrain Started");

        return true;

    },

    analyse(chartData) {

        return {
            status: "Scanning",
            chart: chartData,
            result: "Waiting for Pattern Engine..."
        };

    },

    learn(rule) {

        if (typeof RJLearning !== "undefined") {
            RJLearning.teach("Custom Rule", rule);
        }

    },

    getStatus() {

        return {
            version: this.version,
            status: this.status,
            modules: this.modules
        };

    }

};

window.onload = () => {

    RJBrain.start();

    console.log(RJBrain.getStatus());

};
