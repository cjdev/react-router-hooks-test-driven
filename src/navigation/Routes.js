import React from 'react';
import useDependencies from "../dependency/useDependencies";
import {Redirect, Route, Router, Switch} from "react-router-dom";

const Routes = () => {
    const {history, Profile, Task} = useDependencies()
    return <Router history={history}>
        <Switch>
            <Route path="/profile">
                <Profile/>
            </Route>
            <Route path="/task">
                <Task/>
            </Route>
            <Route>
                <Redirect to="/profile"/>
            </Route>
        </Switch>
    </Router>
}

export default Routes;
