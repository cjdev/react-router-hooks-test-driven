import '@testing-library/jest-dom/extend-expect'
import createBackend from "./backend";
import Namespace from "../constants/Namespace";

const sampleProfileResponse = `[ {
  "name" : "home",
  "id" : "profile-1"
}, {
  "name" : "work",
  "id" : "profile-2"
}, {
  "name" : "vacation",
  "id" : "profile-3"
} ]`

const sampleTaskResponse = `[ {
  "profile" : "profile-1",
  "name" : "Remodel House",
  "complete" : false,
  "id" : "task-1"
}, {
  "profile" : "profile-1",
  "name" : "Install Bunker",
  "complete" : false,
  "id" : "task-2"
}, {
  "profile" : "profile-1",
  "name" : "Stockpile Supplies",
  "complete" : false,
  "id" : "task-3"
}, {
  "profile" : "profile-2",
  "name" : "Cure Cancer",
  "complete" : false,
  "id" : "task-4"
}, {
  "profile" : "profile-2",
  "name" : "World Peace",
  "complete" : false,
  "id" : "task-5"
}, {
  "profile" : "profile-2",
  "name" : "End Hunger",
  "complete" : false,
  "id" : "task-6"
}, {
  "profile" : "profile-3",
  "name" : "Base jump from Mount Everest",
  "complete" : false,
  "id" : "task-7"
}, {
  "profile" : "profile-3",
  "name" : "Toast marshmallows over volcano",
  "complete" : false,
  "id" : "task-8"
}, {
  "profile" : "profile-3",
  "name" : "Dune buggy riding on Mars",
  "complete" : false,
  "id" : "task-9"
} ]`

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
