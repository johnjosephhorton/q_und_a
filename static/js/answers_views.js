$(function() {
    var Questions = new QuestionList;
    var Answers = new AnswerList;
    $app = $("#answers-app");

    var AnswersView = Backbone.View.extend({

        tagName:  "li",

        template: _.template($('#answer-item-template').html()),

        events: {
            "keyup .answer"  : "update",
            "change .edit"  : "update",
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.input = this.$('.answer');
            this.$(".chars-left").html(answer_chars_limit - this.input.val().length + ' characters left');
            return this;
        },

        update: function() {
            var value = this.input.val();
            if (value.length > answer_chars_limit) {
                value = value.substr(0, answer_chars_limit);
                this.input.val(value);
            }
            this.$(".chars-left").html(answer_chars_limit - value.length + ' characters left');
            if (value.length > 0) this.$(".control-group").removeClass("error").find(".help-inline").addClass("hidden");

            this.model.set({text: value}, {silent: true});
        }

    });

    var AnswersApp = Backbone.View.extend({

        el: $app,

        events: {
            "click .submit":  "saveAnswers",
        },

        initialize: function() {
            Answers.bind('add', this.added, this);
            Answers.bind('reset', this.reseted, this);
            Answers.bind('remove', this.removed, this);
        },

        added: function(answer) {
            var view = new AnswersView({model: answer});
            this.$("#answers-list").append(view.render().el);
            this.$(".alert").addClass("hidden").end().find(".alert-success").removeClass("hidden").find("span").hide().end().find(".added").show();
        },

        removed: function() {
            this.$(".alert").addClass("hidden").end().find(".alert-success").removeClass("hidden").find("span").hide().end().find(".removed").show();
            this.$(".save-questions").toggle(Questions.length > 0);
        },

        reseted: function() {
            this.$("#answers-list").html("");
            Answers.each(this.added);
            $(".alert").addClass("hidden");
        },

        saveAnswers: function(e) {
            Answers.each(function(answer) {
                if ("text" in answer.changed)
                    answer.save();
            });
            
            this.$(".alert").addClass("hidden").end().find(".alert-success").removeClass("hidden").find("span").hide().end().find(".saved").show();
        }
    });

    var Workspace = Backbone.Router.extend({

        routes: {
            "project/:project/user/:user": "application",
            "*any": "other",
        },

        application: function(project, user) {
            $app.data("project", project).data("user", user);
            Answers.fetch({data: {project: project, user: user}, success: function() {
                Questions.fetch({data: {project: project}, success: function() {
                    Questions.each(function(question) {
                        if (Answers.where({question: question.id}) == 0)
                            Answers.create({question: question.id, question_text: question.get("text"), user: $app.data("user"), text: ""});
                    });
                    $(".alert").addClass("hidden");
                }});
            }});

            $(".alert").addClass("hidden");
        },

        other: function() {
            this.navigate("project/1/user/1", {trigger: true, replace: true});
        }
    });

    var Route = new Workspace;
    Backbone.history.start();
    var App = new AnswersApp;
});
