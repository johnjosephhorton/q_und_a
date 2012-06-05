$(function() {
    var Questions = new QuestionList;

    var AnswersView = Backbone.View.extend({

        tagName:  "li",

        template: _.template($('#answer-item-template').html()),

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.input = this.$('.edit');
            return this;
        },
    });

    var AnswersApp = Backbone.View.extend({

        el: $("#answers-app"),

        events: {
            "click .submit":  "submitAnswers",
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
            var filled = true;
            this.$("#answers-list .control-group").removeClass("error").find(".help-inline").addClass("hidden");
            this.$("#answers-list .answer").each(function() {
                if (!$(this).val()) {
                    $(this).parents(".control-group").addClass("error").find(".help-inline").removeClass("hidden");
                    filled = false;
                }
            });
            if (!filled) return false;
            
            var answers = [];
            this.$("#answers-list .answer").each(function() {
                answers.push({"id": $(this).data("question"), "text": $(this).val()});
            });

            jQuery.ajax({type: 'POST', url: "/api/submit_answers", data: JSON.stringify({"answers": answers}), contentType: "application/json", dataType: "json", success: function(data) {
                $("#answers-app .alert-success").removeClass("hidden");
            }});
            return false;
        }
    });

    var App = new AnswersApp;
});
