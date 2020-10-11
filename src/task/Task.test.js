import React from 'react';
import {fireEvent, render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Task from "./Task";
import DependencyContext from "../dependency/DependencyContext";
import SummaryContext from "../summary/SummaryContext";
import {act} from "react-dom/test-utils"
import * as R from 'ramda'
import userEvent from '@testing-library/user-event'
import createSample from "../test-util/sample";

const createWindowContract = path => ({
    location: {
        pathname: path
    }
})

const createBackend = ({getProfileResult, listTasksResults}) => {
    const listTasksForProfile = jest.fn()
    const addListTasksResult = listTasksResult => listTasksForProfile.mockResolvedValueOnce(listTasksResult)
    R.forEach(addListTasksResult, listTasksResults || [])
    const getProfile = jest.fn().mockResolvedValue(getProfileResult)
    const updateTask = jest.fn()
    const deleteTask = jest.fn()
    const addTask = jest.fn()
    const backend = {
        listTasksForProfile,
        getProfile,
        updateTask,
        deleteTask,
        addTask
    }
    return backend
}

const createTester = async ({
                                getProfileResult,
                                listTasksResults,
                                path
                            }) => {
    const windowContract = createWindowContract(path)
    const backend = createBackend({getProfileResult, listTasksResults})
    const updateSummary = jest.fn()
    let rendered
    await act(async () => {
        rendered = render(<DependencyContext.Provider value={{backend, windowContract}}>
            <SummaryContext.Provider value={{updateSummary}}>
                <Task/>
            </SummaryContext.Provider>
        </DependencyContext.Provider>)
    })
    const clickClearCompleteButton = async () => {
        await act(async () => {
            fireEvent.click(rendered.getByRole('button', {name: 'Clear Complete'}))
        })
    }
    const clickOnTask = async name => {
        await act(async () => {
            fireEvent.click(rendered.getByText(name))
        })
    }
    const typeTaskName = async name => {
        await act(async () => {
            const taskNameDataEntry = rendered.getByPlaceholderText('new task')
            userEvent.type(taskNameDataEntry, name)
        })
    }
    const pressKey = async key => {
        await act(async () => {
            const taskNameDataEntry = rendered.getByPlaceholderText('new task')
            fireEvent.keyUp(taskNameDataEntry, {key})
        })
    }

    return {
        clickClearCompleteButton,
        clickOnTask,
        typeTaskName,
        pressKey,
        backend,
        updateSummary,
        rendered
    }
}

test('render singular task', async () => {
    // given
    const sample = createSample()
    const profile = sample.profile()
    const path = `/task/${profile.id}`
    const task = sample.task({profile})
    const tasks = [task]
    const tester = await createTester({
        getProfileResult: profile,
        listTasksResults: [tasks],
        path
    })

    // then
    expect(tester.rendered.getByText(`1 task in profile ${profile.name}`)).toBeInTheDocument()
    expect(tester.rendered.getByText(task.name)).toBeInTheDocument()
    expect(tester.updateSummary.mock.calls.length).toEqual(0)
});

test('render plural tasks', async () => {
    // given
    const sample = createSample()
    const profile = sample.profile()
    const path = `/task/${profile.id}`
    const task1 = sample.task({profile})
    const task2 = sample.task({profile})
    const tasks = [task1, task2]
    const tester = await createTester({
        getProfileResult: profile,
        listTasksResults: [tasks],
        path
    })

    // then
    expect(tester.rendered.getByText(`2 tasks in profile ${profile.name}`)).toBeInTheDocument()
    expect(tester.rendered.getByText(`${task1.name}`)).toBeInTheDocument()
    expect(tester.rendered.getByText(`${task2.name}`)).toBeInTheDocument()
    expect(tester.updateSummary.mock.calls.length).toEqual(0)
});

test('incomplete task has class in-progress', async () => {
    // given
    const sample = createSample()
    const profile = sample.profile()
    const path = `/task/${profile.id}`
    const task = sample.task({profile})
    const tasks = [task]
    const tester = await createTester({
        getProfileResult: profile,
        listTasksResults: [tasks],
        path
    })

    // then
    expect(tester.rendered.getByText(task.name)).toBeInTheDocument()
    expect(tester.rendered.getByText(task.name).className).toEqual('in-progress')
    expect(tester.updateSummary.mock.calls.length).toEqual(0)
});

test('complete task has class complete', async () => {
    // given
    const sample = createSample()
    const profile = sample.profile()
    const path = `/task/${profile.id}`
    const task = sample.task({profile, complete: true})
    const tasks = [task]
    const tester = await createTester({
        getProfileResult: profile,
        listTasksResults: [tasks],
        path
    })

    // then
    expect(tester.rendered.getByText(task.name)).toBeInTheDocument()
    expect(tester.rendered.getByText(task.name).className).toEqual('complete')
    expect(tester.updateSummary.mock.calls.length).toEqual(0)
});

test('mark task complete', async () => {
    // given
    const sample = createSample()
    const profile = sample.profile()
    const path = `/task/${profile.id}`
    const task = sample.task({profile})
    const tasksBefore = [task]
    const updatedTask = R.mergeRight(task, {complete: true})
    const tasksAfter = [updatedTask]
    const listTasksResults = [tasksBefore, tasksAfter]
    const tester = await createTester({
        getProfileResult: profile,
        listTasksResults,
        path
    })

    // when
    await tester.clickOnTask(task.name)

    // then
    expect(tester.rendered.getByText(task.name)).toBeInTheDocument()
    expect(tester.rendered.getByText(task.name).className).toEqual('complete')
    expect(tester.backend.updateTask.mock.calls).toEqual([[updatedTask]])
    expect(tester.updateSummary.mock.calls.length).toEqual(0)
});

test('clear complete', async () => {
    // given
    const sample = createSample()
    const profile = sample.profile()
    const path = `/task/${profile.id}`
    const completeTask = sample.task({profile, complete: true})
    const incompleteTask = sample.task({profile, complete: false})
    const tasksBefore = [completeTask, incompleteTask]
    const tasksAfter = [incompleteTask]
    const listTasksResults = [tasksBefore, tasksAfter]
    const tester = await createTester({
        getProfileResult: profile,
        listTasksResults,
        path
    })

    // when
    await tester.clickClearCompleteButton()

    // then
    expect(tester.rendered.getByText(incompleteTask.name)).toBeInTheDocument()
    expect(tester.rendered.queryByText(completeTask.name)).not.toBeInTheDocument()
    expect(tester.backend.deleteTask.mock.calls).toEqual([[completeTask.id]])
    expect(tester.updateSummary.mock.calls.length).toEqual(1)
});

test('add task', async () => {
    // given
    const sample = createSample()
    const profile = sample.profile()
    const path = `/task/${profile.id}`
    const task = sample.task({profile})
    const taskToAdd = R.omit(['id'], task)
    const tasksBefore = []
    const tasksAfter = [task]
    const listTasksResults = [tasksBefore, tasksAfter]
    const tester = await createTester({
        getProfileResult: profile,
        listTasksResults,
        path
    })

    // when
    await tester.typeTaskName(task.name)
    await tester.pressKey('Enter')

    // then
    expect(tester.rendered.getByText(task.name)).toBeInTheDocument()
    expect(tester.backend.addTask.mock.calls).toEqual([[taskToAdd]])
    expect(tester.updateSummary.mock.calls.length).toEqual(1)
});

test('do not add blank task', async () => {
    // given
    const sample = createSample()
    const profile = sample.profile()
    const path = `/task/${profile.id}`
    const listTasksResults = [[], []]
    const tester = await createTester({
        getProfileResult: profile,
        listTasksResults,
        path
    })

    // when
    await tester.pressKey('Enter')

    // then
    expect(tester.backend.addTask.mock.calls).toEqual([])
    expect(tester.updateSummary.mock.calls.length).toEqual(0)
});

test('do not add task if key is not enter', async () => {
    // given
    const sample = createSample()
    const profile = sample.profile()
    const path = `/task/${profile.id}`
    const task = sample.task({profile})
    const listTasksResults = [[], []]
    const tester = await createTester({
        getProfileResult: profile,
        listTasksResults,
        path
    })

    // when
    await tester.typeTaskName(task.name)
    await tester.pressKey('a')

    // then
    expect(tester.backend.addTask.mock.calls).toEqual([])
});
