import blessed from 'blessed';
import { EventEmitter } from 'events';

class UI extends EventEmitter {
    constructor(core) {
        super();
        this.core = core;
        this.screen = blessed.screen({ smartCSR: true, title: 'Collaborative Reality Editor' });

        this.sidebar = new UI.Sidebar(this);
        this.mainView = new UI.MainView(this);
        this.notificationBox = new UI.NotificationBox(this);

        this.screen.append(this.sidebar.box);
        this.screen.append(this.mainView.box);
        this.screen.append(this.notificationBox.box);

        this.objectView = new UI.Views.ObjectView(this);
        this.meView = new UI.Views.MeView(this);
        this.friendsView = new UI.Views.FriendsView(this);
        this.networkView = new UI.Views.NetworkView(this);
        this.databaseView = new UI.Views.DatabaseView(this);

        this.initEventHandlers();

        this.screen.key(['escape', 'C-c'], () => process.exit(0));
        this.sidebar.select(0);
        this.sidebar.focus();
        this.screen.render();
    }

    initEventHandlers() {
        this.core.on('notify', this.notify.bind(this));
        this.sidebar.on('select', this.handleSidebarSelect.bind(this));

        const network = this.core.plugins.getEnabledPlugins('networks').find(p => p instanceof Networks.Libp2pNetwork);
        if (network) {
            network.on('status', (status) => this.notify(`Network Status: ${status}`));
            network.on('peers', (peers) => this.notify(`Network Peers: ${peers.length}`));
        }
    }

    notify(message) {
        this.notificationBox.log(message);
    }

    handleSidebarSelect(el, index) {
        const actions = [
            () => this.mainView.showForm('New Object Content:', content => this.objectView.display(this.core.newObject(content))),
            this.mainView.selectObject.bind(this.mainView),
            () => this.meView.display(),
            () => this.friendsView.display(),
            () => this.networkView.display(),
            () => this.databaseView.display()
        ];
        actions[index]?.call(this);
        this.screen.render();
    }
}

UI.Sidebar = class {
    constructor(ui) {
        this.ui = ui;
        this.core = ui.core;
        this.box = blessed.list({
            top: 0,
            left: 0,
            width: '25%',
            height: '100%',
            items: ['New Object', 'Object', 'Me', 'Friends', 'Network', 'Database'],
            keys: true,
            style: {
                selected: { bg: 'blue' },
                border: {
                    type: 'line',
                    fg: 'white'
                }
            }
        });

        this.box.on('select', (el, index) => this.ui.emit('sidebar-select', el, index));
    }

    on(event, handler) {
        if (event === 'select') {
            this.box.on('select', handler);
        }
    }

    select(index) {
        this.box.select(index);
    }

    focus() {
        this.box.focus();
    }
}

UI.MainView = class {
    constructor(ui) {
        this.ui = ui;
        this.core = ui.core;
        this.box = blessed.box({
            top: 0,
            left: '25%',
            width: '75%',
            height: '90%',
            scrollable: true,
            alwaysScroll: true,
            scrollbar: {
                ch: ' ',
                inverse: true
            },
            keys: true,
            vi: true,
            mouse: true
        });
    }

    setContent(content) {
        this.box.setContent(content);
        this.ui.screen.render();
    }

    showForm(content, onSubmit, value = '') {
        const form = blessed.form({
            parent: this.box,
            keys: true,
            left: 'center',
            top: 'center',
            width: '50%',
            height: '50%',
            bg: 'green',
            content: content
        });

        const input = blessed.textarea({
            parent: form,
            top: 2,
            left: 2,
            width: '90%',
            height: '80%',
            name: 'input',
            inputOnFocus: true,
            value: value
        });

        const submitButton = blessed.button({
            parent: form,
            mouse: true,
            keys: true,
            shrink: true,
            padding: {
                left: 1,
                right: 1
            },
            left: 'center',
            bottom: 1,
            name: 'submit',
            content: 'Submit',
            style: {
                bg: 'blue',
                focus: {
                    bg: 'red'
                },
                hover: {
                    bg: 'red'
                }
            }
        });

        submitButton.on('press', function() {
            form.submit();
        });

        form.on('submit', function(data) {
            onSubmit(data.input);
            form.destroy();
            this.ui.screen.render();
        }.bind(this));

        input.focus();
        this.ui.screen.render();
    }

    selectObject() {
        const objectList = blessed.list({
            parent: this.ui.screen,
            label: 'Select an Object',
            top: 'center',
            left: 'center',
            width: '50%',
            height: '50%',
            keys: true,
            vi: true,
            mouse: true,
            style: {
                selected: {
                    bg: 'blue'
                }
            },
            items: Array.from(this.core.objects.keys())
        });

        objectList.focus();
        this.ui.screen.render();

        objectList.on('select', (el, index) => {
            this.ui.objectView.display(objectList.getItem(index).content);
            objectList.destroy();
            this.ui.screen.render();
        });

        objectList.on('cancel', () => {
            objectList.destroy();
            this.ui.screen.render();
        });
    }
}

