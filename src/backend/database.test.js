import '@testing-library/jest-dom/extend-expect'
import createDatabase from "./database";

test('count items in namespace', async () => {
    const namespace = 'the-namespace'
    const responseText = '[{},{},{}]'
    const textFunction = jest.fn().mockResolvedValueOnce(responseText)
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

test('list', async () => {
    const namespace = 'the-namespace'
    const responseText = `[ {
  "name" : "foo"
}, {
  "name" : "bar"
} ]`
    const textFunction = jest.fn().mockResolvedValueOnce(responseText)
    const responseMap = {
        [`/database/${namespace}`]: {text: textFunction}
    }
    const expected = [ {
        "name" : "foo"
    }, {
        "name" : "bar"
    } ]
    const fetchFunction = jest.fn().mockImplementation(key => {
        if (!responseMap[key]) throw `no value defined for key '${key}'`
        return Promise.resolve(responseMap[key])
    })
    const database = createDatabase(fetchFunction)
    const actual = await database.list(namespace)
    expect(actual).toEqual(expected)
})
