import Namespaces from "../constants/Namespaces";

const createBackend = database => {
    if (!database) throw 'no database!'
    const fetchSummary = async () => {
        const numberOfProfiles = await database.count(Namespaces.PROFILE);
        const numberOfTasksAcrossAllProfiles = await database.count(Namespaces.TASK);
        return {numberOfProfiles, numberOfTasksAcrossAllProfiles};
    }

    const backend = {
        fetchSummary
    }

    return backend
}

export default createBackend;
