/* ==========================================
   RJAnalyser AI
   Brain Engine V2
   Part 1 - Decision Brain
========================================== */

const RJBrain = {

    version: "2.0",

    status: "READY",

    lastDecision: null

};

// ==========================
// Get Status
// ==========================
RJBrain.getStatus = function(){

    return{

        version: this.version,

        status: this.status

    };

};

// ==========================
// Reset Brain
// ==========================
RJBrain.reset = function(){

    this.lastDecision = null;

};
/* ==========================================
   RJAnalyser AI
   Brain Engine V2
   Part 2 - Brain Score Engine
========================================== */

// ==========================
// Calculate Brain Score
// ==========================
RJBrain.calculateScore = function(data){

    if(!data){

        return 0;

    }

    let score = 0;

    // Pattern Score (20)
    score += (data.pattern.confidence || 0) * 0.20;

    // Memory Score (20)
    score += (data.memory.confidence || 0) * 0.20;

    // Learning Score (20)
    score += (data.learningConfidence || 0) * 0.20;

    // Market Energy (15)
    score += (data.features.marketEnergy || 0) * 0.15;

    // Buyer Pressure (10)
    score += (data.features.buyerPressure || 0) * 0.10;

    // Momentum (10)
    if(data.features.momentum==="BULLISH"){

        score += 10;

    }

    if(data.features.momentum==="BEARISH"){

        score += 10;

    }

    // Pattern Bonus (5)
    if(data.pattern.pattern!=="NONE"){

        score += 5;

    }

    if(score>100){

        score=100;

    }

    return Math.round(score);

};

// ==========================
// Brain Level
// ==========================
RJBrain.getBrainLevel = function(score){

    if(score>=90){

        return "EXCELLENT";

    }

    if(score>=75){

        return "STRONG";

    }

    if(score>=60){

        return "GOOD";

    }

    if(score>=40){

        return "AVERAGE";

    }

    return "WEAK";

};
/* ==========================================
   RJAnalyser AI
   Brain Engine V2
   Part 3 - Decision Engine
========================================== */

// ==========================
// Final Decision
// ==========================
RJBrain.makeDecision = function(data){

    if(!data){

        return null;

    }

    const score = this.calculateScore(data);

    let buyVotes = 0;
    let sellVotes = 0;

    // Pattern Vote
    if(data.pattern.signal==="BUY") buyVotes++;
    if(data.pattern.signal==="SELL") sellVotes++;

    // Memory Vote
    if(data.memory.recommendation==="BUY") buyVotes++;
    if(data.memory.recommendation==="SELL") sellVotes++;

    // Momentum Vote
    if(data.features.momentum==="BULLISH") buyVotes++;
    if(data.features.momentum==="BEARISH") sellVotes++;

    // Market Bias Vote
    if(data.features.marketBias==="BUYERS") buyVotes++;
    if(data.features.marketBias==="SELLERS") sellVotes++;

    // Buyer/Seller Pressure Vote
    if(data.features.buyerPressure >
       data.features.sellerPressure){

        buyVotes++;

    }else if(

        data.features.sellerPressure >
        data.features.buyerPressure){

        sellVotes++;

    }

    let decision = "WAIT";

    if(score >= 90 && buyVotes >= 4){

        decision = "STRONG BUY";

    }
    else if(score >= 75 && buyVotes >= 3){

        decision = "BUY";

    }
    else if(score <= 25 && sellVotes >= 4){

        decision = "STRONG SELL";

    }
    else if(score <= 45 && sellVotes >= 3){

        decision = "SELL";

    }

    this.lastDecision = {

        score: score,

        decision: decision,

        buyVotes: buyVotes,

        sellVotes: sellVotes,

        level: this.getBrainLevel(score)

    };

    return this.lastDecision;

};
/* ==========================================
   RJAnalyser AI
   Brain Engine V2
   Part 4 - Risk Filter
========================================== */

// ==========================
// Risk Analysis
// ==========================
RJBrain.analyseRisk = function(data){

    if(!data){

        return{

            risk:100,

            level:"UNKNOWN"

        };

    }

    let risk = 0;

    // Low Memory Confidence
    if(data.memory.confidence < 50){

        risk += 25;

    }

    // Weak Pattern
    if(data.pattern.strength < 50){

        risk += 20;

    }

    // Low Brain Confidence
    if(data.learningConfidence < 60){

        risk += 20;

    }

    // Low Market Energy
    if(data.features.marketEnergy < 30){

        risk += 15;

    }

    // Compression Market
    if(data.features.compression === "COMPRESSION"){

        risk += 10;

    }

    // Buyer/Seller Almost Equal
    if(Math.abs(
        data.features.buyerPressure -
        data.features.sellerPressure
    ) < 10){

        risk += 10;

    }

    if(risk > 100){

        risk = 100;

    }

    let level = "LOW";

    if(risk >= 75){

        level = "EXTREME";

    }
    else if(risk >= 50){

        level = "HIGH";

    }
    else if(risk >= 25){

        level = "MEDIUM";

    }

    return{

        risk:risk,

        level:level

    };

};

// ==========================
// Apply Risk Filter
// ==========================
RJBrain.applyRiskFilter = function(decision,data){

    const risk = this.analyseRisk(data);

    let finalDecision = decision.decision;

    // High Risk Protection
    if(risk.level === "HIGH"){

        if(finalDecision === "BUY"){

            finalDecision = "WAIT";

        }

        if(finalDecision === "SELL"){

            finalDecision = "WAIT";

        }

    }

    // Extreme Risk Protection
    if(risk.level === "EXTREME"){

        finalDecision = "WAIT";

    }

    decision.risk = risk.risk;

    decision.riskLevel = risk.level;

    decision.finalDecision = finalDecision;

    return decision;

};
/* ==========================================
   RJAnalyser AI
   Brain Engine V2
   Part 5 - Final Brain
========================================== */

// ==========================
// Complete Brain Analysis
// ==========================
RJBrain.analyse = function(data){

    if(!data){

        return null;

    }

    // Brain Score
    const brainScore = this.calculateScore(data);

    // Decision
    const decision = this.makeDecision(data);

    // Risk Filter
    const finalDecision = this.applyRiskFilter(decision,data);

    // Final Result
    const result = {

        brainScore: brainScore,

        brainLevel: this.getBrainLevel(brainScore),

        decision: decision.decision,

        finalDecision: finalDecision.finalDecision,

        confidence: data.learningConfidence,

        risk: finalDecision.risk,

        riskLevel: finalDecision.riskLevel,

        buyVotes: finalDecision.buyVotes,

        sellVotes: finalDecision.sellVotes,

        pattern: data.pattern.pattern,

        signal: data.pattern.signal,

        timestamp: Date.now()

    };

    this.lastDecision = result;

    return result;

};

// ==========================
// Last Brain Result
// ==========================
RJBrain.getLastDecision = function(){

    return this.lastDecision;

};

// ==========================
// Brain Health
// ==========================
RJBrain.health = function(){

    return{

        version: this.version,

        status: this.status,

        lastDecision: this.lastDecision

    };

};
