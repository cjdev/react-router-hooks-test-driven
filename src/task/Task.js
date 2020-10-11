import './Task.css'
import React, {useEffect, useState} from "react";
import useSummary from "../summary/useSummary";
import useDependencies from "../dependency/useDependencies";
import * as R from 'ramda'
import {pluralize} from "../string-util/string-util";

const profileIdFromPathNameRegex = /\/task\/(.*)/

const parseProfileId = pathName => {
    const match = profileIdFromPathNameRegex.exec(pathName)
    const profileId = match[1]
    return profileId
}

const NewTask = ({profileId, loadTasks, backend, updateSummary}) => {
    const [newTaskName, setNewTaskName] = useState('');

    const submitOnEnter = async event => {
        if (newTaskName === '') return;
        if (event.key !== 'Enter') return;
        const task = {profile: profileId, name: newTaskName, complete: false}
        await backend.addTask(task)
        await updateSummary()
        setNewTaskName('')
        await loadTasks()
    }

    const onNewTaskChange = (event) => {
        setNewTaskName(event.target.value)
    }

    return (
        <input placeholder={"new task"}
               onKeyUp={submitOnEnter}
               onChange={onNewTaskChange}
               value={newTaskName}/>
    )
}

const SingleTask = ({task, updateTask}) => {
    const completeClass = task.complete ? 'complete' : 'in-progress';
    const onClick = () => {
        const newTask = {...task, complete: !task.complete}
        updateTask(newTask)
    }
    return <span className={completeClass} onClick={onClick}>{task.name}</span>
}

const Tasks = ({tasks, updateTask}) => {
    const taskElements = tasks.map(task => <SingleTask key={task.id} task={task} updateTask={updateTask}/>)
    return <div className={'elements'}>{taskElements}</div>
}

const Task = () => {
    const {backend, windowContract} = useDependencies()
    const summaryContext = useSummary();
    const [tasks, setTasks] = useState([]);
    const [profileName, setProfileName] = useState('');
    const encodedPathName = windowContract.location.pathname
    const pathName = decodeURI(encodedPathName)
    const profileId = parseProfileId(pathName)
    const updateSummary = async () => {
        await summaryContext.updateSummary();
    }
    const loadTasks = async () => {
        const profile = await backend.getProfile(profileId)
        setProfileName(profile.name)
        const tasksFromBackend = await backend.listTasksForProfile(profileId)
        setTasks(tasksFromBackend)
    }
    const updateTask = async task => {
        await backend.updateTask(task)
        loadTasks()
    }
    const onClearClick = async () => {
        const isComplete = task => task.complete;
        const completedTasks = R.filter(isComplete, tasks);
        const completedTaskIds = R.map(R.prop('id'), completedTasks);
        const promises = R.map(backend.deleteTask, completedTaskIds);
        await Promise.all(promises);
        await updateSummary()
        return loadTasks();
    }
    useEffect(() => {
        loadTasks()
    }, []);
    return <div className={'Task'}>
        <h2>{tasks.length} {pluralize({quantity: tasks.length, singular: 'task', plural: 'tasks'})} in
            profile {profileName}</h2>
        <NewTask profileId={profileId} loadTasks={loadTasks} backend={backend} updateSummary={updateSummary}/>
        <Tasks tasks={tasks} updateTask={updateTask}/>
        <button onClick={onClearClick}>Clear Complete</button>
        <a href={'/profile'}>Profiles</a>
    </div>
}

export default Task
