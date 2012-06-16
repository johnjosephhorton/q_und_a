$(function() {
    var Questions = new QuestionList;
    $app = $("#questions-app");
    
    var QuestionView = Backbone.View.extend({

        tagName:  "li",

        template: _.template($('#question-item-template').html()),

        events: {
            "click .delete" : "clear",
            "change .edit"  : "update",
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

        make: function(tagName, attributes, content) {
          var el = document.createElement(tagName);
          if (attributes) $(el).attr(attributes);
          $(el).hide();
          if (content != null) $(el).html(content);
          if (!this.model.id) $(el).show('slow'); else $(el).show();
          return el;
        },

        remove: function() {
            this.$el.hide('slow');
        },

        update: function() {
            var value = this.input.val();
            this.model.set({text: value}, {silent: true});
        },

        clear: function() {
            if (_.indexOf(typical_questions, this.model.get("text")) != -1 || confirm("Do you want to remove this question?"))
                this.model.clear();
        }
    });

    var QuestionsApp = Backbone.View.extend({

        el: $app,

        events: {
            "click .new-question-add":  "addQuestion",
            "change .typical-questions": "pasteTypicalQuestion",
            "click .save-questions": "saveQuestions",
        },

        initialize: function() {
            this.input = this.$(".new-question");
            Questions.bind('add', this.added, this);
            Questions.bind('reset', this.reseted, this);
            Questions.bind('remove', this.removed, this);

            // prepare typical questions
            var typical_options = this.$(".typical-questions").html();
            for (var i=0; i<typical_questions.length; i++) {
                typical_options += '<option value="' + typical_questions[i] + '">' + typical_questions[i] + '</option>';
            }
            this.$(".typical-questions").html(typical_options);

            this.$('.new-question').typeahead({source: typical_questions});
        },

        added: function(question) {
            var view = new QuestionView({model: question});
            this.$("#questions-list").append(view.render().el);
            this.$(".alert").addClass("hidden").end().find(".alert-success").removeClass("hidden").find("span").hide().end().find(".added").show();
            this.$(".save-questions").toggle(Questions.length > 0);
        },

        removed: function() {
            this.$(".alert").addClass("hidden").end().find(".alert-success").removeClass("hidden").find("span").hide().end().find(".removed").show();
            this.$(".save-questions").toggle(Questions.length > 0);
        },

        reseted: function() {
            this.$("#questions-list").html("");
            Questions.each(this.added);
            $(".alert").addClass("hidden");
        },

        addQuestion: function(e) {
            if (!this.input.val()) {
                this.input.parents("fieldset").addClass("error");
                this.$(".alert").addClass("hidden").end().find(".alert-error").removeClass("hidden");
                return;
            }
            this.input.parents("fieldset").removeClass("error");
            Questions.create({project: $app.data("project"), text: this.input.val()});
            this.input.val("");
        },

        pasteTypicalQuestion: function(e) {
            var new_text = this.$(".typical-questions").val();
            var current_text = this.$(".new-question").val();
            if (current_text == "" || _.indexOf(typical_questions, current_text) != -1)
                this.$(".new-question").val(new_text);
            else if (confirm("Do you want to replace the current question?"))
                this.$(".new-question").val(new_text);
            return;
        },

        saveQuestions: function() {
            Questions.each(function(question) {
                if ("text" in question.changed)
                    question.save();
            });
            
            this.$(".alert").addClass("hidden").end().find(".alert-success").removeClass("hidden").find("span").hide().end().find(".saved").show();
        }
    });

    var Workspace = Backbone.Router.extend({

        routes: {
            "project/:project": "project",
            "*any": "other",
        },

        project: function(project) {
            $app.data("project", project);
            Questions.fetch({data: {project: project}, success: function() {
                
                // add random typical question, if list is empty
                if (Questions.length == 0) {
                    var options = typical_questions;
                    for (var i=0; i<suggest_num_typical_questions; i++) {
                        options = _.shuffle(options);
                        var text = options.pop();
                        Questions.create({project: project, text: text});
                    }
                    $(".alert").addClass("hidden");
                }
            }});

            $(".answers-link").attr("href", "answers.html#project/" + project + "/user/1");
        },

        other: function() {
            this.navigate("project/1", {trigger: true, replace: true});
        }
    });

    var Route = new Workspace;
    Backbone.history.start();
    var App = new QuestionsApp;
});
