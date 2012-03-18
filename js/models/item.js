YUI.add('todo-item', function(Y) {

    var LocalStorage = Y.ToDo.LocalStorage;

    var Item = Y.Base.create('item', Y.Model, [], {
	sync: LocalStorage('todo'),

	toggleDone: function() {
	    this.set('done', !this.get('done')).save();
	}
	
    }, {
	ATTRS: {
	    done: {value: false},

	    text: {value: ''}
	}
    });

    Y.namespace('ToDo').Item = Item;
    
}, '0.0.1', {
    requires: [
	'model',
	'todo-storage'
    ]
});