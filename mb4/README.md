Implement the following as a complete 1-file Node.JS Text-UI console application.

Use mature open-source dependencies, carefully chosen to facilitate and simplify implementation.
--UI: 'blessed'
--CRDT: 'yjs'

----

# Collaborative Reality Editor

## How it works

- Write and share thoughts, like a TODO list
- Through user editing, and automated data analysis, actionable input evolves into autonomous agents that can
  achieve results
- Stores private user and public community data in the browser (IndexedDB)
- Private objects are not shared (new objects are, by default, private)
- Analysis tasks voluntarily completed by capable participating nodes, facilitating matching
- Decentralized P2P network + CRDT (realtime synchronization)

## Search Paradigm

+ Shared objects can be matched, and these matches return as notifications to the user and are organized as replies-to
  the source object
+ Objects containing indefinite properties are like persistent search queries.
+ Imaginary objects (which act as partial queries) persist until explicitly deleted - because they can represent and
  track the user's intentions.
+ Queries in the conventional Web Search paradigm, by contrast, are weak, disposable, and ephemeral.
+ JSON Semantic representation: Language Models can translate natural language objects to JSON to enable _semantic
  matching_ *at scale*.
+ Objects essentially consist of a set of definite and indefinite semantic values, referenced in a community schema
    + _Definite_ - describes reality as it is. Empirical knowledge, measurements, facts, etc.
    + _Indefinite_ - (for queries/hypothetical/imaginary objects) describes conditions/acceptability criteria that are
      tested for matching real objects.

## UI

- Sidebar
    + Menu: options and program actions
    + Object list:  When an object is clicked, opens in view. If user is the author, then it's editable, otherwise, it's
      read-only
- Main View - displays content, such as an object being viewed, or edited
    - Views
        + **Object**: view/edit an object.  Shows object's replies are displayed.
        + **Me**: user profile (user ID, name, etc...); starts as random Anonymous.
        + **Friends**: with statuses, add/remove
        + **Network**: Network activity view and control: peers, traffic, etc.  Enable/disable individual network protocols, add/remove bootstrap servers, etc.
        + **Database**: statistics, table view (with sort and filter), primarily for debugging
- Passive Notifications
    + Events which the user may be interested in knowing about, such as receiving match replies, or friend activity.


# Coding

* Keep the code clear and compact.
* Use comments sparingly, prefering self-documenting code. Use the latest Javascript language features. Involve no more
  than a few helpful common utility libraries.
