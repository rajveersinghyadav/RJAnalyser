/*
=========================================
RJAnalyser Vision Engine V2
=========================================
*/

const RJVision = {

    version: "2.0",

    image: null,

    info: null,

    load(file) {

        return new Promise((resolve) => {

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

                img.src = e.target.result;

            };

            reader.readAsDataURL(file);

        });

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

            message: "Image processed successfully.",

            width: this.info.width,

            height: this.info.height,

            size: this.info.size,

            trend: "Unknown",

            pattern: "Scanning...",

            confidence: 0

        };

    }

};
