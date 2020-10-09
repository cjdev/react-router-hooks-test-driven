import React, {useEffect, useState} from "react";
import {fireEvent, render} from '@testing-library/react'
import {act} from "react-dom/test-utils"
import '@testing-library/jest-dom/extend-expect'

const Component = ({fetchName}) => {
    const [name, setName] = useState('original name');
    const loadName = async () => {
        const newName = await fetchName()
        setName(newName)
    }
    const onButtonClick = async () => {
        setName('updated name')
    }
    useEffect(() => {
        loadName()
    }, []);
    return <div>
        <span>{name}</span>
        <button onClick={onButtonClick}>The Button</button>
    </div>
}

test('state change after load', async () => {
    let renderResult
    const fetchName = async () => {
        return Promise.resolve('original name')
    }
    await act(async () => {
        renderResult = render(<Component fetchName={fetchName}/>)
    })
    await act(async () => {
        fireEvent.click(renderResult.getByRole('button', {name: 'The Button'}))
    })
    expect(renderResult.getByText('updated name')).toBeInTheDocument()
})
