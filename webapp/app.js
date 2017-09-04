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
// var Router = Backbone.Router.extend({
//     routes: {
//         "vms/:uuid": "viewVm",
//         "*other": "viewVms"
//     },
//     viewVm: function(vmId) {
//         this.viewVms();
//         var model = vmsCollection.findWhere({ uuid: vmId });
//         vmView = new VmView({ model: model });
//         $('#js-vm').html(vmView.render().el);
//     },
//     viewVms: function() {
//         $('#js-vms').html(vmsView.render().el);
//         if(vmView) {
//             vmView.remove();
//         }
//     }
// });
// new Router();

var Router = Backbone.Router.extend({
    routes: {
        "accounts/:uuid/vms/:vmuuid": "viewVms",
        "accounts/:uuid": "viewAccount",
        "*other": "viewAccounts"
    },
    viewVm: function(vmId) {
        console.log('viewVm');
        // this.viewVms();
        // var model = vmsCollection.findWhere({ uuid: vmId });
        // vmView = new VmView({ model: model });
        // $('#js-vm').html(vmView.render().el);
        this.viewVms();

        var model = vmsCollection.findWhere({ uuid: vmId });
        vmView = new VmView({ model: model });
        $('#js-vm').html(vmView.render().el);
    },
    viewAccount: function(accountId) {

        this.viewAccounts();

        var model = accountsCollection.findWhere({ uuid: accountId });
        accountView = new AccountView({ model: model });
        $('#js-account').html(accountView.render().el);

    var filteredCollection = this.vmsCollection.where({ account_uuid: accountId });
        this.vmListView = new VirtualMachineListView({ collection: filteredCollection });
        this.mainLayout.vms.show(this.vmListView);
    },

        // Show third column here
    },
    viewAccounts: function() {
        $('#js-accounts').html(accountsView.render().el);
        if(accountView) {
            accountView.remove();
        }
    }
});
new Router();

<<<<<<< HEAD
// var Router = Backbone.Router.extend({
//     routes: {
//         "vms/:uuid/vm/:uuid": "viewAccount",
//         "vms/:uuid/vm": "viewAccounts",
//         "vms/:uuid": "viewVm",
//         "*other": "viewVms"
//     },
//     viewAccount: function(accountId) {
//         this.viewAccounts();
//         var model = accountsCollection.findWhere({ uuid: accountId });
//         accountView = new AccountView({ model: model });
//         $('#js-account').html(accountView.render().el);
//     },
//     viewAccounts: function() {
//         $('#js-accounts').html(accountsView.render().el)
//         if(accountView) {
//             accountView.remove();
//         }
//     },
//     viewVm: function(vmId) {
//         this.viewVms();
//         var model = vmsCollection.findWhere({ uuid: vmId });
//         vmView = new VmView({ model: model });
//         $('#js-vm').html(vmView.render().el);
//     },
//     viewVms: function() {
//         $('#js-vms').html(vmsView.render().el);
//         if(vmView) {
//             vmView.remove();
// };
// new Router();
=======




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
        console.log('loaded vms ', collection);
    },
    error: function() {
        console.log('error loading vms ', arguments);
    }
})


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

var vmsView = new VmsView({
    collection: vmsCollection
});
console.log('rendering vms');
$('#js-app2').html(vmsView.render().el)

>>>>>>> origin
