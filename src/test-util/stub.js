import * as R from "ramda";

const createMapFunction = entries => {
    return async key => {
        const entryMatches = entry => R.equals(key, entry.key)
        const entry = R.find(entryMatches, entries)
        if (R.isNil(entry)) throw Error(`No value defined for key '${key}'`)
        return entry.value
    }
}

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

export {createMapFunction, createFetchFunction}
