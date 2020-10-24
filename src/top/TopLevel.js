import React from 'react';

const TopLevel = ({Routes, Summary, SummaryProvider}) =>
    <SummaryProvider>
        <Routes/>
        <Summary/>
    </SummaryProvider>

export default TopLevel;
