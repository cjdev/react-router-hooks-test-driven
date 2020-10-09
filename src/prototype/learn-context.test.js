import React, {useContext} from "react";
import {render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test('can send context value from provider to consumer', () => {
    const SomeContext = React.createContext();
    const SomeComponent = ({contextValue}) => {
        return <pre>{contextValue}</pre>
    }
    const renderResult = render(<SomeContext.Provider value={'hello'}>
        <SomeContext.Consumer>
            {
                contextValue => <SomeComponent contextValue={contextValue}/>
            }
        </SomeContext.Consumer>
    </SomeContext.Provider>)
    expect(renderResult.container.innerHTML).toBe('<pre>hello</pre>')
})

test('inner component can access outer context', () => {
    const SomeContext = React.createContext();
    const SomeComponent = () => {
        const someContext = useContext(SomeContext);
        return <pre>{someContext}</pre>
    }
    const renderResult = render(<SomeContext.Provider value={'hello'}>
        <SomeComponent/>
    </SomeContext.Provider>)
    expect(renderResult.container.innerHTML).toBe('<pre>hello</pre>')
})

test('default context is used by consumer when no provider can be found', () => {
    const SomeContext = React.createContext('hello');
    const renderResult = render(<SomeContext.Consumer>
        {
            contextValue =>
                <pre>{contextValue}</pre>
        }
    </SomeContext.Consumer>)
    expect(renderResult.container.innerHTML).toBe('<pre>hello</pre>')
})


test('default context does does not take effect if a provider is available with an omitted value', () => {
    const SomeContext = React.createContext('hello');
    const renderResult = render(<SomeContext.Provider>
        <SomeContext.Consumer>
            {
                contextValue =>
                    <pre>{contextValue}</pre>
            }
        </SomeContext.Consumer>
    </SomeContext.Provider>)
    expect(renderResult.container.innerHTML).toBe('<pre></pre>')
})

test('default context does does not take effect if a provider is available with an omitted value', () => {
    const SomeContext = React.createContext('hello');
    const SomeComponent = () => {
        const someContext = useContext(SomeContext);
        return <pre>{JSON.stringify(someContext)}</pre>
    }
    const renderResult = render(<SomeContext.Provider>
        <SomeComponent/>
    </SomeContext.Provider>)
    expect(renderResult.container.innerHTML).toBe('<pre></pre>')
})
