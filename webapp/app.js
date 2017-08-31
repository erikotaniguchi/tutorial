var AccountModel = Backbone.Model.extend({});
var AccountCollection = Backbone.Collection.extend({
    url: 'data/accounts.json',
    model: AccountModel,
    parse : function(resp) {
        //Because the server won't return a top-level JSON Array!
        return resp.accounts;
    }
});
var accountsCollection = new AccountCollection();
accountsCollection.fetch({
    reset: true,
    success: function(collection) {
        console.log('loaded accounts ', collection);
    },
    error: function() {
        console.log('error loading accounts ', arguments);
    }
});



var AccountItemView = Backbone.View.extend({
    template: _.template($('#account-item-tmpl').html()),
    initialize: function() {
    this.listenTo(this.collection, 'reset', this.render)
    },
    tagName: 'li',
    className: 'list-group-item',
    render: function() {
      var $el = $(this.el);
      $el.html(this.template(this.model.toJSON()));
      return this;
    }
})

var AccountsView = Backbone.View.extend({
    template: _.template($('#accounts-tmpl').html()),
    renderListItem: function(model) {
        var item = new AccountItemView({model: model});
        $('.js-accounts-list', this.$el).append(item.render().el);
    },
    render: function() {
        var self = this;
        this.$el.html(this.template());
        this.collection.each(function(account) {
                self.renderListItem(account);
        });
        return this;
    }
});

var accountsView = new AccountsView({
    collection: accountsCollection
});
console.log('rendering accounts');
$('#js-app').html(accountsView.render().el)
