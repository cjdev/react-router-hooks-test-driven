import React from 'react';
import './App.css';
import ProductionDependencyProvider from "./dependencies/ProductionDependencyProvider";
import TopLevel from "./TopLevel";

const App = () =>
    <div>
        <ProductionDependencyProvider>
            <TopLevel/>
        </ProductionDependencyProvider>
    </div>

export default App;
