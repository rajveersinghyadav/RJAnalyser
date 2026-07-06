/*
=========================================
RJAnalyser Vision Engine V1
=========================================
*/

const RJVision = {

    version: "1.0",

    image: null,

    load(file) {

        this.image = file;

        return {

            success: true,

            filename: file.name,

            size: file.size

        };

    },

    analyse() {

        if (!this.image) {

            return {

                success: false,

                message: "No chart selected."

            };

        }

        return {

            success: true,

            trend: "Unknown",

            pattern: "Scanning...",

            confidence: 0,

            message: "Vision Engine Ready"

        };

    }

};
