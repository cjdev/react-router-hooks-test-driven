import '@testing-library/jest-dom/extend-expect'
import createDatabase from "./database";

test('count items in namespace', async () => {
    const namespace = 'the-namespace'
    const sampleResponse = `[ {
  "name" : "home",
  "id" : "profile-1"
}, {
  "name" : "work",
  "id" : "profile-2"
}, {
  "name" : "vacation",
  "id" : "profile-3"
} ]`
    const textFunction = jest.fn().mockResolvedValueOnce(sampleResponse)
    const responseMap = {
        [`/database/${namespace}`]: {text: textFunction}
    }
    const fetchFunction = jest.fn().mockImplementation(key => {
        if (!responseMap[key]) throw `no value defined for key '${key}'`
        return Promise.resolve(responseMap[key])
    })
    const database = createDatabase(fetchFunction)
    const actual = await database.count('the-namespace')

    expect(actual).toEqual(3)
})
