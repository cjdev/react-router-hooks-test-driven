import React from 'react';
import {render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Task from "./Task";
import DependencyContext from "../dependency/DependencyContext";
import SummaryContext from "../summary/SummaryContext";
import {act} from "react-dom/test-utils"


const mapToJestFunction = resultMap => jest.fn().mockImplementation(key => resultMap[key])

test('render tasks', async () => {
    const profileId = 'profile-id'
    const windowLocationPathnameResult = `/task/${profileId}`
    const windowContract = {
        location: {
            pathname: windowLocationPathnameResult
        }
    }
    const profile = {
        id: profileId,
        name: 'profile-name'
    }
    const task1 = {
        profile: profileId,
        "name": "Incomplete Task",
        "complete": false,
        "id": "task-1"
    }
    const task2 = {
        profile: profileId,
        "name": "Complete Task",
        "complete": true,
        "id": "task-2"
    }
    const tasks = [task1, task2]
    const listTasksForProfileMap = {
        [profileId]: tasks
    }
    const listTasksForProfile = mapToJestFunction(listTasksForProfileMap)
    const getProfileMap = {}
    const getProfile = mapToJestFunction(getProfileMap)
    const backend = {
        listTasksForProfile,
        getProfile
    }
    const updateSummary = jest.fn()
    let rendered;
    await act(async () => {
        rendered = render(<DependencyContext.Provider value={{backend, windowContract}}>
            <SummaryContext.Provider value={{updateSummary}}>
                <Task/>
            </SummaryContext.Provider>
        </DependencyContext.Provider>)
    })
    expect(rendered.getByText('Incomplete Task')).toBeInTheDocument()
    expect(rendered.getByText('Incomplete Task').className).toEqual('in-progress')
    expect(rendered.getByText('Complete Task')).toBeInTheDocument()
    expect(rendered.getByText('Complete Task').className).toEqual('complete')
});
