/*
=========================================
RJAnalyser Pattern Engine V1
=========================================
*/

const RJPattern = {

    version: "1.0",

    patterns: [

        {
            name: "Bullish Engulfing",
            type: "Bullish",
            confidence: 70
        },

        {
            name: "Bearish Engulfing",
            type: "Bearish",
            confidence: 70
        },

        {
            name: "Hammer",
            type: "Bullish",
            confidence: 65
        },

        {
            name: "Doji",
            type: "Neutral",
            confidence: 50
        }

    ],

    getAll() {

        return this.patterns;

    },

    find(name) {

        return this.patterns.find(
            p => p.name === name
        );

    }

};