UI.NotificationBox = class {
    constructor(ui) {
        this.ui = ui;
        this.core = ui.core;
        this.box = blessed.log({
            bottom: 0,
            left: '25%',
            width: '75%',
            height: '10%',
            border: { type: 'line' },
            label: 'Notifications',
            scrollable: true,
            alwaysScroll: true,
            scrollbar: {
                ch: ' ',
                inverse: true
            },
            style: {
                border: {
                    fg: '#f0f0f0'
                },
                label: {
                    fg: '#ffffff'
                }
            },
            keys: true,
            vi: true,
            mouse: true
        });
    }

    log(message) {
        this.box.log(message);
    }
}

UI.Views = class {
    static ObjectView = class {
        constructor(ui) {
            this.ui = ui;
            this.core = ui.core;
            this.mainView = ui.mainView;
        }

        display(objectId) {
            const view = this.mainView;
            view.setContent('');
            const obj = this.core.get(objectId);
            if (!obj) {
                view.setContent(`Object ${objectId} not found.`);
                return;
            }

            const isAuthor = obj.get('author') === this.core.me();
            view.box.pushLine(`Author: ${obj.get('author')}`);
            view.box.pushLine(`Content: ${obj.get('content')}`);
            view.box.pushLine(`Timestamp: ${new Date(obj.get('timestamp')).toLocaleString()}`);

            if (obj.has('tags'))
                view.box.pushLine(`Tags: ${obj.get('tags').join(', ')}`);

            if (obj.has('sentiment'))
                view.box.pushLine(`Sentiment: ${obj.get('sentiment')}`);

            view.box.pushLine('');

            const buttons = [];
            if (isAuthor) {
                const editButton = this.createButton('Edit', 0, () =>
                    this.mainView.showForm('Edit Object Content:', content => {
                        this.core.updateObject(objectId, content);
                        this.display(objectId);
                    }, obj.get('content')), { parent: view.box });
                buttons.push(editButton);
            }

            const replyButton = this.createButton('Reply', buttons.length, () =>
                this.mainView.showForm('Reply Content:', content => {
                    this.core.newObject(content, true, objectId);
                    this.display(objectId);
                }), { parent: view.box });
            buttons.push(replyButton);

            if (isAuthor) {
                const deleteButton = this.createButton('Delete', buttons.length, () => {
                    this.core.deleteObject(objectId);
                    this.mainView.setContent('Object deleted.');
                }, { parent: view.box });
                buttons.push(deleteButton);
            }

            buttons.forEach(b => view.box.append(b));

            const repliesBox = this.createBox('Replies', { parent: view.box, top: buttons.length > 0 ? buttons.length + 3 : 3 });
            view.box.append(repliesBox);

            const replyList = obj.get('replies') || [];
            replyList.forEach(replyId => {
                const reply = this.core.get(replyId);
                if (reply) {
                    const replyBox = blessed.box({
                        content: `${reply.get('author')}: ${reply.get('content')}\n`,
                    });
                    replyBox.on('click', () => this.display(replyId));
                    repliesBox.append(replyBox);
                }
            });
        }

        createButton(label, index, onPress, options = {}) {
            const button = blessed.button({
                mouse: true,
                keys: true,
                shrink: true,
                padding: { left: 1, right: 1 },
                left: 1 + (index * 10),
                name: label.toLowerCase(),
                content: label,
                style: { bg: 'green', focus: { bg: 'blue' }, hover: { bg: 'blue' } },
                ...options
            });
            button.on('press', onPress.bind(this));
            return button;
        }

        createBox(label, options = {}) {
            return blessed.box({
                label,
                border: { type: 'line' },
                scrollable: true,
                alwaysScroll: true,
                scrollbar: { ch: ' ', inverse: true },
                keys: true,
                vi: true,
                mouse: true,
                ...options
            });
        }
    }

    static MeView = class {
        constructor(ui) {
            this.ui = ui;
            this.core = ui.core;
            this.mainView = ui.mainView;
        }

        display() {
            const view = this.mainView;

            const userData = this.core.userData();
            const profile = this.core.user.getProfile();

            let content = `User ID: ${userData.id}\nUser Name: ${userData.name}\n`;
            if (profile) {
                content += `Profile:\n`;
                for (const key in profile) {
                    content += `  ${key}: ${profile[key]}\n`;
                }
            }

            view.setContent(content);
        }
    }

    static FriendsView = class {
        constructor(ui) {
            this.ui = ui;
            this.core = ui.core;
            this.mainView = ui.mainView;
        }

        display() {
            const view = this.mainView;
            view.setContent('Friends View');
        }
    }

    static NetworkView = class {
        constructor(ui) {
            this.ui = ui;
            this.core = ui.core;
            this.mainView = ui.mainView;
        }

        display() {
            const view = this.mainView;
            const network = this.core.plugins.getEnabledPlugins('networks').find(p => p instanceof Networks.Libp2pNetwork);
            if (network) {
                view.setContent(`
                    Connection Status: ${network.getConnectionStatus()}
                    Peers: ${network.getPeers().length}
                    Traffic: Incoming: ${network.getTraffic().incoming}, Outgoing: ${network.getTraffic().outgoing}
                `);
            } else {
                view.setContent('No network connection.');
            }
        }
    }

    static DatabaseView = class {
        constructor(ui) {
            this.ui = ui;
            this.core = ui.core;
            this.mainView = ui.mainView;
        }

        display() {
            const view = this.mainView;
            view.setContent('Database View');
        }
    }
}

export default UI;