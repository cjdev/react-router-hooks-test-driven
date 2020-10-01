import React from 'react';
import {fireEvent, render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import DependencyContext from "../dependency/DependencyContext";
import SummaryProvider from "./SummaryProvider";
import Summary from "./Summary";

import {act} from "react-dom/test-utils"
import useSummary from "./useSummary";

test('render summary', async () => {
    const fetchSummary = jest.fn().mockResolvedValueOnce({
        numberOfProfiles: 123,
        numberOfTasksAcrossAllProfiles: 456
    })
    const backend = {
        fetchSummary
    }
    let rendered
    await act(async () => {
        rendered = render(
            <DependencyContext.Provider value={{backend}}>
                <SummaryProvider>
                    <Summary/>
                </SummaryProvider>
            </DependencyContext.Provider>
        )
    })
    expect(rendered.getByText('Number of profiles = 123')).toBeInTheDocument()
    expect(rendered.getByText('Number of tasks across all profiles = 456')).toBeInTheDocument()
})

test('update summary', async () => {
    const ComponentThatTriggersUpdate = () => {
        const summary = useSummary()
        const onClick = () => {
            summary.updateSummary()
        }
        return <div>
            <button onClick={onClick}>Update Summary</button>
        </div>
    }
    const fetchSummary = jest.fn()
        .mockResolvedValueOnce({numberOfProfiles: 1, numberOfTasksAcrossAllProfiles: 2})
        .mockResolvedValueOnce({numberOfProfiles: 3, numberOfTasksAcrossAllProfiles: 4})
    const backend = {
        fetchSummary
    }
    let rendered
    await act(async () => {
        rendered = render(
            <DependencyContext.Provider value={{backend}}>
                <SummaryProvider>
                    <Summary/>
                    <ComponentThatTriggersUpdate/>
                </SummaryProvider>
            </DependencyContext.Provider>
        )
    })
    await act(async () => {
        fireEvent.click(rendered.getByRole('button', {name: 'Update Summary'}))
    })
    expect(rendered.getByText('Number of profiles = 3')).toBeInTheDocument()
    expect(rendered.getByText('Number of tasks across all profiles = 4')).toBeInTheDocument()
})
