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
