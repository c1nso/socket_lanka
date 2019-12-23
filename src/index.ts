import {Option} from "./types";
import {stringify} from "qs";
import {uuid} from "./utils";
import {parse} from "./parse";
import {serializeMessage} from "./serialize";

export default class Socket {
    io: WebSocket = null;
    id = null;
    url: string = "";
    private option: Option = {
        query: {},
        binaryType: "blob",
        heartbeat: false,
        heartbeatDelay: 10000,
        heartbeatText: "heartbeat",
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 3000,
        reconnectionTimeOut: 5000
    };
    private heartbeatTimer = null;
    private reconnectionTimer = null;

    constructor(url, option?: Option) {
        this.url = url || "";
        if ("undefined" !== typeof option) {
            Object.keys(option).forEach(i => {
                if (option[i]) this.option[i] = option[i]
            });
        }
        this.parseURL()
    }

    parseURL() {
        const location = window.location;
        if ("" === this.url) this.url = location.protocol + '//' + location.host;
        if ("string" === typeof this.url) {
            if ('/' === this.url.charAt(0)) {
                if ('/' === this.url.charAt(1)) {
                    this.url = location.protocol + this.url;
                } else {
                    this.url = location.host + this.url;
                }
            }
            if (!/^(https?|wss?):\/\//.test(this.url)) {
                if ("undefined" !== typeof location) {
                    this.url = location.protocol + '//' + this.url;
                } else {
                    this.url = 'https://' + this.url;
                }
            }
        }
        if (/^(https?):\/\//.test(this.url)) {
            this.url = this.url.replace(/http/, "ws")
        }
        if (Object.keys(this.option.query).length > 0) {
            this.url += `?${stringify(this.option.query)}`
        }
    }

    conn() {
        this.io = new WebSocket(this.url);
        this.io.binaryType = this.option.binaryType;
        this.id = uuid(32);

        // 绑定默认事件
        if (this.option.heartbeat) {
            this.openHeartbeat()
        }
    }

    // 断开连接
    close() {
        if (2 > this.io.readyState) {
            this.io.close(1000)
        }
    }

    // 发送消息
    send(text) {
        if (this.io.readyState === 1) {
            this.io.send(serializeMessage(text));
        }
    }

    // websocket 成功
    onopen(func) {
        this.io.onopen = event => func ? func(event) : false;
    }

    // 接收消息
    onmessage(func, all = false) {
        this.io.onmessage = data => func(!all ? parse(data.data) : data)
    }

    // websocket 关闭
    onclose(func) {
        this.io.onclose = event => {
            this.resetTimer();
            this.reconnection(event);
            func ? func(event) : false
        }
    }

    // websocket 发生错误
    onerror(func) {
        this.io.onerror = event => func ? func(event) : false
    }

    // 开启心跳检测
    private openHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            this.send(this.option.heartbeatText)
        }, this.option.heartbeatDelay)
    }

    // 自动重连
    private reconnection(event) {
        if (!this.option.reconnection) return;
        this.reconnectionTimer = setInterval(() => {
            if (this.option.reconnectionAttempts <= 0 || this.io.readyState < 2) {
                clearInterval(this.reconnectionTimer);
                return;
            } else {
                this.option.reconnectionAttempts--
            }
            this.conn()
        }, this.option.reconnectionDelay)
    }

    private resetTimer() {
        clearInterval(this.heartbeatTimer);
        clearInterval(this.reconnectionTimer);
    }
}
