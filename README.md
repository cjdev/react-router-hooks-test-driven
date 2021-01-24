# React Router Hooks (test driven)

## For the onboarding exercise, make sure
- [ ] The readme explains to run it
- [ ] It meets all the requirements
- [ ] It is testable
  - the dependencies are properly inverted
  - not using lifecycle methods
- [ ] Async calls are working reliably
  - For example, when I add a profile or task, it immediately shows up without a refresh, every time

## Requirements
- [ ] Profiles
    - [ ] Display all profiles
    - [ ] Add a profile
    - [ ] Remove a profile
    - [ ] Navigate to tasks associated with a particular profile
- [ ] Tasks
    - [ ] Display all tasks for a particular profile
    - [ ] Add a task
    - [ ] Mark a task as complete
    - [ ] Clear all completed tasks
    - [ ] Navigate to profiles
- [ ] Summary
    - [ ] Display the total number of profiles
    - [ ] Display the total number of tasks
    - [ ] Be visible on every page
    - [ ] Immediately update as the underlying data changes
- [ ] Navigation
    - [ ] Profiles and Tasks are displayed on different pages
    - [ ] Bookmarked pages should work
    - [ ] Back button should work

## Intent
You should know how write a front end application that handles all of the following in a testable way
- presentation
- state
- side effects
- multiple pages
- back button
- an event in one component triggering a state change in another, without coupling those components together

This is a fully test driven example project that shows one way of accomplishing this.

## Style
- Local state rather than centralized state
- useState() hook rather than useReducer() hook
- Uses [no-arg constructors](https://gitlab.cj.dev/training/react-router-hooks-test-driven/tree/no-arg-constructor) rather than a context hook as a service locator pattern or dependency injection with property drilling
- Vanilla javascript with jsx extension rather than Typescript, Purescript, or Kotlin

## Alternative Styles
- See the branch for how to [use a context as a service locator](https://gitlab.cj.dev/training/react-router-hooks-test-driven/tree/context-service-locator) 
- You can use the useReducer() hook rather than the useState() hook
- It is possible to put all state in a single global object, managed by a hierarchy of reducers.
  This has the advantage of making individual components so simple that all they do is render properties and fire events.

Any style that facilitates test driven design equally well is equally valid,
and any style that is harder to test should be changed in its design until it is at least as easy to test as the well-known and well-documented test driven styles.

## Original Readme File (generated)
[README-generated.md](README-originally-generated.md)

## Before running
- `npm install`
- Make sure [webdb](https://github.com/cjdev/webdb) is running, see instructions in that project

## Scripts
- `./sample-data.sh`
    - create sample data for the application
- `./prepare.sh`
    - fetch dependencies for the application
- `./run.sh`
    - run the application
- `./test.sh`
    - test the application
- `./coverage.sh`
    - test coverage report for the application
    
## How this project was created

### Create project and add dependencies
```bash
npx create-react-app react-router-hooks-test-driven
cd react-router-hooks-test-driven
npm install ramda --save
npm install react-router-dom --save
npm install http-proxy-middleware --save
npm install history@^4 --save
```

### Test coverage setup
Add the following entry to `package.json`

```json
{
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/*",
      "!<rootDir>/node_modules/",
      "!src/test-util/*"
    ],
    "coverageReporters": [
      "text"
    ]
  }
}
```

- In general, collect test coverage from "src/**/*.{js,jsx,ts,tsx}"
- Since business logic is being kept out the root directory, exclude "!src/*"
- No need to test third party modules, so exclude "!<rootDir>/node_modules/"
- Don't need to test utilities that are only used in tests, so exclude "!src/test-util/*" 

### Proxy setup
Create file `src/setupProxy.js`, with the following contents

```javascript
const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    const options = {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
            '^/proxy/': '/',
        }
    };
    app.use(
        '/proxy/',
        createProxyMiddleware(options)
    );
};
```

The idea here is to be specific about which http paths should render something from the source directory vs. a proxy to elsewhere.
This helps prevent urls from conflicting in case a path to a proxied resource happens to match a path to a resource in the src directory.
The source code adds the 'proxy' prefix indicating this is a request that should be proxied,
but when proxying out externally, the proxy middleware rewrites the url, removing the proxy prefix.

### Css reset
Add the file [reset.css](http://meyerweb.com/eric/tools/css/reset/),
and import it from index.js `import './reset.css'`

The idea here is to preserve a consistent presentation in spite of different browser css defaults,
and be more explicit and intentional about what css styles are applied

## Infinite Recursion on useEffect explained
[How to Fix the Infinite Loop Inside “useEffect” (React Hooks)](https://medium.com/@andrewmyint/infinite-loop-inside-useeffect-react-hooks-6748de62871)

## Technology Stack
- [React](https://reactjs.org/)
- [Ramda](https://ramdajs.com/)
- [React Router](https://reactrouter.com/)
    - [react-router-dom](https://www.npmjs.com/package/react-router-dom)
- [history](https://github.com/ReactTraining/history/)
- [Jest](https://jestjs.io/)
    - [expect api](https://jestjs.io/docs/en/expect)
- [Testing Library](https://testing-library.com)
    - [queries](https://testing-library.com/docs/dom-testing-library/api-queries)
- http-proxy-middleware
    - https://github.com/chimurai/http-proxy-middleware
    - https://www.npmjs.com/package/http-proxy-middleware
