# Staffing App

This is a React Training Repo. It contains a React APP featuring Router, Redux, Thunks, Axios and more connected to a simple JSON Server

## Installation

`npm install` or `yarn install`

## Development

Run `yarn start` - that starts react-scripts, scss watcher and the json-server

## Production

- Update `src/config.js` with correct database host and desired year
- Run `yarn build` to create an optimized production build
- Copy created `build` folder to the server
- Run `yarn json-server` on the server to start JSON Server


## Docker JSON Server
### building docker images
`docker build -t virtualidentity/staffingserver .`
`docker build -f Dockerfile-FE -t virtualidentity/staffingfrontend .`

### starting docker server instances
`docker run -p 5544:5544 -v YOUR_PATH/db:/app/db virtualidentity/staffingserver`

`docker run -p 5000:5000 virtualidentity/staffingfrontend`
