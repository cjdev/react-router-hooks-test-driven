import React, {useEffect, useState} from 'react';
import SummaryContext from "./SummaryContext";
import useDependencies from "../dependency/useDependencies";
import {handleAsyncError} from "../error/ErrorComponent";

const SummaryProvider = ({children}) => {
    const {backend} = useDependencies()
    const [numberOfProfiles, setNumberOfProfiles] = useState(0)
    const [numberOfTasks, setNumberOfTasks] = useState(0)
    const [error, setError] = useState()

    const updateSummary = handleAsyncError(setError)(async () => {
        const {numberOfProfiles, numberOfTasksAcrossAllProfiles} = await backend.fetchSummary();
        setNumberOfProfiles(numberOfProfiles);
        setNumberOfTasks(numberOfTasksAcrossAllProfiles);
    })

    useEffect(() => {
        updateSummary();
    }, []);

    return (
        <SummaryContext.Provider value={{updateSummary, numberOfProfiles, numberOfTasks, error}}>
            {children}
        </SummaryContext.Provider>
    )
}

export default SummaryProvider;
