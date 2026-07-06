function analyzeChart() {

    const chart = document.getElementById("chartLink").value;
    const result = document.getElementById("result");

    if (chart.trim() === "") {
        result.innerHTML = "⚠️ Please paste a Trading Chart link first.";
        return;
    }

    // Run RJ Engine
    const output = RJEngine.analyse(chart);

    result.innerHTML = `
📈 RJAnalyser AI Report

━━━━━━━━━━━━━━━━━━

Chart :
${output.input}

Pattern :
${output.pattern ? output.pattern.name : "Not Found"}

Decision :
${output.decision.action}

Confidence :
${output.decision.confidence}%

Reason :
${output.decision.reason}

━━━━━━━━━━━━━━━━━━

🧠 Brain : ${RJBrain.status}

💾 Memory Entries : ${RJMemory.all().length}

📚 Knowledge Engine : Ready

🤖 Version : ${RJBrain.version}
`;

}

function scanScreenshot() {

    const file = document.querySelector('input[type="file"]').files[0];
    const result = document.getElementById("result");

    if (!file) {

        result.innerHTML = "⚠️ Please select a chart screenshot.";

        return;
    }

    const vision = RJVision.load(file);

    const report = RJVision.analyse();

    RJMemory.add("screenshot", file.name);

    result.innerHTML = `
📷 Screenshot Loaded

━━━━━━━━━━━━━━━━━━

File :
${vision.filename}

Size :
${Math.round(vision.size / 1024)} KB

Vision :
${report.message}

Trend :
${report.trend}

Pattern :
${report.pattern}

Confidence :
${report.confidence}%

━━━━━━━━━━━━━━━━━━
`;
}

function saveLearning() {

    const learning = document.getElementById("teachAI").value;

    if (learning.trim() == "") {

        alert("Please teach something to AI first.");

        return;
    }

    localStorage.setItem("RJAI_LEARNING", learning);

    RJMemory.add("learning", learning);

    document.getElementById("memoryStatus").innerHTML = "✅ Learning Saved Successfully";
}

function openMemory() {

    alert(JSON.stringify(RJMemory.all(), null, 2));

}

window.onload = function () {

    RJBrain.start();

    let data = localStorage.getItem("RJAI_LEARNING");

    if (data) {

        document.getElementById("memoryStatus").innerHTML = "🧠 Memory Loaded";

    }

};
