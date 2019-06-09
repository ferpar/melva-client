### React Basic Template

This template is meant to be a basic starting point for a new react app with only the most basic features so we can keep track of everything that's been added to the project.

This also includes:

- @babel/plugin-proposal-class-properties => to avoid having to call the constructor and super when declaring a state object.

- html-webpack-plugin => to generate the production index.html from a template at our src

It may be improved by: 

- Externalizing dependencies via CDN (react & react-dom)
- Targeting specific browsers with babel-preset-env & babel-polyfill
- adding eslint, prettier, & husky
- Configuring sass @ webpack
- Adding babel-polyfill if not specifically targeting newer browsers: for async/await support @ webpack
