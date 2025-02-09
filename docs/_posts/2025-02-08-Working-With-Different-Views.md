Building frontend applications often involves managing multiple views.
In this post, I'll walk you through how I handled multiple views in my frontend app.

## Basic Concept
The web app is divided into multiple views.
Each view implements a `show` function that replaces the content of a div element.
When switching views, the visible part of the DOM is overwritten accordingly.
The router functions of typical SPA frameworks, of course, allow for more elegant solutions.
However, for this app, this concept is completely sufficient.
There is only one path for users through the app with a handful of views.
For the view classes, I have extracted a corresponding `interface`.

```javascript
export interface View {
    show: (appDiv: HTMLDivElement) => void
}
```

To display the view, it is sufficient to execute the `show` function and pass the app-div.

```javascript
const startView = container.get<View>('StartView')

startView.show(document.querySelector<HTMLDivElement>('#app')!)
```

The `index.html` file is ultimately very short and almost corresponds to the standard Vite HTML template.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Battleships</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

## Manage different views
To manage different views effectively, Inversify is utilized.
Each view is structured as a class. 
The next view in the sequence is injected via the constructor, leveraging Inversify's dependency injection capabilities to manage dependencies and transitions between views.
The Inversify configuration file is used to define a container that binds all view instances. 
This approach ensures that each view is readily available and can be dynamically injected where needed.

```javascript
cconst container = new Container()
container.bind<View>('StartView').to(StartView)
container.bind<View>('UsernameView').to(UsernameView)
container.bind<View>('PlaceShipsView').to(PlaceShipsView)
container.bind<View>('GameView').to(GameView)
```

To utilize dependency injection with Inversify, the view class requires the @injectable annotation. 
Constructor injection is achieved by applying the @inject annotation to the parameters that need to be resolved by the container.

```javascript
@injectable()
export class StartView implements View {
    constructor(@inject('UsernameView') private usernameView: View) {}
}
```

## Manage state between views
To achieve minimal state management, a single state class can be shared across different views. 
The state object is also injectable and can be managed using Inversify.

```javascript
export interface State {
    playerId?: string
    seatId?: SeatId
    username?: string
    fleet?: FieldPosition[][]
    fireLogs?: FireLogs
}

@injectable()
export class StateImpl implements State {}
```

## Conclusion
This blog post explores techniques for managing multiple views and shared state in a minimalistic way. The key takeaways are:

### 1. Simplified View Management:
* View switching is achieved through direct DOM manipulation.
* Views adhere to a shared interface with a show function, dynamically replacing content based on user interactions.

### 2. Dependency Injection for Views:
* Inversify is used to inject and manage dependencies between views.
* A centralized configuration binds view instances, enabling seamless transitions.

### 3. Minimal State Management:
* Single shared state class keeps data consistent across views.
* The state object is injectable, leveraging Inversify for efficient management.

However, it also highlights potential limitations in scalability and flexibility for larger projects, such as the loss of data after a page refresh and the dependency of each view on its successor. 
These challenges can lead to inconsistent user experiences unless additional mechanisms, like persistent storage or a more decoupled view architecture, are implemented.
