$(function() {
    var AnswersView = Backbone.View.extend({

        tagName:  "li",

        template: _.template($('#answer-item-template').html()),

        events: {
            "keyup .answer"  : "update",
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.input = this.$('.answer');
            this.$(".chars-left").html(250 - this.input.val().length + ' characters left');
            return this;
        },

        update: function() {
            var value = this.input.val();
            if (value.length > 250) {
                value = value.substr(0, 250);
                this.input.val(value);
            }
            this.$(".chars-left").html(250 - value.length + ' characters left');
            if (value.length > 0) this.$(".control-group").removeClass("error").find(".help-inline").addClass("hidden");
        }
    });

    var AnswersApp = Backbone.View.extend({

        el: $("#answers-app"),

        events: {
            "click .submit":  "submitAnswers",
        },

        initialize: function() {
            Questions.bind('add', this.addOne, this);
            Questions.bind('reset', this.addAll, this);
        },

        addOne: function(question) {
            var view = new AnswersView({model: question});
            this.$("#answers-list").append(view.render().el);
        },

        addAll: function() {
            this.$("#answers-list").html("");
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

    var project_id = $("#project_id");
    var Questions = new QuestionList;

    var Workspace = Backbone.Router.extend({

        routes: {
            "project/:id": "project",
            "*any": "default_project",
        },

        project: function(id) {
            project_id.val(id);
            Questions.url = "/api/questions/" + id;
            Questions.fetch();

            $(".alert").addClass("hidden");
        },

        default_project: function() {
            this.navigate("project/1", {trigger: true, replace: true})
        }
    });

    var Route = new Workspace;
    Backbone.history.start();
    var App = new AnswersApp;
});
