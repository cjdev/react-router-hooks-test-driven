import '@testing-library/jest-dom/extend-expect'
import createDatabase from "./database";

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
    }]
    const fetchFunction = jest.fn().mockImplementation(key => {
        if (!responseMap[key]) throw `no value defined for key '${key}'`
        return Promise.resolve(responseMap[key])
    })
    const database = createDatabase(fetchFunction)
    const actual = await database.list(namespace)
    expect(actual).toEqual(expected)
})

test('remove', async () => {
    // given
    const id = 'the-id'
    const namespace = 'the-namespace'
    const expected = id
    const textFunction = jest.fn().mockResolvedValueOnce(id)
    const responseMap = {
        [`/database/${namespace}/${id}`]: {text: textFunction}
    }
    const fetchFunction = jest.fn().mockImplementation(key => {
        if (!responseMap[key]) throw `no value defined for key '${key}'`
        return Promise.resolve(responseMap[key])
    })
    const database = createDatabase(fetchFunction)

    // when
    const actual = await database.remove({id, namespace})

    // then
    expect(actual).toEqual(expected)
    expect(fetchFunction.mock.calls.length).toEqual(1)
    const callParameters = fetchFunction.mock.calls[0]
    expect(callParameters).toEqual(['/database/the-namespace/the-id', {method: 'DELETE'}])
})

test('add', async () => {
    // given
    const id = 'the-id'
    const value = {
        name: 'the-name'
    }
    const body = JSON.stringify(value)
    const namespace = 'the-namespace'
    const expected = id
    const textFunction = jest.fn().mockResolvedValueOnce(id)
    const responseMap = {
        [`/database/${namespace}`]: {text: textFunction}
    }
    const fetchFunction = jest.fn().mockImplementation(key => {
        if (!responseMap[key]) throw `no value defined for key '${key}'`
        return Promise.resolve(responseMap[key])
    })
    const database = createDatabase(fetchFunction)

    // when
    const actual = await database.add({namespace, value})

    // then
    expect(actual).toEqual(expected)
    expect(fetchFunction.mock.calls.length).toEqual(1)
    const callParameters = fetchFunction.mock.calls[0]
    expect(callParameters).toEqual(['/database/the-namespace', {method: 'POST', body}])
})

test('get', async () => {
    const id = 'the-id'
    const name = 'the-name'
    const namespace = 'the-namespace'
    const responseText = `{
  "id" : "the-id",
  "name" : "the-name"
}`
    const textFunction = jest.fn().mockResolvedValueOnce(responseText)
    const responseMap = {
        [`/database/${namespace}/${id}`]: {text: textFunction}
    }
    const expected = {
        id,
        name
    }
    const fetchFunction = jest.fn().mockImplementation(key => {
        if (!responseMap[key]) throw `no value defined for key '${key}'`
        return Promise.resolve(responseMap[key])
    })
    const database = createDatabase(fetchFunction)
    const actual = await database.get({namespace, id})
    expect(actual).toEqual(expected)
})
