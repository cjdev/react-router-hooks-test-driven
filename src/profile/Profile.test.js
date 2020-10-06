import React from 'react';
import {fireEvent, render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Profile from "./Profile";
import DependencyContext from "../dependency/DependencyContext";
import SummaryContext from "../summary/SummaryContext";
import {act} from "react-dom/test-utils"
import userEvent from '@testing-library/user-event'

test('render profiles', async () => {
    const profiles = [{
        "name": "home",
        "id": "profile-1"
    }, {
        "name": "work",
        "id": "profile-2"
    }]
    const backend = {
        listProfiles: jest.fn().mockResolvedValueOnce(profiles)
    }
    const updateSummary = jest.fn()
    let rendered;
    await act(async () => {
        rendered = render(<DependencyContext.Provider value={{backend}}>
            <SummaryContext.Provider value={{updateSummary}}>
                <Profile/>
            </SummaryContext.Provider>
        </DependencyContext.Provider>)
    })
    expect(rendered.getByText('2 profiles')).toBeInTheDocument()
    expect(rendered.getByText('home')).toBeInTheDocument()
    expect(rendered.getByText('work')).toBeInTheDocument()
    expect(updateSummary.mock.calls.length).toEqual(1)
});

test('render profile', async () => {
    const profiles = [{
        "name": "home",
        "id": "profile-1"
    }]
    const backend = {
        listProfiles: jest.fn().mockResolvedValueOnce(profiles)
    }
    const updateSummary = jest.fn()
    let rendered;
    await act(async () => {
        rendered = render(<DependencyContext.Provider value={{backend}}>
            <SummaryContext.Provider value={{updateSummary}}>
                <Profile/>
            </SummaryContext.Provider>
        </DependencyContext.Provider>)
    })
    expect(rendered.getByText('1 profile')).toBeInTheDocument()
    expect(rendered.getByText('home')).toBeInTheDocument()
    expect(updateSummary.mock.calls.length).toEqual(1)
});

test('add profile', async () => {
    const profilesBefore = [{
        "name": "home",
        "id": "profile-1"
    }]
    const profilesAfter = [
        {
            "name": "home",
            "id": "profile-1"
        },
        {
            "name": "profile name",
            "id": "profile-2"
        }]
    const listProfiles = jest.fn()
        .mockResolvedValueOnce(profilesBefore)
        .mockResolvedValueOnce(profilesAfter)
    const addProfile = jest.fn()
    const backend = {listProfiles, addProfile}
    const updateSummary = jest.fn()
    let rendered;
    await act(async () => {
        rendered = render(<DependencyContext.Provider value={{backend}}>
            <SummaryContext.Provider value={{updateSummary}}>
                <Profile/>
            </SummaryContext.Provider>
        </DependencyContext.Provider>)
        userEvent.type(rendered.getByPlaceholderText('new profile'), 'profile name')
    })
    const updateSummaryCallsBeforeAddingNewProfile = updateSummary.mock.calls.length
    await act(async () => {
        fireEvent.keyUp(rendered.getByPlaceholderText('new profile'), {key: 'Enter', code: 'Enter'})
        expect(updateSummary.mock.calls.length).toEqual(1)
    })
    expect(rendered.getByText('2 profiles')).toBeInTheDocument()
    expect(rendered.getByText('home')).toBeInTheDocument()
    expect(rendered.getByText('profile name')).toBeInTheDocument()
    expect(updateSummary.mock.calls.length).toEqual(updateSummaryCallsBeforeAddingNewProfile + 1)
});

test('delete profile', async () => {
    const profile1 = {
        "name": "profile-name-1",
        "id": "profile-id-1"
    }
    const profile2 = {
        "name": "profile-name-2",
        "id": "profile-id-2"
    }
    const profile3 = {
        "name": "profile-name-3",
        "id": "profile-id-3"
    }
    const profilesBefore = [profile1, profile2, profile3]
    const profilesAfter = [profile1, profile3]
    const listProfiles = jest.fn()
        .mockResolvedValueOnce(profilesBefore)
        .mockResolvedValueOnce(profilesAfter)
    const deleteProfileAndCorrespondingTasks = jest.fn()
    const backend = {listProfiles, deleteProfileAndCorrespondingTasks}
    const updateSummary = jest.fn()
    let rendered;
    await act(async () => {
        rendered = render(<DependencyContext.Provider value={{backend}}>
            <SummaryContext.Provider value={{updateSummary}}>
                <Profile/>
            </SummaryContext.Provider>
        </DependencyContext.Provider>)
    })
    const updateSummaryCallsBeforeDeletingProfile = updateSummary.mock.calls.length
    await act(async () => {
        const buttonForProfile2 = rendered.getByLabelText('profile-name-2')
        userEvent.click(buttonForProfile2)
        expect(updateSummary.mock.calls.length).toEqual(1)
    })
    expect(rendered.getByText('2 profiles')).toBeInTheDocument()
    expect(rendered.getByText('profile-name-1')).toBeInTheDocument()
    expect(rendered.getByText('profile-name-3')).toBeInTheDocument()
    expect(updateSummary.mock.calls.length).toEqual(updateSummaryCallsBeforeDeletingProfile + 1)
    expect(deleteProfileAndCorrespondingTasks.mock.calls).toEqual([['profile-id-2']])
});
