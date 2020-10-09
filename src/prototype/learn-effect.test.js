import React, {useEffect, useState} from "react";
import {render} from '@testing-library/react'
import {act} from "react-dom/test-utils"
import '@testing-library/jest-dom/extend-expect'

const User = ({id, fetchContract}) => {
    const [user, setUser] = useState(null);

    async function fetchUserData(id) {
        const response = await fetchContract("/" + id);
        setUser(await response.json());
    }

    useEffect(() => {
        fetchUserData(id);
    }, [id]);

    if (!user) {
        return "loading...";
    }

    return (
        <details>
            <summary>{user.name}</summary>
            <strong>{user.age}</strong> years old
            <br/>
            lives in {user.address}
        </details>
    );
}

it("renders user data", async () => {
    const fakeUser = {
        name: "Joni Baez",
        age: "32",
        address: "123, Charming Avenue"
    };
    const fetchContract = () => {
        return Promise.resolve({
            json: () => Promise.resolve(fakeUser)
        });
    };

    let container
    await act(async () => {
        container = render(<User id="123" fetchContract={fetchContract}/>);
    });

    expect(container.getByText(fakeUser.name)).toBeInTheDocument()
    expect(container.getByText(fakeUser.age)).toBeInTheDocument()
    expect(container.getByText(/123, Charming Avenue/)).toBeInTheDocument()
});
