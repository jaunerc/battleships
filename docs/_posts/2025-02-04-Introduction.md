Hi and welcome to my blog.

Here you will find articles about my current learning project in the future.
The goal is to try out a few technologies (Vite.js, GitHub Actions, Digital Ocean).
For this purpose, a web app is being developed that allows the game [Battleship](https://en.wikipedia.org/wiki/Battleship_(game)) to be played online.

Thanks for reading, and I hope there are some interesting things for you 😄

## Project setup
I primarily chose the technology out of personal interest.
Additionally, I wanted to work with a lean tech stack without sacrificing comfort.
For this reason, I decided to use **TypeScript** and the IoC framework **Inversify** for both the frontend and backend.
To build, test, and compile TypeScript for the frontend app, **Vite** is used.
On the backend, **Node.js** and **Express** are also included.
Finally, communication between the frontend and backend will take place via WebSockets.
This allows for easy bidirectional communication.
WebSockets are also standardized and therefore well-supported by browsers.

### Arguments for the chosen technologies
* Vite: Build process, testing framework vitest, minimal configuration.
* TypeScript: Static typing, easier code maintenance.
* Inversify: Dependency injection, easy object creation and maintenance.
* Node.js: Simple server, WebSocket support.

### Reservations about the tech stack
I want to experiment with creating a web app without common frontend frameworks like Svelte, Angular, or React.
However, I fear that I will miss some conveniences.
At the very least, the app's logic should be fairly simple.
I hope this means I won't have to build too much functionality that a framework would normally provide out of the box.

## Outlook
I have already implemented a first prototype.
The source code is available as a monorepo on [GitHub](https://github.com/jaunerc/battleships).
In the next articles, I would like to provide insights into interesting implementation details.

