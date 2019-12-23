import { Message } from "./types";

// 序列化数据
export function serializeMessage(message: any): any {
    switch (typeof message) {
        case "string":
            return buildTextContent(message);
        case "object":
            return buildMessage(message);
        default:
            return message;
    }
}

// 构建信息
function buildMessage(message: Message): any {
    return JSON.stringify(message)
}

// 构建普通文本消息
function buildTextContent(message: string): any {
    return JSON.stringify(message)
}

