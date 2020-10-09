import React from "react";
import {render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import {Redirect, Route, Router, Switch} from 'react-router-dom'
import {createMemoryHistory} from 'history'

const Foo = () => <div>Foo</div>
const Bar = () => <div>Bar</div>

const MyRoutes = ({history}) => {
    return (
        <Router history={history}>
            <Switch>
                <Route path="/foo">
                    <Foo/>
                </Route>
                <Route path="/bar">
                    <Bar/>
                </Route>
                <Route>
                    <Redirect to="/foo"/>
                </Route>
            </Switch>
        </Router>
    )
}

test('react router foo', () => {
    const history = createMemoryHistory()
    history.push("/foo")
    const {container} = render(
        <MyRoutes history={history}/>
    )
    expect(container.innerHTML).toMatch('Foo')
})

test('react router bar', () => {
    const history = createMemoryHistory()
    history.push("/bar")
    const {container} = render(
        <MyRoutes history={history}/>
    )
    expect(container.innerHTML).toMatch('Bar')
})

test('react router unexpected', () => {
    const history = createMemoryHistory()
    const {container} = render(
        <MyRoutes history={history}/>
    )
    expect(container.innerHTML).toMatch('Foo')
})
