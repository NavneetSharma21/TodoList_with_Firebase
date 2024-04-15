import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { addDoc, collection, getDocs, getFirestore, query, serverTimestamp, where, writeBatch, } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyCLh4M5iQ1WmwCToGnXW0pyEJcu1wfgAUc",
    authDomain: "to-dolist-dff44.firebaseapp.com",
    projectId: "to-dolist-dff44",
    storageBucket: "to-dolist-dff44.appspot.com",
    messagingSenderId: "837573270730",
    appId: "1:837573270730:web:7894f53ed82f2468356833",
    measurementId: "G-7PP75GNHJ4",
};

const FirebaseApp = initializeApp(firebaseConfig);
const Auth = getAuth(FirebaseApp);
const DbStore = getFirestore(FirebaseApp)

const FirebaseContext = createContext(null);

export const useFirebase = () => {
    return useContext(FirebaseContext);
}

export const FirebaseProvider = (props) => {

    const [user, setUser] = useState(null);
    const [dragTask, setDragTask] = useState("");

    useEffect(() => {
        const Authentication = onAuthStateChanged(Auth, (authUser, user) => {
            if (authUser === user) {
                setUser(authUser);
            } else {
                setUser(null);
            }
        });

        return () => Authentication();
    }, []);

    const handleSignUp = async (email, password) => {
        try {
            const userInfo = await createUserWithEmailAndPassword(Auth, email, password);
            if (userInfo) {
                UserInStore(userInfo.user);
                alert('User Signup Successful');
            }
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    }

    const handleLogin = async (email, password) => {
        try {
            const userInfo = await signInWithEmailAndPassword(Auth, email, password);
            if (userInfo) {
                setUser(userInfo.user)
                alert('User Logged-in Successful')
            }
        } catch (error) {
            alert(error)
            console.error(error.message);
        }
    }
    const loggedInUser = () => {
        return user;
    }


    const handleSignOut = async () => {
        try {
            await signOut(Auth);
            setUser(null);
        }
        catch (error) {
            console.error(error.message);
        }
    }

    const UserInStore = async (authUser) => {
        try {
            if (authUser && authUser.email && authUser.uid) {
                const userRef = collection(DbStore, "users");
                await addDoc(userRef, {
                    email: authUser.email,
                    uid: authUser.uid,
                    createdAt: serverTimestamp(),
                })
                console.log('user Store in FireStore')
                window.location.href = "https://todolist-with-firebase.onrender.com/login";
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    const addTodoInStore = async (authUser, todoTitle) => {
        if (!authUser || todoTitle === undefined) {
            return;
        }
        try {
            const userTodo = collection(DbStore, "TodoLists")
            await addDoc(userTodo, {
                userId: authUser,
                title: todoTitle,
                createdAt: serverTimestamp(),
            })
            console.log("ToDo created in DbStore")
            alert("ToDo created in DbStore")
        }
        catch (error) {
            console.error("todo not created", error.message);
        }
    }

    const getTodoInStore = async (authUser) => {
        if (!authUser) {
            console.log("No user to get todo")
            return;
        }
        try {
            const dataBase = collection(DbStore, "/TodoLists")
            const q = query(dataBase, where("userId", "==", authUser))
            const querySnapshot = await getDocs(q)
            const lists = querySnapshot.docs.map((doc) => doc.data().title)
            return lists;
        }
        catch (error) {
            console.error("todo not Found", error.message);
        }
    }

    const addTasksInTodo = async (authUser,
        taskTitle,
        taskDescription,
        taskDueDate,
        taskPriority,
        todoTitle
    ) => {
        try {
            const userTasks = collection(DbStore, "Tasks");
            await addDoc(userTasks, {
                userId: authUser,
                title: taskTitle,
                description: taskDescription,
                dueDate: taskDueDate,
                priority: taskPriority,
                todoList: todoTitle,
                createdAt: serverTimestamp(),
            })
            console.log("Task created in DbStore")
            alert("Task created in DbStore")
        } catch (error) {
            console.log(error.message)
        }
    }


    const getTasksFromStore = async (userId, todoList) => {
        if (!userId) {
            console.log("No user to get todo")
            return;
        }
        try {
            const dataBase = collection(DbStore, "Tasks")
            const q = query(dataBase, where("userId", "==", userId), where("todoList", "==", todoList))
            const querySnapshot = await getDocs(q)
            const lists = querySnapshot.docs.map((doc) => {
                const taskData = doc.data();
                return {
                    id: doc.id || "",
                    title: taskData.title || "",
                    description: taskData.description || "",
                    dueDate: taskData.dueDate || "",
                    priority: taskData.priority || "",
                    todoList: taskData.todoList || "",
                };
            }
            )
            return lists;
        }
        catch (error) {
            console.error("todo not Found", error.message);
        }
    }
    
    const updateAfterDragAndDrop = async (newTodoList) => {
        if (!dragTask) {
            console.error("data is not there");
            return;
          }
        try {
            const q = query(collection(DbStore, 'Tasks'));
            const querySnapshot = await getDocs(q);
            const batch = writeBatch(DbStore);
                   
            querySnapshot.forEach((doc) => {
                if (doc.id === dragTask.id) {
                    console.log(doc.id)
                    console.log(dragTask.id)
                    batch.update(doc.ref, { todoList: newTodoList });
                }
            });    
            await batch.commit();
            console.log("Firebase update success");
            setDragTask("")
            } catch (error) {
            console.error("Failed to update FireStore", error.message);
            throw error;
        }
    };

    
    const updatePriorityAfterDrag = async (newPriority) => {
        if (!dragTask) {
            console.error("data is not there");
            return;
          }
        try {
            const q = query(collection(DbStore, 'Tasks'));
            const querySnapshot = await getDocs(q);
            const batch = writeBatch(DbStore);
                   
            querySnapshot.forEach((doc) => {
                if (doc.id === dragTask.id) {
                    console.log(doc.id)
                    console.log(dragTask.id)
                    batch.update(doc.ref, { priority: newPriority });
                }
            });    
            await batch.commit();
            console.log("Firebase update success");
            setDragTask("")
            } catch (error) {
            console.error("Failed to update FireStore", error.message);
            throw error;
        }
    };
    
    const handleDragStart = (e, task) => {
        setDragTask(task)
      }
    
    useEffect(() => {}, [dragTask]);


    return (
        <FirebaseContext.Provider
            value={{
                handleSignUp,
                handleLogin,
                handleSignOut,
                loggedInUser,
                addTodoInStore,
                getTodoInStore,
                addTasksInTodo,
                getTasksFromStore,
                updateAfterDragAndDrop,
                handleDragStart,
                updatePriorityAfterDrag,                
            }}>
            {props.children}
        </FirebaseContext.Provider>
    )
}

