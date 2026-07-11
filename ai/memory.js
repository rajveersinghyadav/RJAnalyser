/* =========================================================
   RJAnalyser AI
   memory.js
   PART 1 / 2
========================================================= */

const RJMemory = {

    version: "1.0",

    maxRecords: 5000,

    records: [],

    /* =====================================
       Save Analysis
    ===================================== */

    save(decision) {

        if (!decision) return;

        const record = {

            id: Date.now(),

            asset: RJState.asset,

            timeframe: RJState.timeframe,

            time: new Date().toISOString(),

            signal: decision.signal,

            confidence: decision.confidence,

            entry: decision.entry,

            stopLoss: decision.stopLoss,

            tp1: decision.tp1,

            tp2: decision.tp2,

            tp3: decision.tp3,

            riskReward: decision.riskReward,

            reason: decision.reason,

            result: "PENDING",

            profit: 0

        };

        this.records.push(record);

        if (this.records.length > this.maxRecords) {

            this.records.shift();

        }

        this.saveLocal();

    },

    /* =====================================
       Local Storage
    ===================================== */

    saveLocal() {

        localStorage.setItem(

            "RJ_MEMORY",

            JSON.stringify(this.records)

        );

    },

    loadLocal() {

        const data = localStorage.getItem("RJ_MEMORY");

        if (!data) return;

        this.records = JSON.parse(data);

    },
       /* =====================================
       Update Trade Result
    ===================================== */

    updateResult(id, result, profit = 0) {

        const trade = this.records.find(r => r.id === id);

        if (!trade) return;

        trade.result = result;

        trade.profit = profit;

        this.saveLocal();

    },

    /* =====================================
       Statistics
    ===================================== */

    getStats() {

        let win = 0;

        let loss = 0;

        let pending = 0;

        let totalProfit = 0;

        this.records.forEach(r => {

            if (r.result === "WIN") win++;

            else if (r.result === "LOSS") loss++;

            else pending++;

            totalProfit += Number(r.profit);

        });

        return {

            totalTrades: this.records.length,

            wins: win,

            losses: loss,

            pending,

            totalProfit

        };

    },

    /* =====================================
       Get Recent Memory
    ===================================== */

    latest(limit = 20) {

        return this.records.slice(-limit);

    },

    /* =====================================
       Clear Memory
    ===================================== */

    clear() {

        this.records = [];

        localStorage.removeItem("RJ_MEMORY");

    }

};

/* =====================================
   Auto Load Memory
===================================== */

RJMemory.loadLocal();
