;(function (window, document, undefined) {
	'use strict';

	/**
	 * Create a unique ID for every todo item
	 * @returns {String} uuid todo item ID
	 */
	var uuid = function () {
		var i, random;
		var uuid = '';

		for (i = 0; i < 32; i++) {
			random = Math.random() * 16 | 0;
			if (i === 8 || i === 12 || i === 16 || i === 20) {
				uuid += '-';
			}
			uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
		}

		return uuid;
	};

	/**
	 * Load todos list from localStorage
	 */
	var loadTodos = function () {
		var todos = localStorage.getItem('todos');
		return (todos && JSON.parse(todos)) || [];
	};

	/**
	 * Save todos list to localStorage
	 * @param {Object} todos Todos list object
	 */
	var saveTodos = function (todos) {
		localStorage.setItem('todos', JSON.stringify(todos));
	};

	var app = new Reef('#app', {
		template: function (props) {
			var content = '';
			content +=
				'<form>' +
					'<input type="text" id="new-todo">' +
					'<button type="submit" data-action="add-todo">Add</button>' +
				'</form>' +
				'<ul id="todo-list"></ul>';

			return content;
		},
	}).render();

	var todoList = new Reef('#todo-list', {
		data: {
			todos: [
				{
					id: 'testing-123',
					title: 'Testing 123',
					completed: true,
				},
			],
		},
		template: function (props) {
			var content = '';

			props.todos.forEach(function (todo) {
				var todoClasses = todo.completed ? 'todo-item completed' : 'todo-item';
				var checked = todo.completed ? 'checked="true"' : '';
				content +=
					'<li id="' + todo.id + '" class="' + todoClasses + '">' +
						'<label><input type="checkbox" ' + checked + '>' + todo.title + '</label>' +
						'<button data-action="edit-todo">Edit</button>' +
						'<button data-action="delete-todo">Delete</button>' +
					'</li>';
			});

			return content;
		},
	}).render();

})(window, document);
