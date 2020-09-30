# React Router Hooks (test driven)

## Original Readme File (generated)
[README-generated.md](README-generated.md)

## Notes about creating the project
npx created a react project with out-of-date versions of testing-library modules.
To see how out of date you can run `npm outdated`.
This makes it very difficult to learn testing-library.
I took each out of date dependency and updated it to the latest (see the "How this project was created" section).

## How this project was created
```bash
npx create-react-app react-router-hooks-test-driven
cd react-router-hooks-test-driven
npm outdated
npm install --save-dev @testing-library/jest-dom@latest
npm install --save-dev @testing-library/react@latest
npm install --save-dev @testing-library/user-event@latest
```
