---
layout: post
---
When I set out to build this app, I chose the technology stack based on my personal interests and curiosity. 
In this post, I’ll walk you through the technologies I selected, why I chose them, and how they work together to bring my app to life.

## Frontend: Vite and Inversify
For the frontend, I opted for **Vite.js** with **vanilla-TypeScript**.
Vite provides a fast and minimal development experience without relying on one of the usual web frameworks. 
I wanted to keep the frontend lightweight and simple, focusing on TypeScript to ensure strong typing and maintainable code.

To further enhance the structure and maintainability of the frontend, I used Inversify, a powerful dependency injection library for TypeScript. 
Inversify promotes clean architecture by enabling loosely coupled components, which helps manage dependencies more effectively.

**Why Vite.js, TypeScript, and Inversify?**
* Vite.js: Blazing fast development server, optimized build process, and minimal configuration.
* TypeScript: Enhances code quality with static typing and ensures fewer runtime errors while maintaining simplicity.
* Inversify: Facilitates dependency injection, improving scalability and maintainability.

## Backend: Node.js + Express and Inversify
For the backend, I decided on **Node.js with Express** as the framework. 
Node.js provides a non-blocking, event-driven environment.
To further organize the backend and ensure scalability, I integrated Inversify for dependency injection and used **TypeScript** to enhance code quality and maintainability.

**Why Node.js + Express?**
* Huge package ecosystem (NPM)
* WebSockets support: Enables real-time, bidirectional communication between the server and clients.

## Wrapping up
This tech stack not only allows for rapid development but also ensures that the codebase remains clean and modular. 
The decision to avoid traditional frameworks in favor of minimal tools was driven by a desire to learn and create a truly lightweight application.

Looking back, the process has been a learning experience. 
While I’ve gained insights into structuring  web apps, some tools may not have aligned perfectly with the project’s needs. 
As I continue iterating, I’ll reassess and adjust the tech stack where necessary. 
If you’re embarking on a similar journey, be open to experimentation but also critical of how each tool fits your specific goals. 
Happy coding!

*This text was a collaboration with ChatGPT.*