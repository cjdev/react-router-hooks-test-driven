import React from 'react';
import DependencyContext from './DependencyContext'
import Routes from '../navigation/Routes'
import Summary from '../summary/Summary'

const ProductionDependencyProvider = ({children}) => {
    const dependencies = {Routes, Summary}

    return (
        <DependencyContext.Provider value={dependencies}>
            {children}
        </DependencyContext.Provider>
    )
}

export default ProductionDependencyProvider;
