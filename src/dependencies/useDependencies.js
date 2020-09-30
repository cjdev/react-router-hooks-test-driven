import {useContext} from 'react';

import DependencyContext from "./DependencyContext";

const useDependencies = () => useContext(DependencyContext)

export default useDependencies;
