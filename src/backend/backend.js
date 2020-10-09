import Namespace from "../constants/Namespace";
import * as R from 'ramda'

const createBackend = database => {
    if (!database) throw 'backend missing dependency database'
    const deleteTask = async id => {
        const result = await database.remove({namespace: Namespace.TASK, id});
        return result
    }

    const listTasksForProfile = async id => {
        const allTasks = await database.list(Namespace.TASK);
        const taskMatchesProfile = task => task.profile === id
        const tasksForProfile = R.filter(taskMatchesProfile, allTasks)
        return tasksForProfile;
    }

    const deleteTasksForProfile = async id => {
        const tasks = await listTasksForProfile(id);
        const taskIds = R.map(R.prop('id'), tasks);
        return await Promise.all(R.map(deleteTask, taskIds));
    }

    const deleteProfile = async id => {
        const result = await database.remove({namespace: Namespace.PROFILE, id});
        return result
    }

    const countInNamespace = async namespace => {
        const items = await database.list(namespace)
        return items.length
    }

    const fetchSummary = async () => {
        const numberOfProfiles = await countInNamespace(Namespace.PROFILE);
        const numberOfTasksAcrossAllProfiles = await countInNamespace(Namespace.TASK);
        return {numberOfProfiles, numberOfTasksAcrossAllProfiles};
    }

    const listProfiles = async () => {
        const result = await database.list(Namespace.PROFILE);
        return result
    }

    const deleteProfileAndCorrespondingTasks = async id => {
        const deleteTasksFuture = deleteTasksForProfile(id)
        const deleteProfileFuture = deleteProfile(id)
        await Promise.all([deleteTasksFuture, deleteProfileFuture])
    }

    const addProfile = async name => {
        const profile = {name}
        await database.add({namespace: Namespace.PROFILE, value: profile})
    }

    const getProfile = async id => await database.get({namespace: Namespace.PROFILE, id})

    const updateTask = async task => {
        return await database.update({namespace: Namespace.TASK, value: task});
    }

    const addTask = async task => {
        await database.add({namespace: Namespace.TASK, value: task})
    }

    const backend = {
        fetchSummary,
        listProfiles,
        listTasksForProfile,
        deleteProfileAndCorrespondingTasks,
        addProfile,
        getProfile,
        updateTask,
        deleteTask,
        addTask
    }

    return backend
}

export default createBackend;
