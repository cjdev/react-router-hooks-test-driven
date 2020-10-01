import React from 'react';
import {render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Profile from "./Profile";
import DependencyContext from "../dependency/DependencyContext";
import SummaryContext from "../summary/SummaryContext";
import {act} from "react-dom/test-utils"
import userEvent from '@testing-library/user-event'

test('render profiles', async () => {
    const profiles = [ {
        "name" : "home",
        "id" : "profile-1"
    }, {
        "name" : "work",
        "id" : "profile-2"
    } ]
    const backend = {
        listProfiles: jest.fn().mockResolvedValueOnce(profiles)
    }
    const updateSummary = jest.fn()
    let rendered;
    await act(async ()=>{
        rendered = render(<DependencyContext.Provider value={{backend}}>
            <SummaryContext.Provider value={{updateSummary}}>
                <Profile/>
            </SummaryContext.Provider>
        </DependencyContext.Provider>)
    })
    expect(rendered.getByText('2 profiles')).toBeInTheDocument()
    expect(rendered.getByText('home')).toBeInTheDocument()
    expect(rendered.getByText('work')).toBeInTheDocument()
});

test('render profile', async () => {
    const profiles = [ {
        "name" : "home",
        "id" : "profile-1"
    } ]
    const backend = {
        listProfiles: jest.fn().mockResolvedValueOnce(profiles)
    }
    const updateSummary = jest.fn()
    let rendered;
    await act(async ()=>{
        rendered = render(<DependencyContext.Provider value={{backend}}>
            <SummaryContext.Provider value={{updateSummary}}>
                <Profile/>
            </SummaryContext.Provider>
        </DependencyContext.Provider>)
    })
    expect(rendered.getByText('1 profile')).toBeInTheDocument()
    expect(rendered.getByText('home')).toBeInTheDocument()
});

test('add profile', async () => {
    const profiles = [ {
        "name" : "home",
        "id" : "profile-1"
    } ]
    const backend = {
        listProfiles: jest.fn().mockResolvedValueOnce(profiles)
    }
    const updateSummary = jest.fn()
    let rendered;
    await act(async ()=>{
        rendered = render(<DependencyContext.Provider value={{backend}}>
            <SummaryContext.Provider value={{updateSummary}}>
                <Profile/>
            </SummaryContext.Provider>
        </DependencyContext.Provider>)
    })
    await act(async () => {
        userEvent.type(rendered.getByPlaceholderText('new profile'), 'profile name')
    })
    await act(async () => {
        fireEvent.click(rendered.getByPlaceholderText('new profile'))
    })
    await act(async () => {
        fireEvent.keyUp(rendered, { key: 'Enter', code: 'Enter' })
    })
});
