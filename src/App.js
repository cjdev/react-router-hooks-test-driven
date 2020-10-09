import React from 'react';
import './App.css';
import ProductionDependencyProvider from "./ProductionDependencyProvider";
import TopLevel from "./top/TopLevel";

const App = () =>
    <div>
        <ProductionDependencyProvider>
            <TopLevel/>
        </ProductionDependencyProvider>
    </div>

export default App;
