# Upcyclr
## _COMP 584 Project_

Upcyclr is a website that lets users submit and share their Upcycling projects. ✨

<img src="https://raw.githubusercontent.com/anrami/upcyclr/main/Homepage.png">

## Features

- CRUD operations from mongodb database
- File upload with drag and drop
- Projects sorted by category
- User Authorization and Authentication

## Tech

Upcyclr uses a number of technologies work properly:

- [node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework
- [EJS] - for templating needs
- [Mongoose] - database
- [Bcrypt] - hashing passwords
- [JavaScript] 
- [HTML/CSS] 

## Installation

Upcyclr requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd upcyclr
npm i
npm run devStart
```

It also needs MongoDB and to install it run:
```sh
sudo apt-get install mongodb
```

## Deploy the app locally
```sh
mongod
```
In another terminal run
```sh
npm run devStart
```

You should now be able to see app on localhost:3000 if everything installed properly

```sh
localhost:3000
```

## License

MIT
