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

    const list = async namespace => await fetchJson(namespace)

    const remove = async ({namespace, id}) => await fetchText(namespace + '/' + id, {method: 'DELETE'})

    const get = async ({namespace, id}) => await fetchJson(namespace + '/' + id)

    const add = async ({namespace, value}) => await fetchText(namespace, {method: 'POST', body: JSON.stringify(value)})

    const update = async ({namespace, value}) => {
        const method = 'POST';
        const body = JSON.stringify(value)
        const uri = namespace + '/' + value.id;
        return await fetchText(uri, {method, body})
    }

    const database = {
        list,
        remove,
        add,
        get,
        update
    }
    return database
}

export default createDatabase
