import React from 'react';
import {render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import DependencyContext from "../dependency/DependencyContext";
import TopLevel from "./TopLevel";

const Routes = () => <div>Routes Component</div>
const Summary = () => <div>Summary Component</div>

test('renders routes and summary', () => {
    const rendered = render(
        <DependencyContext.Provider value={{Routes, Summary}}>
            <TopLevel/>
        </DependencyContext.Provider>
    )
    expect(rendered.getByText('Routes Component')).toBeInTheDocument()
    expect(rendered.getByText('Summary Component')).toBeInTheDocument()
})
