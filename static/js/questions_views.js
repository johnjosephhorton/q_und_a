$(function() {
    var Questions = new QuestionList;

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

    var App = new QuestionsApp;

});
