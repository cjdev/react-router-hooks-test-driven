import '@testing-library/jest-dom/extend-expect'
import createBackend from "./backend";
import Namespace from "../constants/Namespace";
import * as R from "ramda";

const alphabeticCompare = (a, b) => a.localeCompare(b, 'en')

const sortKeys = jsonObject => {
    const unsortedKeys = R.keys(jsonObject)
    const sortedKeys = R.sort(alphabeticCompare, unsortedKeys)
    return R.pick(sortedKeys, jsonObject)
}

const jsonToKey = jsonObject => JSON.stringify(sortKeys(jsonObject))

const mapWithJsonKeyToJestFunction = resultMap => {
    const implementation = keyAsJsonObject => {
        const key = jsonToKey(keyAsJsonObject)
        if (R.includes(key, R.keys(resultMap))) {
            return resultMap[key]
        } else {
            const keyDisplay = JSON.stringify(keyAsJsonObject)
            const resultMapDisplay = JSON.stringify(resultMap)
            throw `Key '${keyDisplay}' not found in map ${resultMapDisplay}`
        }
    }
    return jest.fn().mockImplementation(implementation)
}

test('descriptive error if no database', async () => {
    // given
    expect(() => createBackend()).toThrow('backend missing dependency database')
})

test('fetch summary', async () => {
    // given
    const countResultMap = {
        [Namespace.PROFILE]: [{}, {}, {}],
        [Namespace.TASK]: [{}, {}, {}, {}, {}]
    }
    const list = jest.fn().mockImplementation(key => Promise.resolve(countResultMap[key]))
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
    const profiles = [{
        "name": "home",
        "id": "profile-1"
    }, {
        "name": "work",
        "id": "profile-2"
    }, {
        "name": "vacation",
        "id": "profile-3"
    }]
    const listResultMap = {
        [Namespace.PROFILE]: profiles
    }
    const list = jest.fn().mockImplementation(key => listResultMap[key])
    const database = {list}
    const backend = createBackend(database)

    // when
    const actual = await backend.listProfiles()

    // then
    expect(actual).toEqual(profiles)
})

test('list tasks for profile', async () => {
    // given
    const profileId = 'relevant-profile-id'
    const irrelevantTask = {
        profile: 'some-other-profile-id',
        name: 'irrelevant-task',
        complete: false,
        id: 'task-1'
    }
    const relevantTask = {
        profile: profileId,
        name: 'relevant-task',
        complete: false,
        id: 'task-2'
    }
    const tasks = [irrelevantTask, relevantTask]
    const expected = [relevantTask]
    const listResultMap = {
        [Namespace.TASK]: tasks
    }
    const list = jest.fn().mockImplementation(key => listResultMap[key])
    const database = {list}
    const backend = createBackend(database)

    // when
    const actual = await backend.listTasksForProfile(profileId)

    // then
    expect(actual).toEqual(expected)
})

test('delete profile and corresponding tasks', async () => {
    // given
    const profileId = 'relevant-profile-id'
    const irrelevantTask = {
        profile: 'some-other-profile-id',
        name: 'irrelevant-task',
        complete: false,
        id: 'irrelevant-task-id'
    }
    const relevantTask = {
        profile: profileId,
        name: 'relevant-task',
        complete: false,
        id: 'relevant-task-id'
    }
    const tasks = [irrelevantTask, relevantTask]
    const expected = [relevantTask]
    const listResultMap = {
        [Namespace.TASK]: tasks
    }
    const list = jest.fn().mockImplementation(key => listResultMap[key])
    const remove = jest.fn()
    const database = {list, remove}
    const backend = createBackend(database)

    // when
    await backend.deleteProfileAndCorrespondingTasks(profileId)

    // then
    expect(remove.mock.calls.length).toEqual(2)
    expect(remove.mock.calls).toContainEqual([{namespace: 'profile', id: 'relevant-profile-id'}])
    expect(remove.mock.calls).toContainEqual([{namespace: 'task', id: 'relevant-task-id'}])
})

test('add profile', async () => {
    // given
    const profileName = 'profile-name'
    const add = jest.fn()
    const database = {add}
    const backend = createBackend(database)

    // when
    await backend.addProfile(profileName)

    // then
    expect(add.mock.calls).toEqual([[{namespace: 'profile', value: {name: profileName}}]])
})

test('get profile', async () => {
    // given
    const namespace = Namespace.PROFILE
    const id = 'profile-id'
    const profile = {
        "name": "home",
        "id": "profile-1"
    }
    const getResultMap = {
        [jsonToKey({id, namespace})]: profile
    }
    const get = mapWithJsonKeyToJestFunction(getResultMap)
    const database = {get}
    const backend = createBackend(database)

    // when
    const actual = await backend.getProfile(id)

    // then
    expect(actual).toEqual(profile)
})

test('update task', async () => {
    // given
    const value = {id: 'task-id', name: 'task-name'}
    const update = jest.fn()
    const database = {update}
    const backend = createBackend(database)

    // when
    await backend.updateTask(value)

    // then
    expect(update.mock.calls).toEqual([[{namespace: Namespace.TASK, value}]])
})

test('delete task', async () => {
    // given
    const id = 'the-id'
    const namespace = Namespace.TASK
    const remove = jest.fn()
    const database = {remove}
    const backend = createBackend(database)

    // when
    await backend.deleteTask(id)

    // then
    expect(remove.mock.calls).toEqual([[{namespace: Namespace.TASK, id}]])
})

test('add task', async () => {
    // given
    const value = {profile: "the-profile-id", name: "the-task-name", complete: false}
    const add = jest.fn()
    const database = {add}
    const backend = createBackend(database)

    // when
    await backend.addTask(value)

    // then
    expect(add.mock.calls).toEqual([[{namespace: Namespace.TASK, value}]])
})
