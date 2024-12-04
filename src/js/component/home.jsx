import React, { useState, useEffect } from 'react';

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Cargar tareas desde la API
  useEffect(() => {
    fetch('https://playground.4geeks.com/todo/users/dernestolpz')
      .then(resp => resp.json())
      .then(respJson => {
        console.log(respJson);
        const serverTodos = respJson.todos;
        setTodos(serverTodos);
      });
  }, []);

  // Crear una nueva tarea
  const createTodo = async (task) => {
    const response = await fetch('https://playground.4geeks.com/todo/todos/dernestolpz', {
      method: 'POST',
      body: JSON.stringify({
        "label": task,
        "is_done": false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const newTodo = await response.json();
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  // Manejar la acción de presionar "Enter"
  const handleOnChange = (evt) => {
    if (evt.key === 'Enter' && evt.target.value.trim() !== '') {
      createTodo(evt.target.value);
      setInputValue('');
    }
  };

  // Eliminar una tarea específica
  const handleOnDelete = async (id, deleteIndex) => {
    // Verificar que el ID es correcto
    console.log('Eliminando tarea con ID:', id);

    const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: 'DELETE', // Asegúrate de que el método sea DELETE
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      // Si la tarea se eliminó correctamente, actualizar el estado en el frontend
      const newTodos = todos.filter((_, index) => index !== deleteIndex);
      setTodos(newTodos);
    } else {
      const errorResponse = await response.json();
      console.error('Error al eliminar la tarea en el servidor:', errorResponse);
    }
  };

  

  return (
    <div className='container'>
      <div className='todos p-2'>
        <div className='input-group input-group-sm mb-3 py-3 px-5'>
          <input
            value={inputValue}
            type='text'
            className='form-control'
            onChange={evt => setInputValue(evt.target.value)}
            onKeyDown={handleOnChange}
            placeholder='Nueva tarea'
          />
        </div>
        <div className='container text-center px-5'>
          <div className='row row-cols-2'>
            {todos.map((item, index) => (
              <div className='col' key={item.id}>
                <div className='todoCard'>
                  {item.label}
                  <i
                    className='fa fa-trash ms-4'
                    onClick={() => handleOnDelete(item.id, index)} // Se pasa el id para eliminar de la API
                  ></i>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Home;
