package com.xiaoji.duan.xfy;

import java.net.URLEncoder;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;

import io.vertx.amqpbridge.AmqpBridge;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.MultiMap;
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

		String accessType = data.getJsonObject("context").getString("accessType", "nlp");
		
		String deviceId = data.getJsonObject("context").getString("deviceId", "default");
		String clientIp = data.getJsonObject("context").getString("clientIp", "");
		String userId = data.getJsonObject("context").getString("userId", "default");
		String dataType = data.getJsonObject("context").getString("dataType", "audio");
		String content = data.getJsonObject("context").getString("content");
		JsonObject context = data.getJsonObject("context").getJsonObject("context", new JsonObject());
		String next = data.getJsonObject("context").getString("next");

		if ("nlp".equals(accessType)) {
			try {
		        String curTime = System.currentTimeMillis() / 1000L + "";
		        StringBuffer param = new StringBuffer();
		        
		        if ("text".equals(dataType)) {
		        	param.append("{");
		        	param.append("\"auth_id\":\"");
		        	param.append(config().getString("xfyun.openapi.authid"));
		        	param.append("\",");
		        	param.append("\"data_type\":\"");
		        	param.append(dataType);
		        	param.append("\",");
		        	if (!"".equals(clientIp)) {
			        	param.append("\"client_ip\":\"");
			        	param.append(clientIp);
			        	param.append("\",");
		        	}
		        	param.append("\"scene\":\"");
		        	param.append(config().getString("xfyun.openapi.scene", "main"));
		        	param.append("\"");
		        	param.append("}");
		        } else {
		        	param.append("{");
		        	param.append("\"aue\":\"");
		        	param.append(config().getString("xfyun.openapi.aue", "raw"));
		        	param.append("\"");
		        	param.append(",\"sample_rate\":\"");
		        	param.append(config().getString("xfyun.openapi.samplerate", "16000"));
		        	param.append("\",");
		        	param.append("\"auth_id\":\"");
		        	param.append(config().getString("xfyun.openapi.authid"));
		        	param.append("\",");
		        	param.append("\"data_type\":\"");
		        	param.append(dataType);
		        	param.append("\",");
		        	if (!"".equals(clientIp)) {
			        	param.append("\"client_ip\":\"");
			        	param.append(clientIp);
			        	param.append("\",");
		        	}
		        	param.append("\"scene\":\"");
		        	param.append(config().getString("xfyun.openapi.scene", "main"));
		        	param.append("\"");
		        	param.append("}");
		        }
		        String paramBase64 = new String(Base64.encodeBase64(param.toString().getBytes("UTF-8")));
		        String checkSum = DigestUtils.md5Hex(config().getString("xfyun.openapi.apikey") + curTime + paramBase64);
		
		        Buffer body = Buffer.buffer();
		        
		        if ("text".equals(dataType)) {
		        	body = Buffer.buffer(content.getBytes());
		        } else {
		        	body = Buffer.buffer(Base64.decodeBase64(content.substring(content.indexOf(",") + 1)));
		        }
		        
		        nlp(consumer, deviceId, userId, context, body, paramBase64, curTime, checkSum, next, 1);
			} catch (Exception e) {
				e.printStackTrace();
			}
		} else {
			if ("audio".equals(dataType)) {
				// 语音的时候,调用迅飞语音听写接口转文字
				try {
			        String curTime = System.currentTimeMillis() / 1000L + "";
			        StringBuffer param = new StringBuffer();
			        
		        	param.append("{");
		        	param.append("\"engine_type\":\"");
		        	param.append(config().getString("xfyun.openapi.engine_type", "sms16k"));
		        	param.append("\"");
		        	param.append(",\"aue\":\"");
		        	param.append(config().getString("xfyun.openapi.aue", "raw"));
//		        	param.append("\",");
//		        	param.append("\"speex_size\":\"");
//		        	param.append(config().getString("xfyun.openapi.speex_size", "60"));
//		        	param.append("\",");
//		        	param.append("\"auth_id\":\"");
//		        	param.append(config().getString("xfyun.openapi.authid"));
//		        	param.append("\",");
//		        	param.append("\"vad_eos\":\"");
//		        	param.append(config().getString("xfyun.openapi.vad_eos", "1800"));
//		        	param.append("\",");
//		        	param.append("\"scene\":\"");
//		        	param.append(config().getString("xfyun.openapi.scene", "main"));
		        	param.append("\"");
		        	param.append("}");
		        	
			        String paramBase64 = new String(Base64.encodeBase64(param.toString().getBytes("UTF-8")));
			        String checkSum = DigestUtils.md5Hex(config().getString("xfyun.openapi.iat.apikey", "0d1a450c0cfea7945686b49f2fb0c81c") + curTime + paramBase64);
			
			        String codec = content.substring(content.indexOf(",") + 1).replaceAll(" ", "");
			        System.out.println("codec " + codec.length());
			        MultiMap body = MultiMap.caseInsensitiveMultiMap();
			        body.add("audio", codec);
			        
			        iat(consumer, deviceId, userId, context, body, paramBase64, curTime, checkSum, next, 1);
				} catch (Exception e) {
					e.printStackTrace();
				}
			} else {
				// 文本的时候,直接返回
				JsonObject result = new JsonObject();
				result.put("code", "0");
				result.put("data", content);
				result.put("sid", "simulated");
				result.put("desc", "success");
				
				JsonObject nextctx = new JsonObject()
						.put("context", new JsonObject()
								.put("xunfeiyun", result
										.put("_context", context
												.put("userId", userId)
												.put("deviceId", deviceId))));
				
				MessageProducer<JsonObject> producer = bridge.createProducer(next);
				producer.send(new JsonObject().put("body", nextctx));
				System.out.println("Consumer " + consumer + " send to [" + next + "] result [" + nextctx.encode() + "]");
			}
		}

	}
	
	private void iat(String consumer, String deviceId, String userId, JsonObject context, MultiMap body, String paramBase64, String curTime, String checkSum, String nextTask, Integer retry) {
		System.out.println("X-Param: " + paramBase64);
		System.out.println("X-CurTime: " + curTime);
		System.out.println("X-CheckSum: " + checkSum);
		System.out.println("X-Appid: " + config().getString("xfyun.openapi.appid"));
		System.out.println("iat process");

		try {
			client.headAbs(config().getString("xfyun.openapi.iat", "http://api.xfyun.cn/v1/service/v1/iat"))
			.method(HttpMethod.POST)
			.putHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8")
			.putHeader("X-Param", paramBase64)
			.putHeader("X-CurTime", curTime)
			.putHeader("X-CheckSum", checkSum)
			.putHeader("X-Appid", config().getString("xfyun.openapi.appid"))
			.sendForm(body, handler -> {
				if (handler.succeeded()) {
					HttpResponse<Buffer> response = handler.result();
	
					if (200 == response.statusCode()) {
						JsonObject result = response.bodyAsJsonObject();
	
						JsonObject nextctx = new JsonObject()
								.put("context", new JsonObject()
										.put("xunfeiyun", result
												.put("_context", context
														.put("userId", userId)
														.put("deviceId", deviceId))));
						
						MessageProducer<JsonObject> producer = bridge.createProducer(nextTask);
						producer.send(new JsonObject().put("body", nextctx));
						System.out.println("Consumer " + consumer + " send to [" + nextTask + "] result [" + nextctx.encode() + "]");
					} else {
						System.out.println("Xunfei yun access error with " + response.statusCode() + " " + response.statusMessage());
					}
				} else {
					handler.cause().printStackTrace();
					if (retry > 3) {
						System.out.println("Xunfei yun iat retried over 3 times with follow error:");
						// 文本的时候,直接返回
						JsonObject result = new JsonObject();
						result.put("code", "0");
						result.put("data", "");
						result.put("sid", "simulated");
						result.put("desc", "success");
						
						JsonObject nextctx = new JsonObject()
								.put("context", new JsonObject()
										.put("xunfeiyun", result
												.put("_context", context
														.put("userId", userId)
														.put("deviceId", deviceId))));
						
						MessageProducer<JsonObject> producer = bridge.createProducer(nextTask);
						producer.send(new JsonObject().put("body", nextctx));
						System.out.println("Consumer " + consumer + " send to [" + nextTask + "] result [" + nextctx.encode() + "]");
					} else {
						iat(consumer, deviceId, userId, context, body, paramBase64, curTime, checkSum, nextTask, retry + 1);
					}
				}
			});
		} catch (Exception e) {
			e.printStackTrace();
			if (retry > 3) {
				System.out.println("Xunfei yun iat retried over 3 times with follow error:");
				// 文本的时候,直接返回
				JsonObject result = new JsonObject();
				result.put("code", "0");
				result.put("data", "");
				result.put("sid", "simulated");
				result.put("desc", "success");
				
				JsonObject nextctx = new JsonObject()
						.put("context", new JsonObject()
								.put("xunfeiyun", result
										.put("_context", context
												.put("userId", userId)
												.put("deviceId", deviceId))));
				
				MessageProducer<JsonObject> producer = bridge.createProducer(nextTask);
				producer.send(new JsonObject().put("body", nextctx));
				System.out.println("Consumer " + consumer + " send to [" + nextTask + "] result [" + nextctx.encode() + "]");
			} else {
				iat(consumer, deviceId, userId, context, body, paramBase64, curTime, checkSum, nextTask, retry + 1);
			}
		}
	}
	
	private void nlp(String consumer, String deviceId, String userId, JsonObject context, Buffer body, String paramBase64, String curTime, String checkSum, String nextTask, Integer retry) {

		System.out.println("X-Param: " + paramBase64);
		System.out.println("X-CurTime: " + curTime);
		System.out.println("X-CheckSum: " + checkSum);
		System.out.println("X-Appid: " + config().getString("xfyun.openapi.appid"));
		System.out.println("nlp process");

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
														.put("userId", userId)
														.put("deviceId", deviceId))));
						
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
				        nlp(consumer, deviceId, userId, context, body, paramBase64, curTime, checkSum, nextTask, retry + 1);
					}
				}
			});
		} catch (Exception e) {
			e.printStackTrace();
			if (retry > 3) {
				System.out.println("Xunfei yun nlp retried over 3 times with follow error:");
			} else {
		        nlp(consumer, deviceId, userId, context, body, paramBase64, curTime, checkSum, nextTask, retry + 1);
			}
		}
	}
}
