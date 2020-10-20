import React from 'react';
import './App.css';
import Dependencies from "./Dependencies";
import TopLevel from "./top/TopLevel";

const App = () =>
    <div>
        <Dependencies>
            <TopLevel/>
        </Dependencies>
    </div>

export default App;
