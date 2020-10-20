import React from 'react';
import {Redirect, Route, Router, Switch} from "react-router-dom";

const Routes = ({history, Profile, Task}) => {
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
