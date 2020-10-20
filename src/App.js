import React from 'react';
import './App.css';
import {TopLevelNoArg, SummaryProviderNoArg} from "./Dependencies"

const App = () => <div>
        <SummaryProviderNoArg>
            <TopLevelNoArg/>
        </SummaryProviderNoArg>
    </div>

export default App;
