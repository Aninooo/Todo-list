import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState("");

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleAddTodo = () => {
    if (inputText.trim() !== "") {
      setTodos([
        ...todos,
        { id: Date.now(), text: inputText, completed: false },
      ]);
      setInputText("");
    }
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleEditTodo = (id, newText) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-gray-100 p-4 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="flex mb-4">
        <input
          type="text"
          className="flex-1 border border-gray-300 p-2 mr-2"
          placeholder="Enter a new todo"
          value={inputText}
          onChange={handleInputChange}
        />
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={handleAddTodo}
        >
          Add Todo
        </button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        {todos.length > 0 && (
          <Droppable droppableId="todos">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="bg-white rounded-lg shadow-md divide-y divide-gray-300"
              >
                {todos.map((todo, index) => (
                  <Draggable
                    key={todo.id}
                    draggableId={todo.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-4 hover:bg-gray-50 ${
                          todo.completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        <span>{todo.text}</span>
                        <button
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteTodo(todo.id)}
                        >
                          Delete
                        </button>
                        <button
                          className={`text-blue-500 hover:text-blue-600 ml-2 ${
                            todo.completed ? "text-red-500" : "text-green-500"
                          }`}
                          onClick={() => handleToggleTodo(todo.id)}
                        >
                          {todo.completed
                            ? "Mark as Incomplete"
                            : "Mark as Complete"}
                        </button>
                        <button
                          className="text-green-500 hover:text-green-600 ml-2"
                          onClick={() => {
                            const newText = prompt("Edit Todo", todo.text);
                            if (newText !== null) {
                              handleEditTodo(todo.id, newText);
                            }
                          }}
                        >
                          Edit
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        )}
      </DragDropContext>
    </div>
  );
};

function App() {
  return (
    <div className="App min-h-screen flex justify-center items-center bg-gray-200">
      <TodoList />
    </div>
  );
}

export default App;
