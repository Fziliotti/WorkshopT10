const listElement = document.querySelector('#app ul');
const inputElement = document.querySelector('#app input');
const btnElement = document.querySelector('#app button');
const todos = JSON.parse(localStorage.getItem('lista_tarefas')) || [];
const render = document.querySelector('#render');

function saveToStorage() {
	localStorage.setItem('lista_tarefas', JSON.stringify(todos));
}

function renderTodos() {
	render.innerHTML = ''
	for (todo of todos) {
		var positionTodo = todos.indexOf(todo)
		var textoTodo = todo.texto
		var corTodo = todo.cor
		render.innerHTML += `
			<li class="todo-item my-4 list-group-item" ondblclick="concluirTodo(${positionTodo})" style="background-color: ${corTodo}"> ${textoTodo}
				<div class="buttonBox">
						<button class="btn btn-danger ml-2 float-right" onclick="deleteTodo(${positionTodo})"><i class="fas fa-minus"></i></button>
				</div>
			</li>
		`
	}
}


// LISTENERS
inputElement.addEventListener('keyup', e => {
	let key = e.which || e.keyCode;
	if (key == 13) {
		addTodo();
	}
});



function addTodo() {
	const todoText = inputElement.value;
	if (todoText.trim()) {
		swal({
			position: 'top-end',
			type: 'success',
			title: 'Inserido com sucesso!',
			showConfirmButton: false,
			timer: 1000
		})

		
		var todoCor = '#3eb3be';
		var newTodo = {
			texto: todoText,
			cor: todoCor,
			concluido: false,
			dataCriacao: new Date(),
			dataModificacao: new Date()
		};

		todos.push(newTodo);
		inputElement.value = '';
		renderTodos();
		saveToStorage();
	} else {
		swal({
			position: 'top-end',
			type: 'error',
			title: 'Digite alguma coisa no campo de texto',
			showConfirmButton: false,
			timer: 1000
		})
		todoText.focus();
	}
};


function concluirTodo(indexTodo) {
	if (!todos[indexTodo].concluido) {
		todos[indexTodo].cor = "#FFA500"
		todos[indexTodo].concluido = true
		todos[indexTodo].dataModificacao = new Date();
		swal({
			position: 'top-end',
			type: 'success',
			title: 'Todo Concluido!',
			showConfirmButton: false,
			timer: 1000
		})
	} else {
		todos[indexTodo].cor = "#17BBB8"
		todos[indexTodo].concluido = false
		todos[indexTodo].dataModificacao = new Date();
		swal({
			position: 'top-end',
			type: 'warning',
			title: 'Todo ainda não concluído!',
			showConfirmButton: false,
			timer: 1000
		})
	}

	renderTodos();
	saveToStorage();
}


function deleteTodo(pos) {
	const swalWithBootstrapButtons = swal.mixin({
		confirmButtonClass: 'btn btn-success',
		cancelButtonClass: 'btn btn-danger',
		buttonsStyling: false,
	})

	swalWithBootstrapButtons({
		title: 'Tem certeza disso?',
		text: "Não poderá ser revertido depois!",
		type: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Simm',
		cancelButtonText: 'Cancelar',
		reverseButtons: true
	}).then((result) => {
		if (result.value) {
			swalWithBootstrapButtons(
				'Deletado!',
				'Sua tarefa já era!',
				'success'
			)
			todos.splice(pos, 1);
			renderTodos();
			saveToStorage();

		} else if (
			// Read more about handling dismissals
			result.dismiss === swal.DismissReason.cancel
		) {
			swalWithBootstrapButtons(
				'Cancelado',
				'Sua tarefa tá sussa! :)',
				'error'
			)
		}
	})
}

// Ja renderizar as tarefas quando esse arquivo for processado
(() => {
	renderTodos();
})();