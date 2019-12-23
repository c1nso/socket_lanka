# web_socket

WebSocket 基础封装



### 使用示例 VUE
```$xslt
import Socket from "socket_lanka"
 export default {
        name: 'app',
        components: {
            HelloWorld
        },
        data() {
            return {
                io: null,
                times: 0
            }
        },
        created() {
            this.io = new Socket("ws://127.0.0.1:9527/chat?account=aabbcc", {
                heartbeat: true,
            });
            this.io.conn();
            this.io.onopen(event => console.log(event));
            this.io.onmessage(event => {
                console.log(this.times++, event)
            });
            this.io.onclose(event => console.log(event));
            this.io.onerror(event => console.log(event));
        },
        methods: {
            sendMessage() {
                // 发送普通文字 1111
                // io.send({
                // 	attach: "",
                // 	content: "哈哈哈哈哈哈哈",
                // 	sender_id: "hello",
                // 	receiver_id: "330",
                // 	message_type: 0,
                // 	release_time: 123123123123,
                // });
                // 发送注单信息
                this.io.send({})
            },
            closeSto() {
                console.log(2333, "我自闭了");
                this.io.close();
            }
        }
    }
```
