// Underscore templates settings
_.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
};

$(function() {
    // Models
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

    var Questions = new QuestionList;

    // Views
    var QuestionView = Backbone.View.extend({

        tagName:  "li",

        template: _.template($('#question-item-template').html()),

        events: {
            "click .delete" : "clear",
            "click .save"  : "save",
        },

        initialize: function() {
            this.model.bind('change', this.render, this);
            this.model.bind('destroy', this.remove, this);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.input = this.$('.edit');
            return this;
        },

        save: function() {
            var value = this.input.val();
            this.model.save({text: value});
        },

        clear: function() {
            this.model.clear();
        }
    });

    var AnswersView = Backbone.View.extend({

        tagName:  "li",

        //template: _.template($('#answer-item-template').html()),

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.input = this.$('.edit');
            return this;
        },
    });

    // Applications
    var QuestionsApp = Backbone.View.extend({

        el: $("#questions-app"),

        events: {
            "click #new-question-add":  "addQuestion",
            "blur #new-question": "checkText",
        },

        initialize: function() {
            this.input = this.$("#new-question");
            Questions.bind('add', this.addOne, this);
            Questions.bind('reset', this.addAll, this);
            Questions.fetch();
        },

        addOne: function(question) {
            var view = new QuestionView({model: question});
            this.$("#questions-list").append(view.render().el);
        },

        addAll: function() {
            Questions.each(this.addOne);
        },

        addQuestion: function(e) {
            if (!this.input.val()) {
                this.input.parents("fieldset").addClass("error");
                return;
            }
            Questions.create({text: this.input.val()});
            this.input.val("");
        },

        checkText: function(e) {
            if (this.input.val()) this.input.parents("fieldset").removeClass("error");
            return;
        }
    });

    var AnswersApp = Backbone.View.extend({

        el: $("#answers-app"),

        events: {
            "click #submit":  "submitAnswers",
        },

        initialize: function() {
            Questions.bind('add', this.addOne, this);
            Questions.bind('reset', this.addAll, this);
            Questions.fetch();
        },

        addOne: function(question) {
            var view = new AnswersView({model: question});
            this.$("#answers-list").append(view.render().el);
        },

        addAll: function() {
            Questions.each(this.addOne);
        },

        submitAnswers: function(e) {
            // check and submit
            return;
        }
    });
});
