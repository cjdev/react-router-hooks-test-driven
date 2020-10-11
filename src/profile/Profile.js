import './Profile.css'
import React, {Fragment, useEffect, useState} from "react";
import useDependencies from "../dependency/useDependencies";
import useSummary from "../summary/useSummary";
import * as R from "ramda";
import {pluralize} from "../string-util/string-util";

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

const AddProfile = ({loadProfiles, updateSummary}) => {
    const {backend} = useDependencies()
    const [newProfileName, setNewProfileName] = useState("")
    const newProfileOnChange = event => setNewProfileName(event.target.value)
    const newProfileOnKeyUp = async event => {
        if (newProfileName === '') return;
        if (event.key !== 'Enter') return;
        await backend.addProfile(newProfileName);
        await updateSummary();
        setNewProfileName('');
        loadProfiles()
    }
    return <input value={newProfileName}
                  placeholder={'new profile'}
                  onKeyUp={newProfileOnKeyUp}
                  onChange={newProfileOnChange}/>
}

const Profile = () => {
    const {backend} = useDependencies()
    const summaryContext = useSummary()
    const [profiles, setProfiles] = useState([])
    const updateSummary = async () => {
        return await summaryContext.updateSummary()
    }
    const loadProfiles = async () => {
        const latestProfiles = await backend.listProfiles()
        setProfiles(latestProfiles)
    }
    const deleteProfile = async id => {
        await backend.deleteProfileAndCorrespondingTasks(id)
        await updateSummary();
        await loadProfiles()
    }
    useEffect(() => {
        loadProfiles()
    }, [])
    return <div className={'Profile'}>
        <h2>{profiles.length} {pluralize({quantity: profiles.length, singular: 'profile', plural: 'profiles'})}</h2>
        <ProfileList profiles={profiles} deleteProfile={deleteProfile}/>
        <AddProfile loadProfiles={loadProfiles} updateSummary={updateSummary}/>
    </div>
}

export default Profile
