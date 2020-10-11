import '@testing-library/jest-dom/extend-expect'
import createBackend from "./backend";
import Namespace from "../constants/Namespace";
import * as R from "ramda";
import createSample from "../test-util/sample";
import {createMapFunction} from "../test-util/stub";

test('descriptive error if no database', async () => {
    expect(() => createBackend()).toThrow('backend missing dependency database')
})

test('fetch summary', async () => {
    // given
    const sample = createSample()
    const list = createMapFunction([{
        key: Namespace.PROFILE,
        value: sample.profileArray(3)
    }, {
        key: Namespace.TASK,
        value: sample.taskArray(5)
    }])
    const database = {list}
    const backend = createBackend(database)

    // when
    const summary = await backend.fetchSummary()

    // then
    expect(summary.numberOfProfiles).toEqual(3)
    expect(summary.numberOfTasksAcrossAllProfiles).toEqual(5)
})

test('list profiles', async () => {
    // given
    const sample = createSample()
    const profiles = sample.profileArray(3)
    const list = createMapFunction([{
        key: Namespace.PROFILE,
        value: profiles
    }])
    const database = {list}
    const backend = createBackend(database)

    // when
    const actual = await backend.listProfiles()

    // then
    expect(actual).toEqual(profiles)
})

test('list tasks for profile', async () => {
    // given
    const sample = createSample()
    const profile = sample.profile()
    const irrelevantTask = sample.task()
    const relevantTask = sample.task({profile})
    const tasks = [irrelevantTask, relevantTask]
    const expected = [relevantTask]
    const list = createMapFunction([{
        key: Namespace.TASK,
        value: tasks
    }])
    const database = {list}
    const backend = createBackend(database)

    // when
    const actual = await backend.listTasksForProfile(profile.id)

    // then
    expect(actual).toEqual(expected)
})

test('delete profile and corresponding tasks', async () => {
    // given
    const sample = createSample()
    const profile = sample.profile()
    const irrelevantTask = sample.task()
    const relevantTask = sample.task({profile})
    const tasks = [irrelevantTask, relevantTask]
    const list = createMapFunction([{
        key: Namespace.TASK,
        value: tasks
    }])
    const remove = jest.fn()
    const database = {list, remove}
    const backend = createBackend(database)

    // when
    await backend.deleteProfileAndCorrespondingTasks(profile.id)

    // then
    expect(remove.mock.calls.length).toEqual(2)
    expect(remove.mock.calls).toContainEqual([{namespace: Namespace.PROFILE, id: profile.id}])
    expect(remove.mock.calls).toContainEqual([{namespace: Namespace.TASK, id: relevantTask.id}])
})

test('add profile', async () => {
    // given
    const sample = createSample()
    const profile = sample.profile()
    const namespace = Namespace.PROFILE
    const add = jest.fn()
    const database = {add}
    const backend = createBackend(database)

    // when
    await backend.addProfile(profile.name)

    // then
    expect(add.mock.calls).toEqual([[{namespace, value: {name: profile.name}}]])
})

test('get profile', async () => {
    // given
    const sample = createSample()
    const namespace = Namespace.PROFILE
    const profile = sample.profile()
    const id = profile.id
    const get = createMapFunction([{
        key: {id, namespace},
        value: profile
    }])
    const database = {get}
    const backend = createBackend(database)

    // when
    const actual = await backend.getProfile(id)

    // then
    expect(actual).toEqual(profile)
})

test('update task', async () => {
    // given
    const namespace = Namespace.TASK
    const sample = createSample()
    const value = sample.task()
    const update = jest.fn()
    const database = {update}
    const backend = createBackend(database)

    // when
    await backend.updateTask(value)

    // then
    expect(update.mock.calls).toEqual([[{namespace, value}]])
})

test('delete task', async () => {
    // given
    const sample = createSample()
    const task = sample.task()
    const id = task.id
    const namespace = Namespace.TASK
    const remove = jest.fn()
    const database = {remove}
    const backend = createBackend(database)

    // when
    await backend.deleteTask(id)

    // then
    expect(remove.mock.calls).toEqual([[{namespace, id}]])
})

test('add task', async () => {
    // given
    const sample = createSample()
    const task = sample.task()
    const value = R.omit(['id'], task)
    const namespace = Namespace.TASK
    const add = jest.fn()
    const database = {add}
    const backend = createBackend(database)

    // when
    await backend.addTask(value)

    // then
    expect(add.mock.calls).toEqual([[{namespace, value}]])
})
