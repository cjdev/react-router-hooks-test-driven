import './Profile.css'
import React, {Fragment, useEffect, useState} from "react";
import useSummary from "../summary/useSummary";
import * as R from "ramda";
import {pluralize} from "../string-util/string-util";
import {ErrorComponent, handleAsyncError} from "../error/ErrorComponent";

const ProfileList = ({profiles, deleteProfile}) => {
    const createProfileListItem = ({name, id}) => {
        const onClickDeleteButton = () => {
            deleteProfile(id)
        }
        return <Fragment key={id}>
            <label htmlFor={id}>
                <a href={'task/' + id}>{name}</a>
            </label>
            <button onClick={onClickDeleteButton} id={id}>delete</button>
        </Fragment>
    }
    const profileListItems = R.map(createProfileListItem, profiles)
    return <div className={'elements'}>{profileListItems}</div>
}

const AddProfile = ({backend, loadProfiles, updateSummary, setError}) => {
    const [newProfileName, setNewProfileName] = useState("")
    const newProfileOnChange = event => setNewProfileName(event.target.value)
    const newProfileOnKeyUp = handleAsyncError(setError)(async event => {
        if (newProfileName === '') return;
        if (event.key !== 'Enter') return;
        await backend.addProfile(newProfileName);
        await updateSummary();
        setNewProfileName('');
        loadProfiles()
    })
    return <input value={newProfileName}
                  placeholder={'new profile'}
                  onKeyUp={newProfileOnKeyUp}
                  onChange={newProfileOnChange}/>
}

const Profile = ({backend}) => {
    const summaryContext = useSummary()
    const [profiles, setProfiles] = useState([])
    const [error, setError] = useState()
    const updateSummary = handleAsyncError(setError)(async () => {
        return await summaryContext.updateSummary()
    })
    const loadProfiles = handleAsyncError(setError)(async () => {
        const latestProfiles = await backend.listProfiles()
        setProfiles(latestProfiles)
    })
    const deleteProfile = handleAsyncError(setError)(async id => {
        await backend.deleteProfileAndCorrespondingTasks(id)
        await updateSummary();
        await loadProfiles()
    })
    useEffect(() => {
        loadProfiles()
    }, [])
    return <div className={'Profile'}>
        <h2>{profiles.length} {pluralize({quantity: profiles.length, singular: 'profile', plural: 'profiles'})}</h2>
        <ErrorComponent error={error}/>
        <ProfileList profiles={profiles} deleteProfile={deleteProfile}/>
        <AddProfile backend={backend} loadProfiles={loadProfiles} updateSummary={updateSummary} setError={setError}/>
    </div>
}

export default Profile
