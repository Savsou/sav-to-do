import { useState, useEffect } from "react";

export default function TodoList() {
    const [todoList, setTodoList] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [editTodoId, setEditTodoId] = useState(null);
    const [editTodoText, setEditTodoText] = useState("");

    useEffect(() => {
        //Load todos with loadTodos in preload api when the component mounts
        //this way is for asynchronous action and storing the loaded todos into state
        const loadTodos = async () => {
            const savedTodos = await window.api.loadTodos();
            setTodoList(savedTodos)
        }

        loadTodos()
    }, []);

    useEffect(() => {
        //Save todos whenever the todos state changes with saveTodos from preload api
        if (todoList.length > 0) {
            window.api.saveTodos(todoList)
        }
    }, [todoList])

    //functions for adding, editing and removing todos
    const addTodo = () => {
        if (newTodo.trim() === "") {
            return;
        }

        const newTodoItem = {
            id: Date.now(),
            text: newTodo,
            completed: false,
        };
        const updatedTodos = [...todoList, newTodoItem]
        setTodoList(updatedTodos)

        setNewTodo("");
    };

    const deleteTodo = (id) => {
        const updatedTodoList = todoList.filter((todo) => todo.id !== id);
        setTodoList(updatedTodoList);
    }

    const startEditTodo = (id, text) => {
        setEditTodoId(id);
        setEditTodoText(text);
    }

    const saveEditTodo = (id) => {
        const updatedTodo = todoList.map((todo) => todo.id === id ? { ...todo, text: editTodoText } : todo);
        setTodoList(updatedTodo)
        setEditTodoId(null);
        setEditTodoText("");
    }

    const cancelEditTodo = () => {
        setEditTodoId(null);
        setEditTodoText("");
    }

    return (
        <div className="bg-red-200 p-5">
            <h1 className="text-2xl font-bold px-1 underline">To Do List</h1>
            <ul>
                {todoList.map((todo) => (
                    <li className="flex justify-between my-3 items-center" key={todo.id}>
                        {editTodoId === todo.id ? (
                            <input
                                type="text"
                                value={editTodoText}
                                onChange={(e) => setEditTodoText(e.target.value)}
                                className="border rounded p-1 w-full mr-2"
                            />
                        ) : (
                            <span className="break-words truncate w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-2xl">{todo.text}</span>
                        )}

                        <div className="flex gap-2">
                            {editTodoId === todo.id ? (
                                <>
                                    <button className="bg-green-200" onClick={() => saveEditTodo(todo.id)}>Save</button>
                                    <button className="bg-red-300" onClick={() => cancelEditTodo()}>Cancel</button>
                                </>
                            ) : (
                                <button className="bg-blue-200" onClick={() => startEditTodo(todo.id, todo.text)}>Edit</button>
                            )}
                            <button className="bg-gray-100" onClick={() => deleteTodo(todo.id)}>X</button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="flex justify-between h-12">
                <input
                    className="bg-gray-200 w-full"
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Enter New Task"
                />
                <button className="rounded-xl border border-red-500 p-1 w-28" onClick={addTodo}>Add Task</button>
            </div>
        </div>
    )
}
