import {snakeCase} from "lodash"

// 解析信息
export function parse(message: any): any {
    switch (typeof message) {
        case "string":
            return JSON.parse(message);
        case "object":
            if (message instanceof Blob) {
                return parseBlob(message)
            }
            return changeDataKeys(message);
        default:
            return message;

    }
}

// 解析blob数据
function parseBlob(data: Blob): any {
    let reader = new FileReader();
    reader.readAsArrayBuffer(data);
    reader.onload = function () {
        return changeDataKeys(reader.result);
    }
}

function changeDataKeys(data: any): any {
    if (data instanceof Array) {
        const arr: any[] = [];
        data.forEach(i => arr.push(changeDataKeys(i)));
        return arr
    }
    if (data instanceof Object) {
        return Object.keys(data).reduce((newData, key) => {
            newData[snakeCase(key)] = changeDataKeys(data[key]);
            return newData
        }, {});
    }
    return data;
}
