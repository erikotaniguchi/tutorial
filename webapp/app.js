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
var VmItemView = Backbone.View.extend({
    template: _.template($('#vm-item-tmpl').html()),
    tagName: 'li',
    className: 'list-group-item',
    render: function() {
      var $el = $(this.el);
      $el.html(this.template(this.model.toJSON()));
      return this;
    }
})

var VmsView = Backbone.View.extend({
    template: _.template($('#vms-tmpl').html()),
    initialize: function() {
    this.listenTo(this.collection, 'reset', this.render)
    },
    renderListItem: function(model) {
        var item = new VmItemView({model: model});
        $('.js-vms-list', this.$el).append(item.render().el);
    },
    render: function() {
        var self = this;
        this.$el.html(this.template());
        this.collection.each(function(vm) {
                self.renderListItem(vm);
        });
        return this;
    }
});

// VM details colum

var VmView = Backbone.View.extend({
    template: _.template($('#vm-tmpl').html()),
    credentialTemplate: _.template($('#vm-param-tmpl').html()),
    renderParam: function(key, value) {
        var $el = $('.js-vm-param-list', this.$el);
        $el.append(this.credentialTemplate({key:key, value:value}));
    },
    render: function(options) {
        var self = this,
            model = this.model.toJSON();
        $(this.el).html(this.template(model));
        _.each(model.extra, function(value, key) {
            self.renderParam(key, value);
        });
        return this;
    }
});

var vmsView = new VmsView({
    collection: vmsCollection
});


var vmView;


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
                //"accounts/:uuid/vms/:vmuuid": "viewAccountVM",
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
        var model = vmsCollection.findWhere({ uuid: vmId });
        vmView = new VMView({ model: model });
        $('#js-vm').html(vmView.render().el);
    },
    viewAccount: function(accountId) {
        this.viewAccounts();
        var model = this.accountsCollection.findWhere({ uuid: accountId }),
            collection = new VmCollection(this.vmsCollection.where({ account_uuid: accountId }));
        this.accountView = new AccountView({ model: model });
        this.mainLayout.account.show(this.accountView);
        //vmsView = new VMsView({ collection: collection });
        //$('#js-vms').html(vmsView.render().el);
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


// Routing
/*var Router = Backbone.Router.extend({
    routes: {
        //"accounts/:uuid/vms/:vmuuid": "viewVM",
        "accounts/:uuid": "viewAccount",
        "*other": "viewAccounts"
    },

    viewVm: function(accountId, vmId) {
        // console.log('viewVm');

        this.viewAccount(accountId);

        var model = vmsCollection.findWhere({ uuid: vmId });
        vmView = new VmView({ model: model });
        $('#js-vm').html(vmView.render().el);

    },


    viewAccount: function(accountId) {

        this.viewAccounts();

        var model = accountsCollection.findWhere({ uuid: accountId });
        accountView = new AccountView({ model: model });
        mainLayout.account.show(accountView);


// Show third column here
        // var model = vmsCollection.findWhere({ account_uuid: accountId });
        // vmView = new VmsView({ model: model });
        //  $('#js-vms').html(vmsView.render().el);
        //  if(vmView) {
        //     vmView.remove();
        // }
    },



    viewAccounts: function() {
        mainLayout.accounts.show(accountsView);
        if(accountView) {
            accountView.remove();
        }
    }
});
new Router();
*/
