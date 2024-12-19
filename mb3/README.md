# Collaborative Reality Editor

## How it works

- Write and share thoughts, like a TODO list
- Web app for browser
- Through user editing, and automated data analysis, actionable input evolves into autonomous agents that can
  achieve results
- Stores private user and public community data in the browser (IndexedDB)
- Private objects are not shared (new objects are, by default, private)
- Analysis work is voluntarily completed by capable participating nodes, facilitating matching

## Search Paradigm

+ Shared objects can be matched, and these matches return as notifications to the user and are organized as replies-to
  the source object
+ Objects containing indefinite properties are like persistent search queries.
+ Imaginary objects (which act as partial queries) persist until explicitly deleted - because they can represent and
  track the user's intentions.
+ Queries in the conventional Web Search paradigm, by contrast, are weak, disposable, and ephemeral.
+ JSON Semantic representation: Language Models can translate natural language objects to JSON to enable _semantic
  matching_ *at scale*.
+ Objects may include definite and indefinite semantic values, referenced in a community schema
   + _Definite_ - describes reality as it is. Empirical knowledge, measurements, facts, etc.
   + _Indefinite_ - (for queries/hypothetical/imaginary objects) describes conditions/acceptability criteria that are
     tested for matching real objects.

## UI

- Main View - displays content, such as an object being viewed, or edited
- Sidebar
   + Menu
   + Object list:  When an object is clicked, opens in view. If user is the author, then it's editable, otherwise, it's
     read-only
- Views
   + **Me**: user profile (user ID, name, etc...); starts as random Anonymous.
   + **Friends**: with statuses
   + **Network**: Peers, Traffic, etc.
   + **Database**: statistics, table view (with sort and filter)

# Implementation

*   **Form-factors**: Web client, Server (supernode, serves 'enhanced' web client that uses advanced node.js system access), Desktop (Electron.js)
*   **Language**: TypeScript/JavaScript (ES6+), object-oriented architecture
*   **Realtime Sync**: Uses 'yjs' for realtime CRDT WebRTC data synchronization
*   **Build**: 'vite'
*   **Testing**: 'vitest'

# Coding

* Keep the code clear and compact.
* Use comments sparingly, prefering self-documenting code. Use the latest Javascript language features. Involve no more
  than a few helpful common utility libraries.
* Where possible, explore ways to generate and minimize the necessary code through clever object-oriented design and
  metaprogramming.

## Project Structure

- `src/`: Source code organized by layers, including UI components
- `tests/`: Unit and integration tests
- `desktop/`: Electron-based desktop application

## Network Architecture

The application consists of the following components:

- **Web Client:** The primary user interface, built with jQuery. It interacts with both the signaling server and the backend server.
- **Signaling Server:** Facilitates real-time communication between peers using `y-webrtc`.
- **Backend Server:** Handles user authentication, data persistence, and advanced collaboration features. It exposes REST APIs for the web client and desktop app to interact with.
- **Desktop App:** A wrapper around the web client, built with Electron.js. It provides a standalone application experience and can leverage desktop-specific features.
- **Shell:** Text console REPL, useful for testing and remote access.

**Interactions:**

1. **Web Client <-> Signaling Server:** The web client uses `y-webrtc` to connect to the signaling server for real-time synchronization of collaborative data (CRDTs).
2. **Web Client <-> Backend Server:** The web client communicates with the backend server via REST APIs for user authentication, data persistence, and other server-side operations.
3. **Desktop App <-> Backend Server:** The desktop app, through the embedded web client, interacts with the backend server in the same way as the standalone web client.

# Use

## Install
   ```
   npm install
   ```

## Server
`npm run server` starts the backend server using Express.js on port 3000.


## Unit Tests
```
npm run test
```


## Development
```
npm run dev
```


## Signaling Server

1. Run `npm run signal`
    - This starts the signaling server using `y-webrtc` on port 4444.
    - You can change the port by setting the `PORT` environment variable.


# License
[AGPL](LICENSE)
