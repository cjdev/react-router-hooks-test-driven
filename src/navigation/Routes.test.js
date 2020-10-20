import React from 'react';
import {createMemoryHistory} from 'history'
import {render} from '@testing-library/react'
import Routes from '../navigation/Routes'
import '@testing-library/jest-dom/extend-expect'

const Task = () => <div>Task Component</div>
const Profile = () => <div>Profile Component</div>

const testRoute = ({path, expected}) => {
    const history = createMemoryHistory()
    history.push(path)
    const rendered = render(
        <Routes history={history} Task={Task} Profile={Profile}/>
    )
    expect(rendered.getByText(expected)).toBeInTheDocument()
}

test('/profile renders ProfilePage', () => {
    testRoute({path: '/profile', expected: 'Profile Component'});
});

test('/ renders ProfilePage', () => {
    testRoute({path: '/', expected: 'Profile Component'});
});

test('/task renders TaskPage', () => {
    testRoute({path: '/task', expected: 'Task Component'});
});

test('/unexpected renders ProfilePage', () => {
    testRoute({path: '/unexpected', expected: 'Profile Component'});
});
