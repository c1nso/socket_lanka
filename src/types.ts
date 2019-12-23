export interface Option {
    query?: object,
    binaryType?: BinaryType,
    heartbeat?: boolean, // 心跳检测
    heartbeatDelay?: number, // 心跳间隔
    heartbeatText?: string, // 心跳间隔
    reconnection?: boolean, // 是否重连
    reconnectionAttempts?: number, // 重连次数
    reconnectionDelay?: number, // 重建间隔
    reconnectionTimeOut?: number, // 超时时间
}

// 信息内容
export interface Message {
    [propName: string]: any;
}


