/* ==========================================
   RJAnalyser AI
   Experience Memory V2
   Part 1
========================================== */

const RJMemory = {

    experiences: [],

    maxMemory: 10000

};

// ==========================
// Save Experience
// ==========================
RJMemory.save = function(record){

    if(!record) return;

    record.id =
    "EXP-" +
    String(this.experiences.length + 1).padStart(6,"0");

    record.timestamp =
    Date.now();

    this.experiences.push(record);

    if(this.experiences.length > this.maxMemory){

        this.experiences.shift();

    }

};

// ==========================
// Get All Experiences
// ==========================
RJMemory.getAll = function(){

    return this.experiences;

};

// ==========================
// Total Memory
// ==========================
RJMemory.count = function(){

    return this.experiences.length;

};
/* ==========================================
   RJAnalyser AI
   Experience Memory V2
   Part 2 - Local Storage Engine
========================================== */

// ==========================
// Save Memory to Local Storage
// ==========================
RJMemory.saveToDisk = function(){

    try{

        localStorage.setItem(

            "RJ_MEMORY",

            JSON.stringify(this.experiences)

        );

    }

    catch(error){

        console.log("Memory Save Error",error);

    }

};

// ==========================
// Load Memory from Local Storage
// ==========================
RJMemory.loadFromDisk = function(){

    try{

        const data = localStorage.getItem("RJ_MEMORY");

        if(data){

            this.experiences = JSON.parse(data);

        }

    }

    catch(error){

        console.log("Memory Load Error",error);

        this.experiences = [];

    }

};

// ==========================
// Clear Memory
// ==========================
RJMemory.clear = function(){

    this.experiences = [];

    localStorage.removeItem("RJ_MEMORY");

};

// ==========================
// Auto Save Experience
// ==========================
RJMemory.add = function(record){

    this.save(record);

    this.saveToDisk();

};
/* ==========================================
   RJAnalyser AI
   Experience Memory V2
   Part 3 - Experience Search Engine
========================================== */

// ==========================
// Find Similar Experiences
// ==========================
RJMemory.findSimilar = function(current){

    if(!current) return [];

    return this.experiences.filter(exp=>{

        return (

            exp.pattern === current.pattern &&

            exp.signal === current.signal &&

            exp.marketBias === current.marketBias

        );

    });

};

// ==========================
// Experience Statistics
// ==========================
RJMemory.getStatistics = function(current){

    const list = this.findSimilar(current);

    let win = 0;
    let loss = 0;

    list.forEach(exp=>{

        if(exp.outcome==="WIN"){

            win++;

        }

        if(exp.outcome==="LOSS"){

            loss++;

        }

    });

    const total = win + loss;

    let success = 0;

    if(total>0){

        success = Number(((win/total)*100).toFixed(2));

    }

    return{

        total:list.length,

        wins:win,

        losses:loss,

        successRate:success

    };

};

// ==========================
// Best Decision
// ==========================
RJMemory.getRecommendation = function(current){

    const stats = this.getStatistics(current);

    let action = "WAIT";

    if(stats.successRate >= 70){

        action = current.signal;

    }

    return{

        recommendation:action,

        confidence:stats.successRate,

        history:stats.total

    };

};
/* ==========================================
   RJAnalyser AI
   Experience Memory V2
   Part 4 - Market DNA Search
========================================== */

// ==========================
// DNA Similarity Score
// ==========================
RJMemory.getDNAScore = function(current, past){

    let score = 0;

    // Pattern
    if(current.pattern === past.pattern){
        score += 20;
    }

    // Signal
    if(current.signal === past.signal){
        score += 15;
    }

    // Market Bias
    if(current.marketBias === past.marketBias){
        score += 15;
    }

    // Momentum
    if(current.momentum === past.momentum){
        score += 15;
    }

    // Expansion
    if(current.expansion === past.expansion){
        score += 10;
    }

    // Compression
    if(current.compression === past.compression){
        score += 10;
    }

    // Buyer Pressure
    if(Math.abs(current.buyerPressure - past.buyerPressure) <= 10){
        score += 7;
    }

    // Seller Pressure
    if(Math.abs(current.sellerPressure - past.sellerPressure) <= 10){
        score += 4;
    }

    // Market Energy
    if(Math.abs(current.marketEnergy - past.marketEnergy) <= 10){
        score += 4;
    }

    return score;

};

// ==========================
// Find Best DNA Match
// ==========================
RJMemory.findBestMatch = function(current){

    let best = null;

    let bestScore = -1;

    this.experiences.forEach(exp=>{

        const score = this.getDNAScore(current, exp);

        if(score > bestScore){

            bestScore = score;

            best = exp;

        }

    });

    return{

        match: best,

        score: bestScore

    };

};

// ==========================
// AI Decision From DNA
// ==========================
RJMemory.getDNADecision = function(current){

    const result = this.findBestMatch(current);

    if(!result.match){

        return{

            recommendation:"WAIT",

            confidence:0,

            dnaScore:0

        };

    }

    return{

        recommendation: result.match.signal,

        confidence: result.match.confidence || 50,

        dnaScore: result.score,

        previousOutcome: result.match.outcome || "UNKNOWN"

    };

};
