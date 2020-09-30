import React from 'react';
import './App.css';
import ProductionDependencyProvider from "./dependencies/ProductionDependencyProvider";
import TopLevelComponent from "./TopLevelComponent";

const App = () =>
    <div>
        <ProductionDependencyProvider>
            <TopLevelComponent/>
        </ProductionDependencyProvider>
    </div>

export default App;
