import React from 'react';
import {render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import TopLevel from "./TopLevel";

const Routes = () => <div>Routes Component</div>
const Summary = () => <div>Summary Component</div>

test('renders routes and summary', () => {
    const rendered = render(
        <TopLevel Summary={Summary} Routes={Routes}/>
    )
    expect(rendered.getByText('Routes Component')).toBeInTheDocument()
    expect(rendered.getByText('Summary Component')).toBeInTheDocument()
})
