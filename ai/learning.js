/* ==========================================
   RJAnalyser AI
   Learning Engine V1
   Part 1 - Learning Memory
========================================== */

const RJLearning = {

    database:{},

    totalLearning:0

};

// ==========================
// Create Learning Record
// ==========================
RJLearning.create = function(pattern){

    if(!this.database[pattern]){

        this.database[pattern]={

            wins:0,

            losses:0,

            trades:0,

            weight:50,

            accuracy:0

        };

    }

};

// ==========================
// Get Record
// ==========================
RJLearning.get = function(pattern){

    this.create(pattern);

    return this.database[pattern];

};

// ==========================
// Total Learned Patterns
// ==========================
RJLearning.count = function(){

    return Object.keys(this.database).length;

};
/* ==========================================
   RJAnalyser AI
   Learning Engine V1
   Part 2 - Win/Loss Trainer
========================================== */

// ==========================
// Learn From Result
// ==========================
RJLearning.learn = function(pattern,outcome){

    this.create(pattern);

    let record = this.database[pattern];

    record.trades++;

    if(outcome==="WIN"){

        record.wins++;

    }

    if(outcome==="LOSS"){

        record.losses++;

    }

    // Accuracy
    record.accuracy =
    Number(
        (
            record.wins /
            record.trades
        ) * 100
    ).toFixed(2);

    // Weight Update
    if(record.accuracy >= 80){

        record.weight += 3;

    }

    else if(record.accuracy >= 60){

        record.weight += 1;

    }

    else if(record.accuracy < 40){

        record.weight -= 2;

    }

    // Limit Weight
    if(record.weight > 100){

        record.weight = 100;

    }

    if(record.weight < 0){

        record.weight = 0;

    }

    this.totalLearning++;

};

// ==========================
// Get Accuracy
// ==========================
RJLearning.getAccuracy = function(pattern){

    this.create(pattern);

    return this.database[pattern].accuracy;

};

// ==========================
// Get Weight
// ==========================
RJLearning.getWeight = function(pattern){

    this.create(pattern);

    return this.database[pattern].weight;

};
/* ==========================================
   RJAnalyser AI
   Learning Engine V1
   Part 3 - Dynamic Weight Engine
========================================== */

// ==========================
// Feature Weights
// ==========================
RJLearning.featureWeights = {

    pattern:20,

    memory:20,

    momentum:15,

    buyerPressure:10,

    sellerPressure:10,

    marketBias:10,

    marketEnergy:10,

    confidence:5

};

// ==========================
// Get Feature Weight
// ==========================
RJLearning.getFeatureWeight = function(feature){

    return this.featureWeights[feature] || 0;

};

// ==========================
// Update Feature Weight
// ==========================
RJLearning.updateFeatureWeight = function(feature,result){

    if(this.featureWeights[feature]===undefined){

        return;

    }

    if(result==="WIN"){

        this.featureWeights[feature] += 1;

    }

    if(result==="LOSS"){

        this.featureWeights[feature] -= 1;

    }

    // Limit

    if(this.featureWeights[feature] > 30){

        this.featureWeights[feature] = 30;

    }

    if(this.featureWeights[feature] < 1){

        this.featureWeights[feature] = 1;

    }

};

// ==========================
// Get Total Weight
// ==========================
RJLearning.getTotalWeight = function(){

    let total = 0;

    Object.values(this.featureWeights).forEach(value=>{

        total += value;

    });

    return total;

};

// ==========================
// Normalize Weights
// ==========================
RJLearning.normalizeWeights = function(){

    const total = this.getTotalWeight();

    Object.keys(this.featureWeights).forEach(key=>{

        this.featureWeights[key] = Number(

            (

                (this.featureWeights[key] / total) * 100

            ).toFixed(2)

        );

    });

};
/* ==========================================
   RJAnalyser AI
   Learning Engine V1
   Part 4 - Confidence Optimizer
========================================== */

// ==========================
// Calculate Confidence
// ==========================
RJLearning.calculateConfidence = function(data){

    if(!data){

        return 0;

    }

    let score = 0;

    // Pattern
    score += (data.patternStrength || 0) *
             (this.getFeatureWeight("pattern") / 100);

    // Memory
    score += (data.memoryConfidence || 0) *
             (this.getFeatureWeight("memory") / 100);

    // Momentum
    score += (data.momentumScore || 0) *
             (this.getFeatureWeight("momentum") / 100);

    // Buyer Pressure
    score += (data.buyerPressure || 0) *
             (this.getFeatureWeight("buyerPressure") / 100);

    // Seller Pressure
    score += (data.sellerPressure || 0) *
             (this.getFeatureWeight("sellerPressure") / 100);

    // Market Energy
    score += (data.marketEnergy || 0) *
             (this.getFeatureWeight("marketEnergy") / 100);

    // Market Bias Bonus
    if(data.marketBias==="BUYERS"){

        score += 3;

    }

    if(data.marketBias==="SELLERS"){

        score += 3;

    }

    if(score>100){

        score=100;

    }

    return Math.round(score);

};

// ==========================
// Confidence Level
// ==========================
RJLearning.getConfidenceLevel = function(confidence){

    if(confidence>=90){

        return "VERY HIGH";

    }

    if(confidence>=75){

        return "HIGH";

    }

    if(confidence>=60){

        return "MEDIUM";

    }

    if(confidence>=40){

        return "LOW";

    }

    return "VERY LOW";

};

// ==========================
// Trade Decision
// ==========================
RJLearning.getDecision = function(confidence){

    if(confidence>=90){

        return "STRONG BUY";

    }

    if(confidence>=75){

        return "BUY";

    }

    if(confidence>=60){

        return "WAIT";

    }

    if(confidence>=40){

        return "SELL";

    }

    return "STRONG SELL";

};
/* ==========================================
   RJAnalyser AI
   Learning Engine V1
   Part 5 - Self Improvement Engine
========================================== */

// ==========================
// Improve AI
// ==========================
RJLearning.selfImprove = function(){

    Object.keys(this.database).forEach(pattern=>{

        let record = this.database[pattern];

        // Accuracy

        if(record.trades > 0){

            record.accuracy = Number(

                (

                    (record.wins / record.trades) * 100

                ).toFixed(2)

            );

        }

        // Auto Weight

        if(record.accuracy >= 90){

            record.weight += 2;

        }

        else if(record.accuracy >= 80){

            record.weight += 1;

        }

        else if(record.accuracy < 50){

            record.weight -= 2;

        }

        // Limits

        if(record.weight > 100){

            record.weight = 100;

        }

        if(record.weight < 1){

            record.weight = 1;

        }

    });

};

// ==========================
// Overall Learning Score
// ==========================
RJLearning.getLearningScore = function(){

    let totalAccuracy = 0;

    let count = 0;

    Object.keys(this.database).forEach(pattern=>{

        totalAccuracy += this.database[pattern].accuracy;

        count++;

    });

    if(count===0){

        return 0;

    }

    return Math.round(totalAccuracy / count);

};

// ==========================
// AI Status
// ==========================
RJLearning.getStatus = function(){

    return{

        patterns:this.count(),

        totalLearning:this.totalLearning,

        learningScore:this.getLearningScore(),

        featureWeights:this.featureWeights

    };

};

// ==========================
// Auto Improve
// ==========================
RJLearning.autoTrain = function(){

    this.selfImprove();

    this.normalizeWeights();

};
