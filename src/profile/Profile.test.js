import React from 'react';
import {fireEvent, render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Profile from "./Profile";
import DependencyContext from "../dependency/DependencyContext";
import SummaryContext from "../summary/SummaryContext";
import {act} from "react-dom/test-utils"
import userEvent from '@testing-library/user-event'
import * as R from "ramda";
import createSample from "../test-util/sample";

const createBackend = ({listProfilesResults}) => {
    const listProfiles = jest.fn()
    const addListProfilesResult = listProfilesResult => listProfiles.mockResolvedValueOnce(listProfilesResult)
    R.forEach(addListProfilesResult, listProfilesResults || [])
    const deleteProfileAndCorrespondingTasks = jest.fn()
    const addProfile = jest.fn()
    const backend = {
        listProfiles,
        deleteProfileAndCorrespondingTasks,
        addProfile
    }
    return backend
}

const createTester = async ({
                                listProfilesResults
                            }) => {
    const backend = createBackend({listProfilesResults})
    const updateSummary = jest.fn()
    let rendered
    await act(async () => {
        rendered = render(<DependencyContext.Provider value={{backend}}>
            <SummaryContext.Provider value={{updateSummary}}>
                <Profile/>
            </SummaryContext.Provider>
        </DependencyContext.Provider>)
    })
    const clickDeleteButton = async profileId => {
        await act(async () => {
            const button = rendered.getByLabelText(profileId)
            userEvent.click(button)
        })
    }
    const typeProfileName = async name => {
        await act(async () => {
            const profileNameDataEntry = rendered.getByPlaceholderText('new profile')
            userEvent.type(profileNameDataEntry, name)
        })
    }
    const pressKey = async key => {
        await act(async () => {
            const profileNameDataEntry = rendered.getByPlaceholderText('new profile')
            fireEvent.keyUp(profileNameDataEntry, {key})
        })
    }
    return {
        clickDeleteButton,
        typeProfileName,
        pressKey,
        backend,
        updateSummary,
        rendered
    }
}

test('render profiles', async () => {
    // given
    const sample = createSample()
    const profiles = sample.profileArray(2)
    const tester = await createTester({
        listProfilesResults: [profiles]
    })

    // then
    expect(tester.rendered.getByText('2 profiles')).toBeInTheDocument()
    expect(tester.rendered.getByText(profiles[0].name)).toBeInTheDocument()
    expect(tester.rendered.getByText(profiles[1].name)).toBeInTheDocument()
    expect(tester.updateSummary.mock.calls.length).toEqual(0)
});

test('render profile', async () => {
    // given
    const sample = createSample()
    const profile = sample.profile()
    const tester = await createTester({
        listProfilesResults: [[profile]]
    })

    // then
    expect(tester.rendered.getByText('1 profile')).toBeInTheDocument()
    expect(tester.rendered.getByText(profile.name)).toBeInTheDocument()
    expect(tester.updateSummary.mock.calls.length).toEqual(0)
});

test('add profile', async () => {
    // given
    const sample = createSample()
    const profile = sample.profile()
    const profilesBefore = []
    const profilesAfter = [profile]
    const tester = await createTester({
        listProfilesResults: [profilesBefore, profilesAfter]
    })

    // when
    await tester.typeProfileName(profile.name)
    await tester.pressKey('Enter')

    // then
    expect(tester.rendered.getByText(profile.name)).toBeInTheDocument()
    expect(tester.backend.addProfile.mock.calls).toEqual([[profile.name]])
    expect(tester.updateSummary.mock.calls.length).toEqual(1)
});

test('do not add empty profile', async () => {
    // given
    const sample = createSample()
    const profile = sample.profile()
    const profilesBefore = []
    const profilesAfter = []
    const tester = await createTester({
        listProfilesResults: [profilesBefore, profilesAfter]
    })

    // when
    await tester.pressKey('Enter')

    // then
    expect(tester.backend.addProfile.mock.calls).toEqual([])
    expect(tester.updateSummary.mock.calls.length).toEqual(0)
});

test('do not add profile if key pressed was not enter', async () => {
    // given
    const sample = createSample()
    const profile = sample.profile()
    const profilesBefore = []
    const profilesAfter = []
    const tester = await createTester({
        listProfilesResults: [profilesBefore, profilesAfter]
    })

    // when
    await tester.typeProfileName(profile.name)
    await tester.pressKey('a')

    // then
    expect(tester.backend.addProfile.mock.calls).toEqual([])
    expect(tester.updateSummary.mock.calls.length).toEqual(0)
});

test('delete profile', async () => {
    // given
    const sample = createSample()
    const profile = sample.profile()
    const profilesBefore = [profile]
    const profilesAfter = []
    const tester = await createTester({
        listProfilesResults: [profilesBefore, profilesAfter]
    })

    // when
    await tester.clickDeleteButton(profile.name)

    // then
    expect(tester.backend.deleteProfileAndCorrespondingTasks.mock.calls).toEqual([[profile.id]])
    expect(tester.updateSummary.mock.calls.length).toEqual(1)
});
