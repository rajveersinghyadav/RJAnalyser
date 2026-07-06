function analyzeChart() {

    const chart = document.getElementById("chartLink").value;
    const result = document.getElementById("result");

    if (chart.trim() === "") {

        result.innerHTML = "⚠️ Please paste a Trading Chart link first.";

        return;

    }

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

async function scanScreenshot() {

    const file = document.getElementById("chartImage").files[0];
    const result = document.getElementById("result");

    if (!file) {

        result.innerHTML = "⚠️ Please select a Trading Chart Screenshot.";

        return;

    }

    try {

        const info = await RJVision.load(file);

        const report = RJVision.analyse();

        RJMemory.add("Screenshot", info.name);

        result.innerHTML = `
📷 Screenshot Loaded Successfully

━━━━━━━━━━━━━━━━━━

📄 File :
${info.name}

🖼 Type :
${info.type}

📐 Resolution :
${info.width} × ${info.height}

💾 Size :
${(info.size / 1024).toFixed(2)} KB

━━━━━━━━━━━━━━━━━━

👁 Vision Status :
${report.message}

📈 Trend :
${report.trend}

📊 Pattern :
${report.pattern}

🎯 Confidence :
${report.confidence}%

━━━━━━━━━━━━━━━━━━

✅ Ready For AI Analysis
`;

    } catch (error) {

        result.innerHTML = `
❌ Vision Engine Error

${error.message}
`;

    }

}

function saveLearning() {

    const learning = document.getElementById("teachAI").value;

    if (learning.trim() === "") {

        alert("Please teach something to AI first.");

        return;

    }

    localStorage.setItem("RJAI_LEARNING", learning);

    RJMemory.add("Learning", learning);

    document.getElementById("memoryStatus").innerHTML =
        "✅ Learning Saved Successfully";

}

function openMemory() {

    const memory = RJMemory.all();

    if (memory.length === 0) {

        alert("Memory Empty");

        return;

    }

    alert(JSON.stringify(memory, null, 2));

}

window.onload = function () {

    RJBrain.start();

    document.getElementById("brainStatus").innerHTML = RJBrain.status;

    let data = localStorage.getItem("RJAI_LEARNING");

    if (data) {

        document.getElementById("memoryStatus").innerHTML =
            "🧠 Memory Loaded";

    }

};
