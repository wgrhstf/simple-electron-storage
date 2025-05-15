
# simple-electron-storage

> A very basic JSON-based data storage for Electron Applications.

This is a very minimalistic approach, without any third party dependencies. There is no constructor, or any fancy stuff. If you look for something more sophisticated, I'd recommend you go for one of the following

- [electron-store](https://github.com/sindresorhus/electron-store)
- [electron-json-storage](https://github.com/electron-userland/electron-json-storage)
- [electron-settings](https://github.com/nathanbuchar/electron-settings)
- [electron-storage](https://github.com/Cocycles/electron-storage)

The script writes an empty `store.json` in your AppData Folder, which is used to persist Data.
Simple-electron-storage can either be used from main or renderer Process, but it __has to be initialized in main Process first__ as it uses IPC channels to retrieve the AppData folder in renderer Process.


## Installation

Install simple-electron-storage with npm

```bash
  npm install --save simple-electron-storage
```

## Usage/Examples

### In Main Process

```javascript
const my_storage = require('simple-electron-storage');
my_storage.initMainIpc();
```
This has to be called first, to initialize the IPC channels.

### In Renderer Process

```javascript
const my_storage = require('simple-electron-storage');
```
## API

All methods exist in sync and async versions.

### set(key, value)

```javascript
my_storage.set('username', 'JaneDoe');
```
or
```javascript
my_storage.setSync('username', 'JaneDoe');
```

### get(key)

```javascript
my_storage.get('username').then(value => {
    console.log(value);
});
```
or 
### getSync(key)
```javascript
const username = my_storage.getSync('username');
console.log (username) //-> 'JaneDoe'
```

### has(key)
returns true if key exists, false otherwise

```javascript
my_storage.has('username').then(exists => {
    if (exists) {
        do_something();
    }
});
```
or
```javascript
if (my_storage.hasSync('username')) {
    do_something();
}
```

### delete(key)

```javascript
my_storage.delete('username');
```
or
```javascript
my_storage.deleteSync('username');
```

### deleteStorage()

```javascript
my_storage.deleteStorage();
```
or
```javascript
my_storage.deleteStorageSync();
```

## License

simple-electron-storage is licenced under the MIT License.


