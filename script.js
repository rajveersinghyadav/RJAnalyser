// =========================================
// RJAnalyser Script V3
// =========================================

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

📊 Chart
${output.input}

🧩 Pattern
${output.pattern ? output.pattern.name : "Not Found"}

🤖 Decision
${output.decision.action}

🎯 Confidence
${output.decision.confidence}%

💡 Reason
${output.decision.reason}

━━━━━━━━━━━━━━━━━━

🧠 Brain : ${RJBrain.status}

💾 Memory : ${RJMemory.all().length} Records

📚 Knowledge : Ready

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
📷 Screenshot Loaded

━━━━━━━━━━━━━━━━━━

📄 File
${info.name}

🖼 Type
${info.type}

📐 Resolution
${info.width} × ${info.height}

💾 Size
${(info.size / 1024).toFixed(2)} KB

━━━━━━━━━━━━━━━━━━

👁 Vision
${report.message}

📈 Trend
${report.trend}

📊 Pattern
${report.pattern}

🎯 Confidence
${report.confidence}%

━━━━━━━━━━━━━━━━━━

✅ Ready For AI Analysis
`;

    } catch (err) {

        result.innerHTML = "❌ " + err.message;

    }

}

function saveLearning() {

    const learning = document.getElementById("teachAI").
