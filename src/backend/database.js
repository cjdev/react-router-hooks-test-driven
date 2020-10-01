const createDatabase = fetchFunction => {
    const fetchText = async (relativeResource, init) => {
        const resource = '/database/' + relativeResource
        const response = await fetchFunction(resource, init)
        const text = await response.text()
        return text
    }
    const fetchJson = async (resource, init) => {
        const text = await fetchText(resource, init);
        const json = JSON.parse(text);
        return json;
    }
    const list = async namespace => {
        const result = await fetchJson(namespace)
        return result
    }
    const count = async namespace => {
        const elements = await list(namespace)
        return elements.length
    }
    const database = {
        count
    }
    return database
}

export default createDatabase