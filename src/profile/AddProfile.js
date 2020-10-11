import React, {useState} from 'react';
import useDependencies from "../dependency/useDependencies";

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

export default AddProfile;
