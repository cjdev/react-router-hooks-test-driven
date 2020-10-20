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
const TaskNoArg = () => Task({backend, windowContract})
const ProfileNoArg = () => Profile({backend})
const RoutesNoArg = () => Routes({history, Profile: ProfileNoArg, Task: TaskNoArg})
const TopLevelNoArg = () => TopLevel({Routes: RoutesNoArg, Summary})
const SummaryProviderNoArg = ({children}) => SummaryProvider({backend, children})

export {TopLevelNoArg, SummaryProviderNoArg}
