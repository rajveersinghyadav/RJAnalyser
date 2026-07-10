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
