import React, {useEffect, useState} from 'react';
import SummaryContext from "./SummaryContext";
import useDependencies from "../dependency/useDependencies";

const SummaryProvider = ({children}) => {
    const {backend} = useDependencies()
    const [numberOfProfiles, setNumberOfProfiles] = useState(0);
    const [numberOfTasks, setNumberOfTasks] = useState(0);

    const updateSummary = async () => {
        const summary = await backend.fetchSummary();
        setNumberOfTasks(summary.numberOfTasks);
        setNumberOfProfiles(summary.numberOfProfiles);
    }

    useEffect(() => {
        updateSummary();
    }, []);

    return (
        <SummaryContext.Provider value={{updateSummary, numberOfProfiles, numberOfTasks}}>
            {children}
        </SummaryContext.Provider>
    )
}

export default SummaryProvider;
