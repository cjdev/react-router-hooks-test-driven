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

    const fetchSummary = async () => {
        const numberOfProfiles = await database.count(Namespace.PROFILE);
        const numberOfTasksAcrossAllProfiles = await database.count(Namespace.TASK);
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

    const backend = {
        fetchSummary,
        listProfiles,
        listTasksForProfile,
        deleteProfileAndCorrespondingTasks
    }

    return backend
}

export default createBackend;
