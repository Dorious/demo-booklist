# Book List Demo

Finished all task besides:
"Indicate books in the "finance" genre, published on the last Friday of any month"
There are no books with Finance genre :/

## Used techs/libs
1. TypeScript.
2. React (with hooks and custom Reducer). Thought to use sessionStorage to keep state for faster develop.
3. create-react-app generator.
4. Sass + CSS Modules.
5. react-virualized for scrollable table.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Haven't focused on testing that is why this will blow.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

Use `serve` or `http-server` to run production build.

```
$ npm install -g http-server
$ http-server build/
```

## TODO
1. Testing and code documentation.
2. Sending ~27MB gzipped over the net is probably not the best idea. That is why data.json should be sent by the API and later use `InfiniteLoader` compontent inside `react-virtualized` Table.
