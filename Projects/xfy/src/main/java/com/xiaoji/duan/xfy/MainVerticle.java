package com.xiaoji.duan.xfy;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;

import io.vertx.amqpbridge.AmqpBridge;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.eventbus.Message;
import io.vertx.core.eventbus.MessageConsumer;
import io.vertx.core.eventbus.MessageProducer;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.ext.web.client.HttpResponse;
import io.vertx.ext.web.client.WebClient;

public class MainVerticle extends AbstractVerticle {

	private WebClient client = null;
	private AmqpBridge bridge = null;
	private MongoClient mongodb = null;

	@Override
	public void start(Future<Void> startFuture) throws Exception {

		client = WebClient.create(vertx);

		JsonObject config = new JsonObject();
		config.put("host", "mongodb");
		config.put("port", 27017);
		config.put("keepAlive", true);
		mongodb = MongoClient.createShared(vertx, config);

		bridge = AmqpBridge.create(vertx);

		bridge.endHandler(endHandler -> {
			connectStompServer();
		});
		connectStompServer();

	}

	private void connectStompServer() {
		bridge.start(config().getString("stomp.server.host", "sa-amq"),
				config().getInteger("stomp.server.port", 5672), res -> {
					if (res.failed()) {
						res.cause().printStackTrace();
						connectStompServer();
					} else {
						subscribeTrigger(config().getString("amq.app.id", "xfy"));
					}
				});
		
	}
	
	private void subscribeTrigger(String trigger) {
		MessageConsumer<JsonObject> consumer = bridge.createConsumer(trigger);
		System.out.println("Consumer " + trigger + " subscribed.");
		consumer.handler(vertxMsg -> this.process(trigger, vertxMsg));
	}
	
	private void process(String consumer, Message<JsonObject> received) {
		System.out.println("Consumer " + consumer + " received [" + received.body().encode() + "]");
		JsonObject data = received.body().getJsonObject("body");

		String userId = data.getJsonObject("context").getString("userId", "default");
		String dataType = data.getJsonObject("context").getString("dataType", "audio");
		String content = data.getJsonObject("context").getString("content");
		JsonObject context = data.getJsonObject("context").getJsonObject("context", new JsonObject());
		String next = data.getJsonObject("context").getString("next");

		try {
	        String curTime = System.currentTimeMillis() / 1000L + "";
	        String param = "";
	        
	        if ("text".equals(dataType)) {
	        	param = "{\"auth_id\":\""+ config().getString("xfyun.openapi.authid") +"\",\"data_type\":\""+ dataType +"\",\"scene\":\""+config().getString("xfyun.openapi.scene", "main")+"\"}";
	        } else {
	        	param = "{\"aue\":\""+ config().getString("xfyun.openapi.aue", "raw") +"\",\"sample_rate\":\""+ config().getString("xfyun.openapi.samplerate", "16000") +"\",\"auth_id\":\""+ config().getString("xfyun.openapi.authid") +"\",\"data_type\":\""+ dataType +"\",\"scene\":\""+config().getString("xfyun.openapi.scene", "main")+"\"}";
	        }
	        String paramBase64 = new String(Base64.encodeBase64(param.getBytes("UTF-8")));
	        String checkSum = DigestUtils.md5Hex(config().getString("xfyun.openapi.apikey") + curTime + paramBase64);
	
	        Buffer body = Buffer.buffer();
	        
	        if ("text".equals(dataType)) {
	        	body = Buffer.buffer(content.getBytes());
	        } else {
	        	body = Buffer.buffer(Base64.decodeBase64(content.substring(content.indexOf(",") + 1)));
	        }
	        
	        nlp(consumer, userId, context, body, paramBase64, curTime, checkSum, next, 1);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private void nlp(String consumer, String userId, JsonObject context, Buffer body, String paramBase64, String curTime, String checkSum, String nextTask, Integer retry) {

		System.out.println("X-Param: " + paramBase64);
		System.out.println("X-CurTime: " + curTime);
		System.out.println("X-CheckSum: " + checkSum);
		System.out.println("X-Appid: " + config().getString("xfyun.openapi.appid"));
		
		try {
			client.headAbs(config().getString("xfyun.openapi.aiui", "http://openapi.xfyun.cn/v2/aiui"))
			.method(HttpMethod.POST)
			.putHeader("X-Param", paramBase64)
			.putHeader("X-CurTime", curTime)
			.putHeader("X-CheckSum", checkSum)
			.putHeader("X-Appid", config().getString("xfyun.openapi.appid"))
			.sendBuffer(body, handler -> {
				if (handler.succeeded()) {
					HttpResponse<Buffer> response = handler.result();
	
					if (200 == response.statusCode()) {
						JsonObject result = response.bodyAsJsonObject();
	
						JsonObject nextctx = new JsonObject()
								.put("context", new JsonObject()
										.put("xunfeiyun", result
												.put("_context", context
														.put("userId", userId))));
						
						MessageProducer<JsonObject> producer = bridge.createProducer(nextTask);
						producer.send(new JsonObject().put("body", nextctx));
						System.out.println("Consumer " + consumer + " send to [" + nextTask + "] result [" + nextctx.encode() + "]");
					} else {
						System.out.println("Xunfei yun access error with " + response.statusCode() + " " + response.statusMessage());
					}
				} else {
					handler.cause().printStackTrace();
					if (retry > 3) {
						System.out.println("Xunfei yun nlp retried over 3 times with follow error:");
					} else {
				        nlp(consumer, userId, context, body, paramBase64, curTime, checkSum, nextTask, retry + 1);
					}
				}
			});
		} catch (Exception e) {
			e.printStackTrace();
			if (retry > 3) {
				System.out.println("Xunfei yun nlp retried over 3 times with follow error:");
			} else {
		        nlp(consumer, userId, context, body, paramBase64, curTime, checkSum, nextTask, retry + 1);
			}
		}
	}
}
