import React from 'react';
import DependencyContext from "./DependencyContext";

const ProductionDependencyProvider = ({children}) => {
    const dependencies = {}

    return (
        <DependencyContext.Provider value={dependencies}>
            {children}
        </DependencyContext.Provider>
    )
}

export default ProductionDependencyProvider;
