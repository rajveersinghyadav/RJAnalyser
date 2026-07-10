/* ==========================================
   RJAnalyser AI
   Engine V2
   Part 1 - Master Controller
========================================== */

const RJEngine = {

    version: "2.0",

    status: "READY",

    lastAnalysis: null,

    totalAnalysis: 0

};

// ==========================
// Engine Status
// ==========================
RJEngine.getStatus = function(){

    return{

        version: this.version,

        status: this.status,

        totalAnalysis: this.totalAnalysis

    };

};

// ==========================
// Reset Engine
// ==========================
RJEngine.reset = function(){

    this.lastAnalysis = null;

    this.totalAnalysis = 0;

    this.status = "READY";

};
/* ==========================================
   RJAnalyser AI
   Engine V2
   Part 2 - Analysis Pipeline
========================================== */

// ==========================
// Main Analysis
// ==========================
RJEngine.analyse = function(candles){

    if(!candles || candles.length===0){

        return null;

    }

    // STEP 1
    const features =
    RJFeature.extractFeatures(candles);

    // STEP 2
    const pattern =
    RJPattern.analyse(candles);

    // STEP 3
    const memory =
    RJMemory.getDNADecision({

        pattern:pattern.pattern,

        signal:pattern.signal,

        marketBias:features.marketBias,

        momentum:features.momentum,

        buyerPressure:features.buyerPressure,

        sellerPressure:features.sellerPressure,

        marketEnergy:features.marketEnergy,

        expansion:features.expansion,

        compression:features.compression

    });

    // STEP 4
    const confidence =
    RJLearning.calculateConfidence({

        patternStrength:pattern.strength,

        memoryConfidence:memory.confidence,

        momentumScore:
        features.powerScore,

        buyerPressure:
        features.buyerPressure,

        sellerPressure:
        features.sellerPressure,

        marketEnergy:
        features.marketEnergy,

        marketBias:
        features.marketBias

    });

    // Brain Analysis
const brain = RJBrain.analyse({

    features,

    pattern,

    memory,

    learningConfidence: confidence

});

// Save Final Analysis
this.lastAnalysis = {

    features,

    pattern,

    memory,

    confidence,

    brain

};

this.totalAnalysis++;

return this.lastAnalysis;

};
=========================================
RJAnalyser Engine V1
Main AI Workflow
=========================================
*/
/* ===== OLD ENGINE V1 (DISABLED) =====
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
    }

};

===== END OLD ENGINE V1 ===== */
