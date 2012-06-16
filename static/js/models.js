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
var answer_chars_limit = 250;

var Question = Backbone.Model.extend({

    defaults: function() {
        return {
            text: "",
            project: 1,
        };
    },

    initialize: function() {
        if (!this.get("text")) this.set({"text": this.defaults.text});
        if (!this.get("project")) this.set({"project": this.defaults.project});
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

var Answer = Backbone.Model.extend({

    defaults: function() {
        return {
            text: "",
            question: 1,
            question_text: "",
            user: 1,
        };
    },

    initialize: function() {
        if (!this.get("text")) this.set({"text": this.defaults.text});
        if (!this.get("question")) this.set({"question": this.defaults.question});
        if (!this.get("question_text")) this.set({"question_text": this.defaults.question_text});
        if (!this.get("user")) this.set({"user": this.defaults.user});
    },

    clear: function() {
        this.destroy();
    }
});

// Collections
var AnswerList = Backbone.Collection.extend({

    model: Answer,
    url: "/api/answers",
});
