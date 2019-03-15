package com.xiaoji.duan.ann;

import org.apache.commons.lang3.StringUtils;

import io.vertx.amqpbridge.AmqpBridge;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.eventbus.Message;
import io.vertx.core.eventbus.MessageConsumer;
import io.vertx.core.eventbus.MessageProducer;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.ext.web.client.WebClient;
import io.vertx.rabbitmq.RabbitMQClient;
import io.vertx.rabbitmq.RabbitMQOptions;

// 综合通知服务
public class MainVerticle extends AbstractVerticle {

	private WebClient client = null;
	private AmqpBridge bridge = null;
	private MongoClient mongodb = null;
	private RabbitMQClient rabbitmq = null;

	@Override
	public void start(Future<Void> startFuture) throws Exception {
		client = WebClient.create(vertx);

		JsonObject config = new JsonObject();
		config.put("host", "mongodb");
		config.put("port", 27017);
		config.put("keepAlive", true);
		mongodb = MongoClient.createShared(vertx, config);

		bridge = AmqpBridge.create(vertx);

		bridge.endHandler(handler -> {
			connectStompServer();
		});

		connectStompServer();

		RabbitMQOptions rmqconfig = new RabbitMQOptions(config().getJsonObject("rabbitmq"));

		rabbitmq = RabbitMQClient.create(vertx, rmqconfig);
		
		rabbitmq.start(handler -> {
			if (handler.succeeded()) {
				System.out.println("rabbitmq connected.");
			} else {
				System.out.println("rabbitmq connect failed with " + handler.cause().getMessage());
			}
		});
	}

	private void connectStompServer() {
		bridge.start(config().getString("stomp.server.host", "sa-amq"),
				config().getInteger("stomp.server.port", 5672), res -> {
					if (res.failed()) {
						res.cause().printStackTrace();
						connectStompServer();
					} else {
						subscribeTrigger(config().getString("amq.app.id", "ann"));
					}
				});
		
	}
	
	private void subscribeTrigger(String trigger) {
		MessageConsumer<JsonObject> consumer = bridge.createConsumer(trigger);
		System.out.println("Consumer " + trigger + " subscribed.");
		consumer.handler(vertxMsg -> this.process(trigger, vertxMsg));
	}
	
	/**
	 * 
	 * 冥王星综合通知服务
	 * 
	 * 通知类型
	 * 	日程: agenda_from_share, agenda_from_share_modify, agenda_from_share_remove
	 *  语音: inteligence_create_agenda, inteligence_search_agenda, inteligence_mix ...
	 *  通知: mwxing_message
	 *  提醒: mwxing_announce
	 * 
	 * 日程共享通知被共享人
	 * 已共享日程修改/删除通知被共享人
	 * 已共享日程删除共享人员,通知被删除人员
	 * 已共享日程添加共享人员,通知新增共享人员
	 * 
	 * 语音结果通知语音发起人所使用的设备
	 * 
	 * 系统通知
	 * 系统提醒
	 * 
	 * @param consumer
	 * @param received
	 */
	private void process(String consumer, Message<JsonObject> received) {
		System.out.println("Consumer " + consumer + " received [" + received.body().encode() + "]");
		JsonObject data = received.body().getJsonObject("body");

		String announceType = data.getJsonObject("context").getString("announceType");
		JsonArray announceTo = data.getJsonObject("context").getJsonArray("announceTo");
		JsonObject announceContent = data.getJsonObject("context").getJsonObject("announceContent");
		String next = data.getJsonObject("context").getString("next");

		if (announceTo == null || announceTo.isEmpty()) {
			System.out.println("No announce target, process stopped.");
			return;
		}
		
		if ("agenda_from_share".equals(announceType)) {
			for (int pos = 0; pos < announceTo.size(); pos++) {
				String openid = announceTo.getString(pos);
				System.out.println("Announce to " + openid + " start process.");
				Future<JsonObject> future = Future.future();
				
				future.setHandler(handler -> {
					if (handler.succeeded()) {
						JsonObject userinfo = handler.result();
						
						System.out.println("User info fetched with " + openid);
						System.out.println(userinfo.encode());
						String unionId = userinfo.getJsonObject("data").getString("unionid");
						
						if (unionId == null || StringUtils.isEmpty(unionId)) {
							System.out.println("announce by sms to " + openid);
							
							JsonObject sms = announceContent.getJsonObject("sms");
							
							sms.put("templateid", sms.getJsonObject("template").getString("newuser"));
							
							sendShortMessages(openid, sms);

						} else {
							System.out.println("announce by mwxing message to " + unionId);
							sendMQMessages(unionId + ".*", announceContent.getJsonObject("mwxing"));
						}
						
					} else {
						System.out.println("User info fetched error with " + handler.cause().getMessage());
						System.out.println("announce by sms to " + openid);
						JsonObject sms = announceContent.getJsonObject("sms");
						
						sms.put("templateid", sms.getJsonObject("template").getString("newuser"));
						sendShortMessages(openid, sms);
					}
				});
				
				getUserInfo(future, openid);
			}
		} else {
			System.out.println("Received process undefined messages.");
		}
		
		JsonObject nextctx = new JsonObject().put("context", new JsonObject().put("complete", new JsonObject()));
		
		MessageProducer<JsonObject> producer = bridge.createProducer(next);
		producer.send(new JsonObject().put("body", nextctx));
		System.out.println("Consumer " + consumer + " send to [" + next + "] result [" + nextctx.encode() + "]");

	}

	private void sendMQMessages(String queuename, JsonObject content) {
		rabbitmq.basicPublish("", queuename, new JsonObject().put("body", content.encode()), resultHandler -> {
			if (resultHandler.succeeded()) {
				System.out.println("Send rabbit mq message successed.");
			} else {
				System.out.println("Send rabbit mq message failed with " + resultHandler.cause().getMessage());
			}
		});
	}
	
	private void sendShortMessages(String phoneno, JsonObject content) {
		System.out.println("sms starting...");
		client.head(
				config().getInteger("sms.service.port", 8080),
				config().getString("sms.service.host", "sa-sms"),
				config().getString("sms.service.starter.singlesend", "/sms/send"))
		.method(HttpMethod.POST)
		.addQueryParam("platformType", "*")
		.addQueryParam("mobile", phoneno)
		.addQueryParam("sendType", content.getString("templateid"))
		.addQueryParam("sendContent", content.getString("content"))
		.send(handler -> {
				if (handler.succeeded()) {
					System.out.println("sms response " + handler.result().statusCode() + " " + handler.result().bodyAsString());
					System.out.println("sms sent announce message to " + phoneno + " completed. [" + content + "]");
				} else {
					handler.cause().printStackTrace();
					System.out.println("sms sent announce message to " + phoneno + " failed. [" + content + "]");
				}
			}
		);
		System.out.println("sms end.");
	}
	
	private void getUserInfo(Future<JsonObject> future, String phoneno) {
		
		client
		.head(config().getInteger("mwxing.auth.port", 8080), config().getString("mwxing.auth.host", "sa-aup"), "/aup/data/" + phoneno + "/userinfo")
		.method(HttpMethod.GET)
		.send(handler -> {
			if (handler.succeeded()) {
				JsonObject userinfo = null;
				
				try {
					userinfo = handler.result().bodyAsJsonObject();
				} catch (Exception e) {
					e.printStackTrace();
				} finally {
					if (userinfo == null) {
						userinfo = new JsonObject();
					}
				}
				
				future.complete(userinfo);
			} else {
				handler.cause().printStackTrace();
				future.fail(handler.cause());
			}
		});
		
	}
}
