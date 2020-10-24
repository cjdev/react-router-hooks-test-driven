import React from 'react';
import {render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import TopLevel from "./TopLevel";
import SummaryContext from "../summary/SummaryContext";

const Routes = () => <div>Routes Component</div>
const Summary = () => <div>Summary Component</div>
const SummaryProvider = ({children}) =>
    <SummaryContext.Provider>
        <div>Summary Context</div>
        {children}
    </SummaryContext.Provider>

test('renders routes and summary', () => {
    const rendered = render(
        <TopLevel Summary={Summary} Routes={Routes} SummaryProvider={SummaryProvider}/>
    )
    expect(rendered.getByText('Routes Component')).toBeInTheDocument()
    expect(rendered.getByText('Summary Component')).toBeInTheDocument()
    expect(rendered.getByText('Summary Context')).toBeInTheDocument()
})
