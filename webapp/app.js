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

     },
     error: function() {
        console.log('error loading accounts ', arguments);
    }
});

var MainLayout = Backbone.Marionette.LayoutView.extend({
    template: _.template($('#app-tmpl').html()),
    el: '#js-app',
    regions: {
        accounts: '#js-accounts',
        account: '#js-account',
        vms: '#js-vms',
        vm: '#js-vm'
    }
});

//  Accounts List column
var AccountItemView = Backbone.Marionette.ItemView.extend({
    template: _.template($('#account-item-tmpl').html()),
    initialize: function() {
    this.listenTo(this.collection, 'reset', this.render)
    },
    tagName: 'li',
    className: 'list-group-item',
})

var AccountsView = Backbone.Marionette.CompositeView.extend({
    template: _.template($('#accounts-tmpl').html()),
    childView: AccountItemView,
    childViewContainer: '.js-accounts-list'
});

// Account details colum
var ParamView = Backbone.Marionette.ItemView.extend({
    template: _.template($('#account-param-tmpl').html()),
    tagName: 'li',
    className: 'list-group-item',
})
var ParamsView = Backbone.Marionette.CollectionView.extend({
    template: _.template($('#accounts-tmpl').html()),
    tagName: 'ul',
    className: 'list-group',
    childView: ParamView
});

var AccountView = Backbone.Marionette.LayoutView.extend({
    template: _.template($('#account-tmpl').html()),
    credentials: null,
    regions: {
        paramList: '.js-account-param-list'
    },
    modelEvents: {
        'change': 'updateCredentials'
    },
    initialize: function() {
        this.credentials = new Backbone.Collection();
        this.updateCredentials();
    },
    onShow: function() {
        this.paramList.show(new ParamsView( {
            collection: this.credentials
        }))
    },
    updateCredentials: function() {
        var data = [];
        _.each(this.model.get('parameterized_credentials'), function(value, key) {
            data.push({'name': key, 'value': value});
        })
        this.credentials.reset(data);
    }
});
// var accountsView = new AccountsView({
//     collection: accountsCollection
// });


// var mainLayout,
//     accountView,
// var Router = Backbone.Router.extend({
//     routes: {
//         "accounts/:uuid": "viewAccount",
//         "*other": "viewAccounts"
//     },
//     viewAccount: function(accountId) {
//         this.viewAccounts();
//         var model = accountsCollection.findWhere({ uuid: accountId });
//         accountView = new AccountView({ model: model });
//         $('#js-account').html(accountView.render().el);
//     },
//     viewAccounts: function() {
//         $('#js-accounts').html(accountsView.render().el);
//         if(accountView) {
//             accountView.remove();
//         }
//     }
// });
// new Router();


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
    reset: true,
    success: function(collection) {

    },
    error: function() {
        console.log('error loading vms ', arguments);
    }
})

// VM List colum
var ParamView = Backbone.Marionette.ItemView.extend({
    template: _.template($('#vm-param-tmpl').html()),
    tagName: 'li',
    className: 'list-group-item',
})
var ParamsView = Backbone.Marionette.CollectionView.extend({
    template: _.template($('#vms-tmpl').html()),
    tagName: 'ul',
    className: 'list-group',
    childView: ParamView
});
var VmItemView = Backbone.Marionette.ItemView.extend({
    template: _.template($('#vm-item-tmpl').html()),
    tagName: 'li',
    className: 'list-group-item',
    initialize: function(){
        console.log(this.model);
    }
})

var VmsView = Backbone.Marionette.CompositeView.extend({
    template: _.template($('#vms-tmpl').html()),
    childView: VmItemView,
    childViewContainer: '.js-vms-list'
});

// VM details colum
var VmView = Backbone.Marionette.LayoutView.extend({
    template: _.template($('#vm-tmpl').html()),
    credentials: null,
    regions: {
        paramList: '.js-vm-param-list'
    },
    modelEvents: {
        'change': 'updateCredentials'
    },
    initialize: function() {
        this.credentials = new Backbone.Collection();
        this.updateCredentials();
    },
    onShow: function() {
        this.paramList.show(new ParamsView( {
            collection: this.credentials
        }))
    },
    updateCredentials: function() {
        var data = [];
        _.each(this.model.get('extra'), function(value, key) {
            data.push({'name': key, 'value': value});
        })
        this.credentials.reset(data);
    }
});


// var vmsView = new VmsView({
//     collection: vmsCollection
// });


// var vmView;


var App = new Backbone.Marionette.Application({
    accountsView: null,
    vmsView: null,
    vmView: null,
    mainLayout: null,
    accountsCollection: null,
    vmsCollection: null,
    onBeforeStart: function() {
        this.router = new Marionette.AppRouter({
            appRoutes: {
                "accounts/:uuid/vms/:vmuuid": "viewAccountVM",
                "accounts/:uuid": "viewAccount",
                "*other": "viewAccounts"
            },
            controller: this
        });
    },
    onStart: function() {
        this.createCollections();
        this.createViews();
    },
    createCollections: function() {
        var self = this;
        this.accountsCollection = new AccountCollection();
        this.vmsCollection = new VmCollection();
        this.accountsCollection.fetch({
            reset: true,
            success: function(collection) {
                self.vmsCollection.fetch({
                    reset: true,
                    success: function(collection) {
                        console.log('loaded vms ', collection);
                        Backbone.history.start();
                    },
                    error: function() {
                        console.log('error loading accounts ', arguments);
                    }
                });
            },
            error: function() {
                console.log('error loading accounts ', arguments);
            }
        });
    },
    createViews: function() {
        this.accountsView = new AccountsView({
            collection: this.accountsCollection
        });
        this.mainLayout = new MainLayout();
        this.mainLayout.render();
    },
    viewAccountVM: function(accountId, vmId) {
        this.viewAccount(accountId);

        console.log('viewVm');

        var model = vmsCollection.findWhere({ uuid: vmId });
        this.vmView = new VmView({ model: model });
        this.mainLayout.vm.show(this.vmView);
        // vmView = new VmView({ model: model });
        // $('#js-vm').html(vmView.render().el);
    },
    viewAccount: function(accountId) {
        this.viewAccounts();
        var model = this.accountsCollection.findWhere({ uuid: accountId }),
            collection = new VmCollection(this.vmsCollection.where({ account_uuid: accountId }));
        this.accountView = new AccountView({ model: model });
        this.mainLayout.account.show(this.accountView);
        vmsView = new VmsView({ collection: collection });
        $('#js-vms').html(vmsView.render().el);
    },
    viewAccounts: function() {
        this.mainLayout.accounts.show(this.accountsView);
        if(this.accountView) {
            this.accountView.remove();
        }
        if(this.vmsView) {
            this.vmsView.remove();
        }
        if(this.vmView) {
            this.vmView.remove();
        }
    }
});
App.start();


