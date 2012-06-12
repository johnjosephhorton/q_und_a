var typical_questions = [
    "What's the hardest part of this project?",
    "Describe a previous project that is most similar to this one.",
    "What line from the job description best summarizes this project?",
    "What question do you have for me?",
    "Are there any skills in my skill list that you do not have / feel comfortable about?",
    "What parts of my project description is unclear?",
    "Do you have any other contractors that you might recommend for this project?",
    "How long do you think this project will take?",
    "How many hours a week can you devote to this project?",
    "What do you think is the most important ingredient to a successful client / contractor relationship?"
];

var suggest_num_typical_questions = 5;

var Question = Backbone.Model.extend({

    defaults: function() {
        return {
            text: ""
        };
    },

    initialize: function() {
        if (!this.get("text")) {
            this.set({"text": this.defaults.text});
        }
    },

    parse: function(response) {
        var attrs = {};
        attrs.id = response.id;
        attrs.text = response.text;
        return attrs;
    },

    clear: function() {
        this.destroy();
    }
});

// Collections
var QuestionList = Backbone.Collection.extend({

    model: Question,

    url: "/api/questions",
});
