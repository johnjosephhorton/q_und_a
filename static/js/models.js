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
