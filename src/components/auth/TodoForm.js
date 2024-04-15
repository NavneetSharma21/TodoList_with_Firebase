import React, { useState } from "react";
import { useFirebase } from "./firebase";

const TodoForm = (props) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [priority, setPriority] = useState('')
    const Firebase = useFirebase();

    const handleTaskSubmit = async () => {
        try {
            const loggedId = Firebase.loggedInUser()?.uid;
            const taskTitle = title;
            const taskDescription = description;
            const taskDueDate = dueDate;
            const taskPriority = priority;
            if (!loggedId) {
                console.log('user not exist')
            }
            await Firebase.addTasksInTodo(loggedId, taskTitle, taskDescription, taskDueDate, taskPriority, props?.ListName)
            props.updateTasks();
            console.log("Successfully added task")
            setTitle('');
            setDescription('');
            setDueDate('');
            setPriority('');
        }
        catch (error) {
            console.log("error for Creation tasks", error.message)
        }
    }
    return (
        <div className="Todo-form" >
            <h1>Add new Todo</h1>
            <input type="text"
                placeholder="fill todo's title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}>
            </input>
            <input type="text"
                placeholder="fill todo's description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}>
            </input>
            <input type="text"
                placeholder="fill todo's due date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}>
            </input>
            <select className="select" value={priority}
                onChange={(e) => setPriority(e.target.value)}>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
            </select>
            <button type="submit" onClick={handleTaskSubmit}>Add task</button>
            <button onClick={props.toggleForm}>Close</button>
        </div>
    )
}
export default TodoForm;