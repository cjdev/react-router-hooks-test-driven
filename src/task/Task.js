import './Task.css'
import React, {useEffect, useState} from "react";
import useSummary from "../summary/useSummary";
import useDependencies from "../dependency/useDependencies";

const pluralize = ({quantity, singular, plural}) => {
    if (quantity === 1) {
        return singular
    } else {
        return plural
    }
}

export {pluralize};

const profileIdFromPathNameRegex = /\/task\/(.*)/

const parseProfileId = pathName => {
    const match = profileIdFromPathNameRegex.exec(pathName)
    const profileId = match[1]
    return profileId
}

const SingleTask = ({task, updateTask}) => {
    const completeClass = task.complete ? 'complete' : 'in-progress';
    const onClick = () => {
        updateTask({...task, complete: !task.complete})
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
    const loadTasks = async () => {
        const profile = await backend.getProfile(profileId)
        setProfileName(profile.name)
        const tasksFromBackend = await backend.listTasksForProfile(profileId)
        await summaryContext.updateSummary();
        setTasks(tasksFromBackend)
    }
    const updateTask = async task => {
        await backend.updateTask(task)
        loadTasks()
    }
    useEffect(() => {
        loadTasks()
    }, []);
    return <div className={'Task'}>
        <h2>{tasks.length} {pluralize({quantity: tasks.length, singular: 'task', plural: 'tasks'})} in
            profile {profileName}</h2>
        <Tasks tasks={tasks} updateTask={updateTask}/>
        <a href={'/profile'}>Profiles</a>
    </div>
}

export default Task
