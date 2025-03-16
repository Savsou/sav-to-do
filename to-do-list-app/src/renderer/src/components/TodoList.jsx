import { useState, useEffect } from "react";

export default function TodoList() {
    const [todoList, setTodoList] = useState({});
    const [newTodo, setNewTodo] = useState("");
    //keep track of what To-Do category list we are looking at
    const [currentCategory, setCurrentCategory] = useState("To-Do List");
    //add new category list
    const [newCategory, setNewCategory] = useState("");
    const [editTodoId, setEditTodoId] = useState(null);
    const [editTodoText, setEditTodoText] = useState("");

    useEffect(() => {
        //Load todos with loadTodos in preload api when the component mounts
        //this way is for asynchronous action and storing the loaded todos into state
        const loadTodos = async () => {
            const savedTodos = await window.api.loadTodos();
            //if no saved To-Do's at all, have a default To-Do List object
            setTodoList(savedTodos || { "To-Do List": [] });
        }

        loadTodos()
    }, []);

    useEffect(() => {
        //Save todos whenever the todos state changes with saveTodos from preload api
        //This should save when a new todo is added to a category, a todo is edited within a category, and if a new category is added to the todo list.
        if (Object.keys(todoList).length > 0) {
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
            //add todo to the currentCategory the user is looking at.
            category: currentCategory,
        };

        const updatedTodos = {
            //spread the whole todoList to keep all information of other categories
            ...todoList,
            //go into the category that's being updated and added to and spread all the previous todo's, if empty then make sure it's an array
            //add newTodoItem after
            [currentCategory]: [...(todoList[currentCategory] || []), newTodoItem]
        };

        setTodoList(updatedTodos)
        setNewTodo("");
    };

    const deleteTodo = (id) => {
        //go into the todoList object and remove from the category that the user is current looking at for the todo that's being removed
        const updatedTodoList = {
            ...todoList,
            [currentCategory]: todoList[currentCategory].filter((todo) => todo.id !== id),
        };

        setTodoList(updatedTodoList);
    }

    const startEditTodo = (id, text) => {
        setEditTodoId(id);
        setEditTodoText(text);
    }

    const saveEditTodo = (id) => {
        const updatedTodo = {
            ...todoList,
            [currentCategory]: todoList[currentCategory].map((todo) => todo.id === id ? { ...todo, text: editTodoText } : todo)
        };

        setTodoList(updatedTodo)
        setEditTodoId(null);
        setEditTodoText("");
    }

    const cancelEditTodo = () => {
        setEditTodoId(null);
        setEditTodoText("");
    }

    //adding the category functions
    const addCategory = () => {
        //if user tries to add a new category that's empty or already exists, don't do anything
        if (newCategory.trim() === "" || todoList[newCategory]) return;

        const updatedTodoList = {
            ...todoList,
            [newCategory]: [],
        }

        setTodoList(updatedTodoList);
        setCurrentCategory(newCategory);
        setNewCategory("");
    }

    return (
        <div className="flex">
            {/* Left Sidebar for Categories */}
            <div className="w-1/4 p-4 bg-gray-100">
                <h2 className="text-xl font-bold mb-4">Categories</h2>
                <ul>
                    {Object.keys(todoList).map((cat) => (
                        <li
                            key={cat}
                            onClick={() => setCurrentCategory(cat)} // Updated to use setCurrentCategory
                            className={`cursor-pointer p-2 mb-2 ${currentCategory === cat ? "bg-blue-300" : "bg-blue-100"
                                }`}
                        >
                            {cat}
                        </li>
                    ))}
                </ul>

                {/* Add New Category */}
                <div className="flex gap-2 mt-4">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New Category"
                        className="p-2 border rounded"
                    />
                    <button onClick={addCategory} className="bg-blue-200 p-2 rounded">
                        Add Category
                    </button>
                </div>
            </div>

            {/* Right Content Area for Tasks */}
            <div className="w-3/4 p-4">
                <h2 className="text-xl font-bold mb-4">{currentCategory} Tasks</h2>

                {/* Display todos based on selected category */}
                <ul className="bg-red-400">
                    {todoList[currentCategory]?.map((todo) => (
                        <li className="flex justify-between my-3 items-center px-3" key={todo.id}>
                            {editTodoId === todo.id ? (
                                <input
                                    type="text"
                                    value={editTodoText}
                                    onChange={(e) => setEditTodoText(e.target.value)}
                                    className="border rounded p-1 w-full mr-2"
                                />
                            ) : (
                                <span className="break-words truncate w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-2xl">
                                    {todo.text}
                                </span>
                            )}

                            <div className="flex gap-2">
                                {editTodoId === todo.id ? (
                                    <>
                                        <button className="bg-green-200" onClick={() => saveEditTodo(todo.id)}>
                                            Save
                                        </button>
                                        <button className="bg-red-300" onClick={cancelEditTodo}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button className="edit-button" onClick={() => startEditTodo(todo.id, todo.text)}>
                                        Edit
                                    </button>
                                )}
                                <button className="delete-button" onClick={() => deleteTodo(todo.id)}>
                                    X
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Input for new todo */}
                <div className="flex justify-between h-12 gap-4">
                    <input
                        className="bg-gray-200 w-full px-4"
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Enter New Task"
                    />
                    <button
                        className="add-task-button rounded-3xl border border-blue-500 p-1 w-28 bg-gray-100"
                        onClick={addTodo}
                    >
                        Add Task
                    </button>
                </div>
            </div>
        </div>
    );
}
