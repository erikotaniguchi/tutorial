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
    success: function(collection) {
        console.log('loaded accounts ', collection);
    },
    error: function() {
        console.log('error loading accounts ', arguments);
    }
})
