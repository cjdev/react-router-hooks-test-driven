import React from 'react';

const ProfileList = ({profiles}) => {
    const createProfileListItem = ({name, id}) => <li key={id}><a href={'task/' + id}>{name}</a></li>
    const profileListItems = profiles.map(createProfileListItem)
    return <ul>{profileListItems}</ul>
}

export default ProfileList
