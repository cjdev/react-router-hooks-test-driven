import React from 'react';
import {fireEvent, render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Task from "./Task";
import DependencyContext from "../dependency/DependencyContext";
import SummaryContext from "../summary/SummaryContext";
import {act} from "react-dom/test-utils"
import * as R from 'ramda'
import userEvent from '@testing-library/user-event'

const alphabeticCompare = (a, b) => a.localeCompare(b, 'en')

const sortKeys = jsonObject => {
    const unsortedKeys = R.keys(jsonObject)
    const sortedKeys = R.sort(alphabeticCompare, unsortedKeys)
    return R.pick(sortedKeys, jsonObject)
}

const jsonToKey = jsonObject => JSON.stringify(sortKeys(jsonObject))

const mapWithJsonKeyToJestFunction = (resultMap, name) => {
    const implementation = keyAsJsonObject => {
        const key = jsonToKey(keyAsJsonObject)
        if (R.includes(key, R.keys(resultMap))) {
            return resultMap[key]
        } else {
            const keyDisplay = JSON.stringify(keyAsJsonObject)
            const resultMapDisplay = JSON.stringify(resultMap)
            throw `${name}: Key '${keyDisplay}' not found in map ${resultMapDisplay}`
        }
    }
    return jest.fn().mockImplementation(implementation)
}

const mapToJestFunction = (resultMap, name) => {
    const implementation = key => {
        if (R.includes(key, R.keys(resultMap))) {
            return resultMap[key]
        } else {
            throw `${name}: Key '${JSON.stringify(key)}' not found in map ${JSON.stringify(resultMap)}`
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
    const incompleteTask = {
        profile: profileId,
        "name": "Incomplete Task",
        "complete": false,
        "id": "task-1"
    }
    const completeTask = {
        profile: profileId,
        "name": "Complete Task",
        "complete": true,
        "id": "task-2"
    }
    const tasks = [incompleteTask, completeTask]
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

test('mark task complete', async () => {
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
    const originalTask = {
        profile: profileId,
        "name": "Some Task",
        "complete": false,
        "id": "task-1"
    }
    const taskUpdate = R.mergeRight(originalTask, {complete: true})
    const oldTasks = [originalTask]
    const newTasks = [taskUpdate]
    const listTasksForProfile = jest.fn().mockResolvedValueOnce(oldTasks).mockResolvedValueOnce(newTasks)
    const getProfileMap = {
        [profileId]: profile
    }
    const getProfile = mapToJestFunction(getProfileMap, 'getProfile')
    const updateTaskMap = {
        [jsonToKey(taskUpdate)]: "task-1"
    }
    const updateTask = mapWithJsonKeyToJestFunction(updateTaskMap, 'updateTask')
    const backend = {
        listTasksForProfile,
        getProfile,
        updateTask
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
    await act(async () => {
        fireEvent.click(rendered.getByText('Some Task'))
    })
    expect(rendered.getByText('1 task in profile Profile Name')).toBeInTheDocument()
    expect(rendered.getByText('Some Task')).toBeInTheDocument()
    expect(rendered.getByText('Some Task').className).toEqual('complete')
    expect(updateTask.mock.calls).toEqual([
        [
            {
                profile: 'profile-id',
                name: 'Some Task',
                complete: true,
                id: 'task-1'
            }
        ]
    ])
});

test('clear complete', async () => {
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
    const completeTask = {
        profile: profileId,
        "name": "Complete Task",
        "complete": true,
        "id": "task-complete-id"
    }
    const incompleteTask = {
        profile: profileId,
        "name": "Incomplete Task",
        "complete": false,
        "id": "task-incomplete-id"
    }
    const oldTasks = [completeTask, incompleteTask]
    const newTasks = [incompleteTask]
    const listTasksForProfile = jest.fn().mockResolvedValueOnce(oldTasks).mockResolvedValueOnce(newTasks)
    const getProfileMap = {
        [profileId]: profile
    }
    const getProfile = mapToJestFunction(getProfileMap, 'getProfile')
    const deleteTask = jest.fn()
    const backend = {
        listTasksForProfile,
        getProfile,
        deleteTask
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
    await act(async () => {
        const clearCompleteButton = rendered.getByText('Clear Complete')
        userEvent.click(clearCompleteButton)
    })

    expect(rendered.getByText('1 task in profile Profile Name')).toBeInTheDocument()
    expect(rendered.getByText('Incomplete Task')).toBeInTheDocument()
    expect(rendered.getByText('Incomplete Task').className).toEqual('in-progress')
    expect(deleteTask.mock.calls).toEqual([["task-complete-id"]])
});
