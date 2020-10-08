import './Task.css'
import React, {useEffect, useState} from "react";
import useSummary from "../summary/useSummary";
import useDependencies from "../dependency/useDependencies";

const profileIdFromPathNameRegex = /\/task\/(.*)/

const parseProfileId = pathName => {
    const match = profileIdFromPathNameRegex.exec(pathName)
    const profileId = match[1]
    return profileId
}

const SingleTask = ({task}) => {
    const completeClass = task.complete ? 'complete' : 'in-progress';
    return <span className={completeClass}>{task.name}</span>
}

const Tasks = ({tasks}) => {
    const taskElements = tasks.map(task => <SingleTask key={task.id} task={task}/>)
    return <div className={'elements'}>{taskElements}</div>
}

const Task = () => {
    const {backend, windowContract} = useDependencies()
    const summaryContext = useSummary();
    const [tasks, setTasks] = useState([]);
    const encodedPathName = windowContract.location.pathname
    const pathName = decodeURI(encodedPathName)
    const profileId = parseProfileId(pathName)
    const loadTasks = async () => {
        const tasksFromBackend = await backend.listTasksForProfile(profileId)
        await summaryContext.updateSummary();
        setTasks(tasksFromBackend)
    }
    useEffect(() => {
        loadTasks()
    }, []);
    return <div className={'Task'}>
        <h2>Tasks</h2>
        <Tasks tasks={tasks}/>
        <a href={'/profile'}>Profiles</a>
    </div>
}

export default Task
