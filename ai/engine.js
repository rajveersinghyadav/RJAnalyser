/* =========================================================
   RJAnalyser AI
   engine.js
   PART 1 / 2
========================================================= */

const RJEngine = {

    version: "1.0",

    async run(candles = []) {

        if (!candles || candles.length < 20) {

            return null;

        }

        /* ===============================
           Brain
        =============================== */

        const brain = RJBrain.analyse(candles);

        if (!brain) return null;

        const brainDecision =
            RJBrain.prepareDecision(brain);

        /* ===============================
           Pattern
        =============================== */

        const pattern =
            runPattern(candles);

        /* ===============================
           Vision
        =============================== */

        const vision =
            runVision(candles);

        /* ===============================
           Decision
        =============================== */

        const decision =
            runDecision(
                brainDecision,
                candles
            );

        /* ===============================
           Reasoning
        =============================== */

        const reasoning =
            runReasoning(
                brain,
                decision
            );

        /* ===============================
           Memory
        =============================== */

        RJMemory.save(decision);

        /* ===============================
           Learning
        =============================== */

        RJLearning.learn();

        return {

            brain,

            pattern,

            vision,

            decision,

            reasoning

        };

    },
       /* =====================================
       Get Latest Result
    ===================================== */

    latest: null,

    /* =====================================
       Start Engine
    ===================================== */

    start(candles = []) {

        return this.run(candles)

            .then(result => {

                this.latest = result;

                return result;

            })

            .catch(error => {

                console.error(

                    "RJEngine Error",

                    error

                );

                return null;

            });

    },

    /* =====================================
       Get Latest Analysis
    ===================================== */

    getLatest() {

        return this.latest;

    }

};

/* =====================================
   Global Helper
===================================== */

async function runAI(candles) {

    const result = await RJEngine.start(candles);

    if (!result) return null;

    return {

        signal: result.decision.signal,

        confidence: result.decision.confidence,

        entry: result.decision.entry,

        stopLoss: result.decision.stopLoss,

        tp1: result.decision.tp1,

        tp2: result.decision.tp2,

        tp3: result.decision.tp3,

        reason: result.reasoning,

        pattern: result.pattern.summary,

        structure: result.vision.summary

    };

}
