YUI().add('todo-item-view', function(Y) {
    var ItemView = Y.Base.create('itemView', Y.View, [], {
	container: '<li class="todo-item" />',

	template: Y.one('#todo-item-template').getContent(),

	events: {
	    '.todo-checkbox': {
		click: 'toggleDone'
	    },

	    '.todo-content': {
		click: 'edit',
		focus: 'edit'
	    },

	    '.todo-input': {
		blur: 'save',
		keypress: 'enter'
	    },

	    '.todo-remove': {
		click: 'remove'
	    }
	},

	initializer: function() {
	    var model = this.model;

	    model.after('change', this.render, this);
	    model.after('destroy', this.destroy, this);
	},

	render: function() {
	    var container = this.container;
	    var model = this.model;
	    var done = model.get('done');

	    container.setContent(Y.Lang.sub(this.template, {
		checked: done ? 'checked' : '',
		text: model.getAsHTML('text')
	    }));

	    container[done ? 'addClass' : 'removeClass']('todo-done');
	    this.inputNode = container.one('.todo-input');

	    return this;
	},

	edit: function() {
	    this.container.addClass('editing');
	    this.inputNode.focus();
	},

	enter: function(e) {
	    if (e.keyCode === 13) {
		Y.one('#new-todo').focus();
	    }
	},

	remove: function(e) {
	    e.preventDefault();

	    this.constructor.superclass.remove.call(this);
	    this.model.destroy({'delete': true});
	},

	save: function() {
	    this.container.removeClass('editing');
	    this.model.set('text', this.inputNode.get('value')).save();
	},

	toggleDone: function() {
	    this.model.toggleDone();
	}
    });

    Y.namespace('ToDo').ItemView = ItemView;
}, '0.0.1', {
    requires: [
	'view',
	'event-focus'
    ]
});