import React, {Fragment} from 'react';
import * as R from 'ramda'

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

export default ProfileList
