import React from "react";
import { useFirebase } from "./firebase";
const Task = (props) => {

    const Firebase = useFirebase();
    return (
        <div className="tasks"
           draggable
           onDragStart={(e)=>{Firebase.handleDragStart(e, props)  
           }}>
                <div className="task-head">
                    <p>Title:-<b>{props.TaskTitle}</b></p>
                    <p>Priority:-<b> {props.TaskPriority}</b> </p>
                </div>
                <p>Description:-{props.TaskDescription}</p>
                <p>Due Date:-<b>{props.TaskDueDate}</b> </p>      
        </div>
    )
}
export default Task;