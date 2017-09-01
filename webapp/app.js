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
        Backbone.history.start();
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


var AccountView = Backbone.View.extend({
    template: _.template($('#account-tmpl').html()),
    credentialTemplate: _.template($('#account-param-tmpl').html()),
    renderParam: function(key, value) {
        var $el = $('.js-account-param-list', this.$el);
        $el.append(this.credentialTemplate({key:key, value:value}));
    },
    render: function(options) {
        var self = this,
            model = this.model.toJSON();
        $(this.el).html(this.template(model));
        _.each(model.parameterized_credentials, function(value, key) {
            self.renderParam(key, value);
        });
        return this;
    }
});
var accountsView = new AccountsView({
    collection: accountsCollection
});


var accountView;
var Router = Backbone.Router.extend({
    routes: {
        "accounts/:uuid": "viewAccount",
        "*other": "viewAccounts"
    },
    viewAccount: function(accountId) {
        this.viewAccounts();
        var model = accountsCollection.findWhere({ uuid: accountId });
        accountView = new AccountView({ model: model });
        $('#js-account').html(accountView.render().el);
    },
    viewAccounts: function() {
        $('#js-accounts').html(accountsView.render().el);
        if(accountView) {
            accountView.remove();
        }
    }
});
new Router();





var VmModel = Backbone.Model.extend({});
var VmCollection = Backbone.Collection.extend({
    url: 'data/vms.json',
    model: VmModel,
    parse : function(resp) {
        //Because the server won't return a top-level JSON Array!
        return resp.vms;
    }
});
var vmsCollection = new VmCollection();
vmsCollection.fetch({
    success: function(collection) {
        console.log('loaded vms ', collection);
    },
    error: function() {
        console.log('error loading vms ', arguments);
    }
})



var VmsView = Backbone.View.extend({
    template: _.template($('#accounts-tmpl').html()),
    render: function() {
        this.$el.html(this.template());
        return this;
    }
});
var vmsView = new VmsView();
$('#js-app2').html(vmsView.render().el)
