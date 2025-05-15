const fs = require('fs');
const path = require('path');

let filePath = null;

function getUserDataPath() {
    try {
        const { ipcRenderer } = require('electron');
        return ipcRenderer.sendSync('getUserDataPath');
    } catch (_) {
        const { app } = require('electron');
        return app.getPath('userData');
    }
}

function ensureFilePath() {
    if (!filePath) {
        filePath = path.join(getUserDataPath(), 'store.json');
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify({}, null, 2), 'utf8');
        }
    }
}

function _readFileSync() {
    ensureFilePath();
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

function _readFileAsync() {
    ensureFilePath();
    return fs.promises.readFile(filePath, 'utf8').then(JSON.parse);
}

function _writeFileSync(data) {
    ensureFilePath();
    try {
        const json = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, json, 'utf8');
    } catch (err) {
        console.error("Failed to stringify data for JSON store:", err);
    }
}

async function _writeFileAsync(data) {
    ensureFilePath();
    try {
        const json = JSON.stringify(data, null, 2);
        await fs.promises.writeFile(filePath, json, 'utf8');
    } catch (err) {
        console.error("Failed to stringify data for JSON store:", err);
    }
}

function deleteStorageSync() {
    ensureFilePath();
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        filePath = null;
    }
}

async function deleteStorageAsync() {
    ensureFilePath();
    if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        filePath = null;
    }
}

module.exports = {
    initMainIpc() {
        try {
            const { app, ipcMain } = require('electron');
            ipcMain.on('getUserDataPath', (event) => {
                event.returnValue = app.getPath('userData');
            });
        } catch (_) {
            // Not in main process
        }
    },

    // SYNC API
    getSync(key) {
        const data = _readFileSync();
        return data[key];
    },

    setSync(key, value) {
        const data = _readFileSync();
        data[key] = value;
        _writeFileSync(data);
    },

    hasSync(key) {
        const data = _readFileSync();
        return Object.prototype.hasOwnProperty.call(data, key);
    },

    deleteSync(key) {
        const data = _readFileSync();
        delete data[key];
        _writeFileSync(data);
    },

    deleteStorageSync,

    // ASYNC API
    async get(key) {
        const data = await _readFileAsync();
        return data[key];
    },

    async set(key, value) {
        const data = await _readFileAsync();
        data[key] = value;
        await _writeFileAsync(data);
    },

    async has(key) {
        const data = await _readFileAsync();
        return Object.prototype.hasOwnProperty.call(data, key);
    },

    async delete(key) {
        const data = await _readFileAsync();
        delete data[key];
        await _writeFileAsync(data);
    },

    deleteStorage: deleteStorageAsync
};