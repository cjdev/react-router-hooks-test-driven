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
    const loadProfiles = async () => {
        const latestProfiles = await backend.listProfiles()
        await summaryContext.updateSummary();
        setProfiles(latestProfiles)
    }
    useEffect(() => {
        loadProfiles()
    }, [])
    return <div className={'Profile'}>
        <h2>{profiles.length} {pluralize({quantity: profiles.length, singular: 'profile', plural: 'profiles'})}</h2>
        <ProfileList profiles={profiles}/>
        <AddProfile loadProfiles={loadProfiles} backend={backend}/>
    </div>
}

export default Profile
