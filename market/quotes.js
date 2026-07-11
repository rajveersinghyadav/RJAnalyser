/* =====================================================
   RJAnalyser AI V5
   market/quotes.js
===================================================== */

function loadQuotes(){

    const box = document.getElementById("quotesList");

    if(!box) return;

    box.innerHTML = "";

    const markets = [

        ...RJAssets.crypto,

        ...RJAssets.forex,

        ...RJAssets.commodities,

        ...RJAssets.indices

    ];

    markets.forEach(asset=>{

        const item = document.createElement("div");

        item.className = "quote-item";

        item.innerHTML = `

            <div>

                <b>${asset}</b>

                <small>Tap to Open Chart</small>

            </div>

            <span>›</span>

        `;

        item.onclick = ()=>{

            if(typeof selectAsset==="function"){

                selectAsset(asset);

            }

            if(typeof showPage==="function"){

                showPage("chart");

            }

        };

        box.appendChild(item);

    });

}

/* ======================================
   SEARCH
====================================== */

function searchQuotes(){

    const input=document.getElementById("quoteSearch");

    if(!input) return;

    const value=input.value.toUpperCase();

    document.querySelectorAll(".quote-item")
    .forEach(item=>{

        item.style.display=

        item.innerText.toUpperCase().includes(value)

        ?

        "flex"

        :

        "none";

    });

}

/* ======================================
   START
====================================== */

window.addEventListener("load",()=>{

    loadQuotes();

});
