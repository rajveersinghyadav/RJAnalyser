/*
=========================================
RJAnalyser Vision Engine V3
=========================================
*/

const RJVision = {

    version: "3.0",

    image: null,

    info: null,

    load(file) {

        return new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.onload = (e) => {

                const img = new Image();

                img.onload = () => {

                    this.image = img;

                    this.info = {

                        name: file.name,
                        size: file.size,
                        width: img.width,
                        height: img.height,
                        type: file.type

                    };

                    resolve(this.info);

                };

                img.onerror = () => {

                    reject(new Error("Image could not be loaded."));

                };

                img.src = e.target.result;

            };

            reader.onerror = () => {

                reject(new Error("File could not be read."));

            };

            reader.readAsDataURL(file);

        });

    },

    checkOpenCV() {

        if (typeof cv === "undefined") {

            return {

                success: false,

                message: "OpenCV Not Loaded"

            };

        }

        return {

            success: true,

            message: "OpenCV Loaded Successfully"

        };

    },

    analyse() {

        if (!this.info) {

            return {

                success: false,

                message: "No image loaded."

            };

        }

        return {

            success: true,

            message: "Image Ready For Analysis",

            width: this.info.width,

            height: this.info.height,

            size: this.info.size,

            trend: "Unknown",

            pattern: "Scanning...",

            confidence: 0

        };

    }

};
