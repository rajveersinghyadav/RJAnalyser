/* ======================================
   RJAnalyser Quotes Module V1
====================================== */


function loadQuotes(){

    let box = document.getElementById("quotesList");

    if(!box) return;


    box.innerHTML = "";


    let markets = [];


    if(typeof RJAssets !== "undefined"){

        markets = [
            ...RJAssets.crypto,
            ...RJAssets.forex,
            ...RJAssets.commodities,
            ...RJAssets.indices
        ];

    }


    markets.forEach(asset=>{


        let item=document.createElement("div");


        item.className="quote-item";


        item.innerHTML=`

        <div>

        <b>${asset}</b>

        <small>Live Market</small>

        </div>

        <span>›</span>

        `;


        item.onclick=function(){

            selectAsset(asset);


            // Open Chart Tab

            showPage("chart");

        };


        box.appendChild(item);


    });


}



function searchQuotes(){


    let input=document.getElementById("quoteSearch");

    let value=input.value.toUpperCase();


    document.querySelectorAll(".quote-item")
    .forEach(item=>{


        if(item.innerText.includes(value)){

            item.style.display="flex";

        }

        else{

            item.style.display="none";

        }


    });


}



window.addEventListener("load",()=>{

    loadQuotes();

});
