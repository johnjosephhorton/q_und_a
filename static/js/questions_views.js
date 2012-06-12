$(function() {
    var Questions = new QuestionList;

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

        el: $("#questions-app"),

        events: {
            "click .new-question-add":  "addQuestion",
            "click .typical-questions option": "pasteTypicalQuestion",
            "click .save-questions": "saveQuestions",
        },

        initialize: function() {
            this.input = this.$(".new-question");
            Questions.bind('add', this.addOne, this);
            Questions.bind('reset', this.addAll, this);
            Questions.fetch({success: function() {
                // add random typical question, if list is empty
                if (Questions.length == 0) {
                    var options = typical_questions;
                    for (var i=0; i<suggest_num_typical_questions; i++) {
                        options = _.shuffle(options);
                        var text = options.pop();
                        Questions.create({text: text});
                    }
                }
            }});
            
            // prepare typical questions
            var typical_options = "";
            for (var i=0; i<typical_questions.length; i++) {
                typical_options += "<option>" + typical_questions[i] + "</option>";
            }
            this.$(".typical-questions").html(typical_options);

            this.$('.new-question').typeahead({source: typical_questions});
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
            Questions.each(function(question){ 
                if ("text" in question.changed)
                    question.save();
            });
        }
    });

    var App = new QuestionsApp;

});
