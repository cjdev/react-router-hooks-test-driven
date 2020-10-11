import './Profile.css'
import React, {useEffect, useState} from "react";
import useDependencies from "../dependency/useDependencies";
import useSummary from "../summary/useSummary";
import ProfileList from "./ProfileList";
import AddProfile from "./AddProfile";

const pluralize = ({quantity, singular, plural}) => {
    if (quantity === 1) {
        return singular
    } else {
        return plural
    }
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
