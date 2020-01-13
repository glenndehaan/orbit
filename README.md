# Orbit

A simple telemetry system to monitor your remote applications

[![Snap Status](https://build.snapcraft.io/badge/glenndehaan/orbit.svg)](https://build.snapcraft.io/user/glenndehaan/orbit) [![orbit](https://snapcraft.io//orbit/badge.svg)](https://snapcraft.io/orbit)

## Structure
- ES6
- Next.JS
- MongoDB
- Bootstrap

## Install
- Install MongoDB 3.6 or higher on your machine.
- Install the app via snapd:

[![Get it from the Snap Store](https://snapcraft.io/static/images/badges/en/snap-store-white.svg)](https://snapcraft.io/orbit)

- Open up a browser and go to http://127.0.0.1:43001

## Config
The default snap config can be found here:
```
/var/snap/orbit/common/config.json
```

## Log
The log can be found here:
```
/var/snap/orbit/common/orbit.log
```

Additional snap logs can be accessed by running this command:
```
sudo journalctl -fu snap.orbit.orbit-server
```

## Service
Snap installs a service by default. To get the status of the app run this command:
```
service snap.orbit.orbit-server status
```

To restart the app:
```
service snap.orbit.orbit-server restart
```

## Orbit Clients
Below is an overview of all tested Orbit Clients:
- NodeJS, Javascript: https://github.com/glenndehaan/orbit-js-client

## Snapcraft Docs
- https://tutorials.ubuntu.com/tutorial/build-a-nodejs-service
- https://forum.snapcraft.io/t/issue-with-nodejs-plugin-when-using-base-keyword/11109/12

## License

MIT
