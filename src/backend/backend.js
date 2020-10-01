import Namespace from "../constants/Namespace";

const createBackend = database => {
    if (!database) throw 'no database!'
    const fetchSummary = async () => {
        const numberOfProfiles = await database.count(Namespace.PROFILE);
        const numberOfTasksAcrossAllProfiles = await database.count(Namespace.TASK);
        return {numberOfProfiles, numberOfTasksAcrossAllProfiles};
    }

    const listProfiles = async () => {
        const result = await database.list(Namespace.PROFILE);
        return result
    }

    const backend = {
        fetchSummary,
        listProfiles
    }

    return backend
}

export default createBackend;
