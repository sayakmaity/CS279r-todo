window.addEventListener('load', () => {
	/* This is the code that is run when the page loads. It gets the todos from local storage and puts them
	in todos. It also gets the name input and the new todo form. */
	todos = JSON.parse(localStorage.getItem('todos')) || [];
	const nameInput = document.querySelector('#name');
	const newTodoForm = document.querySelector('#new-todo-form');

	/* Getting the username from local storage and if it doesn't exist, it sets it to an empty string. */
	const username = localStorage.getItem('username') || '';

	nameInput.value = username;

	/* Listening for a change in the name input and then it sets the username in local storage to the value
	of the input. */
	nameInput.addEventListener('change', (e) => {
		localStorage.setItem('username', e.target.value);
	})

	/* Listening for a submit event on the new todo form */
	newTodoForm.addEventListener('submit', e => {
		e.preventDefault();

		/* Creating a new todo with the content and category from the form and setting done
		to false and createdAt to the current time. */
		const todo = {
			content: e.target.elements.content.value,
			category: e.target.elements.category.value,
			done: false,
			createdAt: new Date().getTime()
		}

		/* Adding todo to the todos array. */
		todos.push(todo);

		/* Setting the todos in local storage to the todos variable. */
		localStorage.setItem('todos', JSON.stringify(todos));


		e.target.reset();

		DisplayTodos()
	})

	DisplayTodos()
})

/* Creating the elements that will be used to display the todos and then appending them to the todo
list. */
function DisplayTodos() {
	/* Getting the todo-list. */
	const todoList = document.querySelector('#todo-list');
	todoList.innerHTML = "";

	/* Looping through the todos array */
	todos.forEach(todo => {
		const todoItem = document.createElement('div');
		todoItem.classList.add('todo-item');

		/* Creating the elements that will be used to display the todos. */
		const label = document.createElement('label');
		const input = document.createElement('input');
		const span = document.createElement('span');
		const content = document.createElement('div');
		const actions = document.createElement('div');
		const edit = document.createElement('button');
		const deleteButton = document.createElement('button');

		input.type = 'checkbox';
		input.checked = todo.done;
		span.classList.add('bubble');
		if (todo.category == 'personal') {
			span.classList.add('personal');
		} else {
			span.classList.add('business');
		}
		content.classList.add('todo-content');
		actions.classList.add('actions');
		edit.classList.add('edit');
		deleteButton.classList.add('delete');

		content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
		edit.innerHTML = 'Edit';
		deleteButton.innerHTML = 'Delete';


		label.appendChild(input);
		label.appendChild(span);
		actions.appendChild(edit);
		actions.appendChild(deleteButton);
		todoItem.appendChild(label);
		todoItem.appendChild(content);
		todoItem.appendChild(actions);

		todoList.appendChild(todoItem);

		/* Checking if the todo is done and if it is, designating it for the done group */
		if (todo.done) {
			todoItem.classList.add('done');
		}

		input.addEventListener('change', (e) => {
			todo.done = e.target.checked;
			localStorage.setItem('todos', JSON.stringify(todos));

			/* Checking if the todo is done and if it is, it marks it as done. If it isn't, it is no longer marked as done. */
			if (todo.done) {
				todoItem.classList.add('done');
			} else {
				todoItem.classList.remove('done');
			}

			DisplayTodos()

		})

		/* Stops the todo from being readonly when the edit button is clicked. */

		edit.addEventListener('click', (e) => {
			const input = content.querySelector('input');
			input.removeAttribute('readonly');
			input.focus();

			input.addEventListener('blur', (e) => {
				/* Makes the task readonly again, after editing is done */
				input.setAttribute('readonly', true);
				todo.content = e.target.value;
				localStorage.setItem('todos', JSON.stringify(todos));
				DisplayTodos()

			})
		})

		/* Deleting the todo from the todos array */
		deleteButton.addEventListener('click', (e) => {
			todos = todos.filter(t => t != todo);
			localStorage.setItem('todos', JSON.stringify(todos));
			DisplayTodos()
		})

	})
}