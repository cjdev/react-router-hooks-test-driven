import React from "react";
import * as R from 'ramda'
import './ErrorComponent.css'

const handleAsyncError = setError => f => async (...args) => {
    try {
        return await f(...args)
    } catch (e) {
        setError(e)
    }
}

const ErrorComponent = ({error}) => {
    if (R.isNil(error)) {
        return null
    } else {
        return <div className={'error'}>{error.message}</div>
    }
}

export {ErrorComponent, handleAsyncError}
