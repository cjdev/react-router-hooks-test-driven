import React from 'react';
import Routes from './navigation/Routes'
import Summary from './summary/Summary'
import createBackend from './backend/backend'
import createDatabase from "./backend/database";
import {createBrowserHistory} from 'history';
import Task from "./task/Task";
import Profile from "./profile/Profile";
import TopLevel from "./top/TopLevel";
import SummaryProvider from "./summary/SummaryProvider";

const fetchContract = fetch
const database = createDatabase(fetchContract)
const backend = createBackend(database)
const history = createBrowserHistory()
const windowContract = window
const DefaultTask = () =>
    <Task backend={backend} windowContract={windowContract}/>
const DefaultProfile = () =>
    <Profile backend={backend}/>
const DefaultRoutes = () =>
    <Routes history={history}
            Profile={DefaultProfile}
            Task={DefaultTask}/>
const DefaultSummaryProvider = ({children}) =>
    <SummaryProvider backend={backend}>{children}</SummaryProvider>
const DefaultTopLevel = () =>
    <TopLevel Routes={DefaultRoutes}
              Summary={Summary}
              SummaryProvider={DefaultSummaryProvider}/>

export default DefaultTopLevel
