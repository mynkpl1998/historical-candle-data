const axios = require("axios");
const electron = require("electron");
const tableExport = require("tableexport");

const contextBridge = electron.contextBridge;
console.log("hello from preload js")

contextBridge.exposeInMainWorld('axios', {
    get: (url, headers) => { return axios.get(url, {headers}) },
});

contextBridge.exposeInMainWorld('tableexport', {
    TableExport: (table, filename) => { return new tableExport.TableExport(table, {
        formats: ["csv"],
        filename: filename,
        exportButtons: false,
        position: "top"
    }) },
    Blob: (csv) => {
        return new Blob([csv], {
            type: 'text/csv'
        });
    },
    createObjectURL: (blob) => {
        return URL.createObjectURL(blob)
    }
});