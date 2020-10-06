import React from 'react';

const ProfileList = ({profiles, deleteProfile}) => {
    const createProfileListItem = ({name, id}) => {
        const onClickDeleteButton = () => {
            deleteProfile(id)
        }
        return <li key={id}>
            <label htmlFor={id}>
                <a href={'task/' + id}>{name}</a>
            </label>
            <button onClick={onClickDeleteButton} id={id}>delete</button>
        </li>
    }
    const profileListItems = profiles.map(createProfileListItem)
    return <ul>{profileListItems}</ul>
}

export default ProfileList

/*
const ProfileList = ({profiles, deleteProfile}) => {
    const createProfileListItem = ({name, id}) => {
        const onClickDeleteButton = () => {
            deleteProfile(id)
        }
        return <li key={id}>
            <label htmlFor={id}>
                <a href={'task/' + id}>{name}</a>
            </label>
            <input type={'button'} onClick={onClickDeleteButton} id={id}>delete</input>
        </li>
    }

 */