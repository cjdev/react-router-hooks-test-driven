import './Summary.css'
import React from 'react';
import useSummary from './useSummary'
import {ErrorComponent} from "../error/ErrorComponent";

const Summary = () => {
    const summary = useSummary()
    const {numberOfProfiles, numberOfTasks, error} = summary

    return (
        <div className={"Summary"}>
            <ErrorComponent error={error}/>
            <span>Number of profiles = {numberOfProfiles}</span>
            <span>Number of tasks across all profiles = {numberOfTasks}</span>
        </div>
    )
};

export default Summary;
