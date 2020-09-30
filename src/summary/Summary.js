import React from 'react';
import useSummary from './useSummary'

const Summary = () => {
    const summary = useSummary()
    const {numberOfProfiles, numberOfTasks} = summary

    return (
        <div className={"Summary"}>
            <span>Number of profiles = {numberOfProfiles}</span>
            <span>Number of tasks across all profiles = {numberOfTasks}</span>
        </div>
    )
};

export default Summary;
