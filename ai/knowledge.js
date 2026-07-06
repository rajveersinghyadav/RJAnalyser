/*
=========================================
RJAnalyser Knowledge Engine V1
=========================================
*/

const RJKnowledge = {

    version: "1.0",

    concepts: {

        trend: [
            "Bullish",
            "Bearish",
            "Sideways"
        ],

        marketStructure: [
            "Higher High",
            "Higher Low",
            "Lower High",
            "Lower Low",
            "BOS",
            "CHOCH"
        ],

        smartMoney: [
            "Liquidity",
            "Order Block",
            "Fair Value Gap"
        ],

        candlestick: [
            "Bullish Engulfing",
            "Bearish Engulfing",
            "Hammer",
            "Doji"
        ]

    },

    get(category){

        return this.concepts[category] || [];

    },

    search(word){

        let result=[];

        Object.values(this.concepts).forEach(group=>{

            group.forEach(item=>{

                if(item.toLowerCase().includes(word.toLowerCase())){

                    result.push(item);

                }

            });

        });

        return result;

    }

};
