/* =====================================================
   RJAnalyser AI V4
   PART 7
   AI MEMORY SYSTEM
===================================================== */


let RJMemory = [];



/* SAVE SIGNAL */

function RJSaveSignal(signalData){

    RJMemory.push({

        signal: signalData.signal,

        aiScore: signalData.aiScore || 0,

        strength: signalData.strength,

        reason: signalData.reason,

        time: new Date().toISOString(),

        result:"PENDING"

    });


    localStorage.setItem(
        "RJMemory",
        JSON.stringify(RJMemory)
    );

}



/* LOAD MEMORY */

function RJLoadMemory(){

    let data = localStorage.getItem("RJMemory");


    if(data){

        RJMemory = JSON.parse(data);

    }


    return RJMemory;

}





/* UPDATE RESULT */

function RJUpdateResult(index,status){


    if(RJMemory[index]){


        RJMemory[index].result=status;


        localStorage.setItem(
            "RJMemory",
            JSON.stringify(RJMemory)
        );


    }


}





/* ACCURACY */

function RJAccuracy(){


    let total=0;

    let win=0;


    RJMemory.forEach(item=>{


        if(item.result!=="PENDING"){


            total++;


            if(item.result==="WIN"){

                win++;

            }

        }


    });



    if(total===0){

        return 0;

    }



    return Math.round(
        (win/total)*100
    );


}





/* LEARNING BONUS */

function RJLearningBonus(){


    let accuracy=RJAccuracy();


    if(accuracy>=80){

        return 10;

    }


    if(accuracy>=60){

        return 5;

    }


    return 0;


}
