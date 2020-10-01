import '@testing-library/jest-dom/extend-expect'
import createBackend from "./backend";
import Namespaces from "../constants/Namespaces";

test('fetch summary', async () => {
    const databaseResults = {
        [Namespaces.PROFILE]: 123,
        [Namespaces.TASK]: 456
    }
    const count = jest.fn().mockImplementation(key => databaseResults[key])
    const database = {count}
    const backend = createBackend(database)
    const summary = await backend.fetchSummary()

    expect(summary.numberOfProfiles).toEqual(123)
    expect(summary.numberOfTasksAcrossAllProfiles).toEqual(456)
})
