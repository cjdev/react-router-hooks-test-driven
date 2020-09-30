import React from 'react';
import Routes from "./navigation/Routes";
import Summary from "./summary/Summary";
import useDependencies from "./dependency/useDependencies";

const TopLevel = () => {
    const {Routes, Summary} = useDependencies()
    return <div>
        <Routes/>
        <Summary/>
    </div>
}

export default TopLevel;
