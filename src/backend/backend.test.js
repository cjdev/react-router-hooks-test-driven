import '@testing-library/jest-dom/extend-expect'
import createBackend from "./backend";
import Namespace from "../constants/Namespace";

test('descriptive error if no database', async () => {
    // given
    expect(() => createBackend()).toThrow('backend missing dependency database')
})

test('fetch summary', async () => {
    // given
    const countResultMap = {
        [Namespace.PROFILE]: 123,
        [Namespace.TASK]: 456
    }
    const count = jest.fn().mockImplementation(key => countResultMap[key])
    const database = {count}
    const backend = createBackend(database)

    // when
    const summary = await backend.fetchSummary()

    // then
    expect(summary.numberOfProfiles).toEqual(123)
    expect(summary.numberOfTasksAcrossAllProfiles).toEqual(456)
})

test('list profiles', async () => {
    // given
    const profiles = [ {
        "name" : "home",
        "id" : "profile-1"
    }, {
        "name" : "work",
        "id" : "profile-2"
    }, {
        "name" : "vacation",
        "id" : "profile-3"
    } ]
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
