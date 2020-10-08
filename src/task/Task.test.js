import React from 'react';
import {render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Task from "./Task";
import DependencyContext from "../dependency/DependencyContext";
import SummaryContext from "../summary/SummaryContext";
import {act} from "react-dom/test-utils"
import * as R from 'ramda'


const mapToJestFunction = resultMap => {
    const implementation = key => {
        if (R.includes(key, R.keys(resultMap))) {
            return resultMap[key]
        } else {
            throw `Key '${key}' not found in map ${JSON.stringify(resultMap)}`
        }
    }
    return jest.fn().mockImplementation(implementation)
}

test('render singular task', async () => {
    const profileId = 'profile-id'
    const windowLocationPathnameResult = `/task/${profileId}`
    const windowContract = {
        location: {
            pathname: windowLocationPathnameResult
        }
    }
    const profile = {
        id: profileId,
        name: 'Profile Name'
    }
    const task1 = {
        profile: profileId,
        "name": "Some Task",
        "complete": false,
        "id": "task-1"
    }
    const tasks = [task1]
    const listTasksForProfileMap = {
        [profileId]: tasks
    }
    const listTasksForProfile = mapToJestFunction(listTasksForProfileMap)
    const getProfileMap = {
        [profileId]: profile
    }
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
    expect(rendered.getByText('1 task in profile Profile Name')).toBeInTheDocument()
    expect(rendered.getByText('Some Task')).toBeInTheDocument()
    expect(rendered.getByText('Some Task').className).toEqual('in-progress')
});

test('render plural tasks', async () => {
    const profileId = 'profile-id'
    const windowLocationPathnameResult = `/task/${profileId}`
    const windowContract = {
        location: {
            pathname: windowLocationPathnameResult
        }
    }
    const profile = {
        id: profileId,
        name: 'Profile Name'
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
    const getProfileMap = {
        [profileId]: profile
    }
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
    expect(rendered.getByText('2 tasks in profile Profile Name')).toBeInTheDocument()
    expect(rendered.getByText('Incomplete Task')).toBeInTheDocument()
    expect(rendered.getByText('Incomplete Task').className).toEqual('in-progress')
    expect(rendered.getByText('Complete Task')).toBeInTheDocument()
    expect(rendered.getByText('Complete Task').className).toEqual('complete')
});
