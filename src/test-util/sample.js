import * as R from 'ramda'

const createSample = () => {
    let index = 0
    const string = prefix => `${prefix}-${++index}`
    const profile = () => ({
        name: string('name'),
        id: string('id')
    })
    const profileArray = quantity => R.times(profile, quantity)
    const task = overrides => {
        return {
            profile: overrides?.profile?.id || string('profile-id'),
            name: overrides?.name || string('name'),
            complete: overrides?.complete || false,
            id: overrides?.id || string('id')
        }
    }
    const taskArray = quantity => R.times(task, quantity)
    return {
        profile,
        task,
        string,
        profileArray,
        taskArray
    }
}

export default createSample;
