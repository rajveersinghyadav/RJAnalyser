/*
=========================================
RJAnalyser Learning Engine V1
=========================================
*/

const RJLearning = {

    rules: [],

    teach(title, description) {

        const rule = {
            id: Date.now(),
            title: title,
            description: description,
            created: new Date().toLocaleString()
        };

        this.rules.push(rule);
        this.save();

        return "Learning Saved Successfully";

    },

    save() {

        localStorage.setItem(
            "RJ_LEARNING_DATABASE",
            JSON.stringify(this.rules)
        );

    },

    load() {

        let data = localStorage.getItem("RJ_LEARNING_DATABASE");

        if (data) {

            this.rules = JSON.parse(data);

        }

    },

    getAll() {

        return this.rules;

    }

};

RJLearning.load();
