import React from 'react';
import DependencyContext from './dependency/DependencyContext'
import Routes from './navigation/Routes'
import Summary from './summary/Summary'
import createBackend from './backend/backend'
import SummaryProvider from "./summary/SummaryProvider";
import createDatabase from "./backend/database";
import {createBrowserHistory} from 'history';
import Task from "./task/Task";
import Profile from "./profile/Profile";

const ProductionDependencyProvider = ({children}) => {
    const fetchContract = fetch
    const database = createDatabase(fetchContract)
    const backend = createBackend(database)
    const history = createBrowserHistory()
    const windowContract = window
    const dependencies = {backend, Routes, Summary, history, Task, Profile, windowContract}

    return (
        <DependencyContext.Provider value={dependencies}>
            <SummaryProvider>
                {children}
            </SummaryProvider>
        </DependencyContext.Provider>
    )
}

export default ProductionDependencyProvider;
