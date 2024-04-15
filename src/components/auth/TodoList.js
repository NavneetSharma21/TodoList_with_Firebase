import React, { useEffect, useState } from "react";
import { useFirebase } from "./firebase";
import ToDo from "./Todo";
import Priority from "./Priority-sec";

const ToDoList = () => {
    const [newListTitle, setNewListTitle] = useState('');
    const [lists, setLists] = useState([]);
    const Firebase = useFirebase();

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const fetched = await Firebase.getTodoInStore(
                    Firebase.loggedInUser()?.uid)
                setLists(fetched || [])
            }
            catch (error) {
                console.log('Todo not found', error.message)
            }
        }
        fetchLists();
    }, [Firebase])

    const addLists = async () => {
        if (newListTitle.trim() !== '') {
            try {
                await Firebase.addTodoInStore(
                    Firebase.loggedInUser()?.uid,
                    newListTitle);
                setNewListTitle("");
                const updatedLists = await Firebase.getTodoInStore(Firebase.loggedInUser()?.uid);
                setLists(updatedLists || []);
            }
            catch (error) {
                console.error(error.message);
            }
        }
    }
    return (
        <>
            <div className="main-page">
                <div className="add-list-sec">
                    <div className="add-list">
                        <input
                            type="text"
                            placeholder="Add new ToDo list"
                            value={newListTitle}
                            onChange={(e) => setNewListTitle(e.target.value)}
                        />
                        <button onClick={addLists} >Add List</button>
                    </div>
                    <button onClick={(e) => {
                        e.preventDefault();
                        Firebase.handleSignOut();
                    }}>Log Out</button>
                </div>
                <div className="Priority-section">
                    <Priority title="Low Priority" Priority="low"/>
                    <Priority title="Medium Priority" Priority="medium"/>
                    <Priority title="High Priority" Priority="high"/>
                </div>

                <div className="show-todo">
                    {lists.map((list, index) => (
                        <ToDo key={index} ListName={list}></ToDo>
                    ))}
                </div>
            </div>
        </>
    )
}

export default ToDoList;