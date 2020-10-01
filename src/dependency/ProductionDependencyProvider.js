import React from 'react';
import DependencyContext from './DependencyContext'
import Routes from '../navigation/Routes'
import Summary from '../summary/Summary'
import createBackend from '../backend/backend'
import SummaryProvider from "../summary/SummaryProvider";
import createDatabase from "../backend/database";

const ProductionDependencyProvider = ({children}) => {
    const fetchContract = fetch
    const database = createDatabase(fetchContract)
    const backend = createBackend(database)
    const dependencies = {backend, Routes, Summary}

    return (
        <DependencyContext.Provider value={dependencies}>
            <SummaryProvider>
                {children}
            </SummaryProvider>
        </DependencyContext.Provider>
    )
}

export default ProductionDependencyProvider;
