import '@testing-library/jest-dom/extend-expect'
import createDatabase from "./database";

import * as R from 'ramda'

const createFetchFunction = responses => {
    return async (url, options) => {
        const responseMatches = response =>
            R.equals(url, response.url) && R.equals(options, response.options)
        const responseElement = R.find(responseMatches, responses)
        if (R.isNil(responseElement)) throw Error(`No response defined for url '${url}' and options ${JSON.stringify(options)}`)
        const text = async () => responseElement.response
        return {
            text
        }
    }
}

test('list', async () => {
    // given
    const namespace = 'the-namespace'
    const element1 = {name: 'foo'}
    const element2 = {name: 'bar'}
    const elements = [element1, element2]
    const fetchFunction = createFetchFunction([
        {
            url: `/database/${namespace}`,
            response: JSON.stringify(elements)
        }
    ])
    const database = createDatabase(fetchFunction)

    // when
    const actual = await database.list(namespace)

    // then
    expect(actual).toEqual(elements)
})

test('remove', async () => {
    // given
    const namespace = 'the-namespace'
    const id = 'the-id'
    const response = 'the-response'
    const fetchFunction = createFetchFunction([
        {
            url: `/database/${namespace}/${id}`,
            options: {
                method: 'DELETE'
            },
            response
        }
    ])
    const database = createDatabase(fetchFunction)

    // when
    const actual = await database.remove({id, namespace})

    // then
    expect(actual).toEqual(response)
})


test('add', async () => {
    // given
    const namespace = 'the-namespace'
    const id = 'the-id'
    const value = {
        name: 'the-name'
    }
    const fetchFunction = createFetchFunction([
        {
            url: `/database/${namespace}`,
            options: {
                method: 'POST',
                body: JSON.stringify(value)
            },
            response: id
        }
    ])
    const database = createDatabase(fetchFunction)

    // when
    const actual = await database.add({namespace, value})

    // then
    expect(actual).toEqual(id)
})

test('get', async () => {
    // given
    const id = 'the-id'
    const name = 'the-name'
    const namespace = 'the-namespace'
    const response = {id, name}
    const fetchFunction = createFetchFunction([
        {
            url: `/database/${namespace}/${id}`,
            response: JSON.stringify(response)
        }
    ])
    const database = createDatabase(fetchFunction)

    // when
    const actual = await database.get({namespace, id})

    // then
    expect(actual).toEqual(response)
})

test('update', async () => {
    // given
    const id = 'the-id'
    const name = 'the-name'
    const value = {id, name}
    const namespace = 'the-namespace'
    const fetchFunction = createFetchFunction([
        {
            url: `/database/${namespace}/${id}`,
            options: {
                method: 'POST',
                body: JSON.stringify(value)
            },
            response: id
        }
    ])
    const database = createDatabase(fetchFunction)

    // when
    const actual = await database.update({namespace, value})

    // then
    expect(actual).toEqual(id)
})
