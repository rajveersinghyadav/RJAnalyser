function analyzeChart() {

    const chart = document.getElementById("chartLink").value;
    const result = document.getElementById("result");

    if(chart.trim() === ""){
        result.innerHTML = "⚠️ Please paste a Trading Chart link first.";
        return;
    }

    result.innerHTML = `
📈 RJAnalyser AI

Chart Received Successfully.

━━━━━━━━━━━━━━━━━━

Status : Processing...

✔ Trend Detection : Pending

✔ Pattern Recognition : Pending

✔ Learning Engine : Ready

✔ AI Brain : Active

━━━━━━━━━━━━━━━━━━

This is Version 1.

In Version 2 AI will automatically analyse Trading Charts.
`;
}

function saveLearning(){

    const learning = document.getElementById("teachAI").value;

    if(learning.trim()==""){
        alert("Please teach something to AI first.");
        return;
    }

    localStorage.setItem("RJAI_LEARNING",learning);

    document.getElementById("memoryStatus").innerHTML="✅ Learning Saved Successfully";
}

function openMemory(){

    let data=localStorage.getItem("RJAI_LEARNING");

    if(data==null){

        alert("Memory Empty");

    }else{

        alert("AI Memory\n\n"+data);

    }

}

window.onload=function(){

let data=localStorage.getItem("RJAI_LEARNING");

if(data){

document.getElementById("memoryStatus").innerHTML="🧠 Memory Loaded";

}

}
