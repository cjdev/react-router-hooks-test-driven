import React from 'react';
import {render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import {ErrorComponent, handleAsyncError} from "./ErrorComponent";

test('display error message', async () => {
    // given
    const theErrorMessage = 'the-error-message'
    const theError = new Error(theErrorMessage)

    // when
    const rendered = render(<ErrorComponent error={theError}/>)

    // then
    expect(rendered.getByText(theErrorMessage)).toBeInTheDocument()
});

test('set error', async () => {
    const mySetError = jest.fn()
    const error = new Error('oops!')
    const myAsyncFunctionThatThrows = async () => {
        throw error
    }
    const myAsyncFunction = handleAsyncError(mySetError)(myAsyncFunctionThatThrows)
    await myAsyncFunction()

    expect(mySetError.mock.calls).toEqual([[error]])
});

test('forward arguments', async () => {
    const mySetError = jest.fn()
    const myBackingAsyncFunction = jest.fn()
    const myAsyncFunction = handleAsyncError(mySetError)(myBackingAsyncFunction)
    await myAsyncFunction(1, 2, 3)

    expect(mySetError.mock.calls).toEqual([])
    expect(myBackingAsyncFunction.mock.calls).toEqual([[1, 2, 3]])
});
