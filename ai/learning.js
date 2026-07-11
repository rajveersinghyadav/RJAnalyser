/* =========================================================
   RJAnalyser AI
   learning.js
   PART 1 / 2
========================================================= */

const RJLearning = {

    version: "1.0",

    model: {

        totalTrades: 0,

        wins: 0,

        losses: 0,

        winRate: 0,

        bestSignal: "",

        bestConfidence: 0,

        averageProfit: 0

    },

    /* =====================================
       Learn From Memory
    ===================================== */

    learn() {

        const trades = RJMemory.records;

        if (!trades.length) return;

        let wins = 0;

        let losses = 0;

        let totalProfit = 0;

        let bestConfidence = 0;

        let bestSignal = "";

        trades.forEach(trade => {

            if (trade.result === "WIN") {

                wins++;

            }

            if (trade.result === "LOSS") {

                losses++;

            }

            totalProfit += Number(trade.profit);

            if (trade.confidence > bestConfidence) {

                bestConfidence = trade.confidence;

                bestSignal = trade.signal;

            }

        });

        this.model.totalTrades = trades.length;

        this.model.wins = wins;

        this.model.losses = losses;

        this.model.winRate =
            Number(((wins / trades.length) * 100).toFixed(2));

        this.model.bestSignal = bestSignal;

        this.model.bestConfidence = bestConfidence;

        this.model.averageProfit =
            Number((totalProfit / trades.length).toFixed(2));

        this.save();

    },

    /* =====================================
       Save Learning
    ===================================== */

    save() {

        localStorage.setItem(

            "RJ_LEARNING",

            JSON.stringify(this.model)

        );

    },
       /* =====================================
       Load Learning
    ===================================== */

    load() {

        const data = localStorage.getItem("RJ_LEARNING");

        if (!data) return;

        this.model = JSON.parse(data);

    },

    /* =====================================
       Get AI Learning Model
    ===================================== */

    getModel() {

        return this.model;

    },

    /* =====================================
       Reset Learning
    ===================================== */

    reset() {

        this.model = {

            totalTrades: 0,

            wins: 0,

            losses: 0,

            winRate: 0,

            bestSignal: "",

            bestConfidence: 0,

            averageProfit: 0

        };

        localStorage.removeItem("RJ_LEARNING");

    }

};

/* =====================================
   Auto Load Learning
===================================== */

RJLearning.load();
