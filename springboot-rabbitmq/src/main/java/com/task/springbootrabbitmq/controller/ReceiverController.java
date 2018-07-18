package com.task.springbootrabbitmq.controller;

import com.rabbitmq.client.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeoutException;



/**
 * 消费消息类
 *
 * create by wzy on 2018/07/16
 */
@ServerEndpoint("/webSocket")
@Component
public class ReceiverController {

    @Value("${spring.rabbitmq.host}")
    private String rabbitHost;

    @Value("${spring.rabbitmq.port}")
    private int port;

    @Value("${spring.rabbitmq.username}")
    private String username;

    @Value("${spring.rabbitmq.password}")
    private String password;

    private static Logger log = LogManager.getLogger(ReceiverController.class);
    //静态变量，用来记录当前在线连接数。应该把它设计成线程安全的。
//    @Autowired
//    public TerminalService terminalServiceInWebSocket;
    //与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;
    private static CopyOnWriteArraySet<Session> sessions = new CopyOnWriteArraySet<Session>();

    private static int onlineCount = 0;

    //concurrent包的线程安全Set，用来存放每个客户端对应的MyWebSocket对象。若要实现服务端与单一客户端通信的话，可以使用Map来存放，其中Key可以为用户标识
    private static CopyOnWriteArraySet<ReceiverController> webSocketSet = new CopyOnWriteArraySet<ReceiverController>();



    /**
     * 连接建立成功调用的方法
     *
     * @param session 可选的参数。session为与某个客户端的连接会话，需要通过它来给客户端发送数据
     */
    @OnOpen
    public void onOpen(Session session) {
        this.session = session;
        sessions.add(session);
        webSocketSet.add(this);     //加入set中
        addOnlineCount();           //在线数加1
        log.info("有新连接加入！当前在线人数为" + getOnlineCount());
        String QUEUE_NAME = "closedPlace";
        try {
            //创建连接连接到MabbitMQ
            ConnectionFactory factory = new ConnectionFactory();
            //设置MabbitMQ所在主机ip或者主机名
            factory.setHost("192.168.0.250");
            factory.setPort(5672);
            factory.setUsername("admin");
            factory.setPassword("admin");
            factory.setRequestedChannelMax(500);
            factory.setConnectionTimeout(60000);
            //关键位置：制定连接池
            ExecutorService service = Executors.newFixedThreadPool(10);
            factory.setSharedExecutor(service);
            //设置自动恢复
            factory.setAutomaticRecoveryEnabled(true);
            factory.setNetworkRecoveryInterval(2);// 设置 没10s ，重试一次
            factory.setTopologyRecoveryEnabled(false);// 设置不重新声明交换器，队列等信息。
            //创建一个连接
            Connection connection = factory.newConnection();
            //创建一个频道
            Channel channel = connection.createChannel();
            //指定一个队列
            /*
                durable：true、false.true：在服务器重启时，能够存活
                exclusive ：是否为当前连接的专用队列，在连接断开后，会自动删除该队列，生产环境中应该很少用到吧。
                autodelete：当没有任何消费者使用时，自动删除该队列。this means that the queue will be deleted when there are no more processes consuming messages from it.
             */
            channel.queueDeclare(QUEUE_NAME, true, false, false, null);
            //每次从队列获取的数量,保证一次只分发一个
            channel.basicQos(1);
            log.info(" [*] Waiting for messages.");
            //监听队列
            Consumer consumer = new DefaultConsumer(channel) {
                @Override
                public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                    //处理监听得到的消息
                    String message = null;
                    try {
                        message = new String(body, "UTF-8");
                        //消息处理逻辑
                        sendMessage(message);
                    } catch (UnsupportedEncodingException e) {
                        e.printStackTrace();
                        channel.abort();
                    } finally {
                        log.info("[x] Done.");
                        channel.basicAck(envelope.getDeliveryTag(), false);
                    }
                    log.info("[x] Received '" + message + "'");
                }
            };

            //autoAck是否自动回复，如果为true的话，每次生产者只要发送信息就会从内存中删除，那么如果消费者程序异常退出，
            // 那么就无法获取数据，我们当然是不希望出现这样的情况，所以才去手动回复，每当消费者收到并处理信息然后在通知
            // 生成者。最后从队列中删除这条信息。如果消费者异常退出，如果还有其他消费者，那么就会把队列中的消息发送给其
            // 他消费者，如果没有，等消费者启动时候再次发送。
            boolean autoAck = false;
            //消息消费完成确认
            channel.basicConsume(QUEUE_NAME, autoAck, consumer);

        } catch (IOException | TimeoutException e) {
            e.printStackTrace();
        }

    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose() {
        webSocketSet.remove(this);  //从set中删除
        sessions.remove(session);
        subOnlineCount();           //在线数减1
        log.info("有一连接关闭！当前在线人数为" + getOnlineCount());
    }

    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息
     * @param session 可选的参数
     */
    @OnMessage
    public void onMessage(String message, Session session) {
        log.info("来自客户端的消息:" + message);
        //群发消息
        for (ReceiverController item : webSocketSet) {
            try {
                item.sendMessage(message);
            } catch (IOException e) {
                e.printStackTrace();
                continue;
            }
        }
    }

    /**
     * 发生错误时调用
     *
     * @param session
     * @param error
     */
    @OnError
    public void onError(Session session, Throwable error) {
        log.error("发生错误");
        error.printStackTrace();
    }

    /**
     * 这个方法与上面几个方法不一样。没有用注解，是根据自己需要添加的方法。
     *
     * @param message
     * @throws IOException
     */
    public void sendMessage(String message) throws IOException {
        //阻塞式的(同步的)
        if (sessions.size() != 0) {
            for (Session s : sessions) {
                if (s != null) {
                    s.getBasicRemote().sendText(message);
                }
            }
        }

        //非阻塞式的（异步的）
//        this.session.getAsyncRemote().sendText(message);
        log.info("[x] 推送消息"+message);
    }

    public static synchronized int getOnlineCount() {
        return onlineCount;
    }

    public static synchronized void addOnlineCount() {
        ReceiverController.onlineCount++;
    }

    public static synchronized void subOnlineCount() {
        ReceiverController.onlineCount--;
    }

}
