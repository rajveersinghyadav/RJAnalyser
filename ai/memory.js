/*
=========================================
RJAnalyser Memory Engine V1
=========================================
*/

const RJMemory = {

    database: [],

    load() {

        const data = localStorage.getItem("RJ_MEMORY");

        if (data) {

            this.database = JSON.parse(data);

        }

    },

    save() {

        localStorage.setItem(
            "RJ_MEMORY",
            JSON.stringify(this.database)
        );

    },

    add(type, value) {

        this.database.push({

            id: Date.now(),

            type: type,

            value: value,

            time: new Date().toLocaleString()

        });

        this.save();

    },

    all() {

        return this.database;

    },

    clear() {

        this.database = [];

        this.save();

    }

};

RJMemory.load();
