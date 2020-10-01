import React from 'react';
import useDependencies from "./dependency/useDependencies";

const TopLevel = () => {
    const {Routes, Summary} = useDependencies()
    return <div>
        <Routes/>
        <Summary/>
    </div>
}

export default TopLevel;
