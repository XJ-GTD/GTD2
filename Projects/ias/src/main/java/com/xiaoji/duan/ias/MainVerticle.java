package com.xiaoji.duan.ias;

import java.util.HashSet;
import java.util.Set;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;

import io.vertx.amqpbridge.AmqpBridge;
import io.vertx.amqpbridge.AmqpBridgeOptions;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.eventbus.MessageProducer;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.CorsHandler;

public class MainVerticle extends AbstractVerticle {

	private AmqpBridge bridge = null;
	private MongoClient mongodb = null;

	@Override
	public void start(Future<Void> startFuture) throws Exception {
		JsonObject config = new JsonObject();
		config.put("host", "mongodb");
		config.put("port", 27017);
		config.put("keepAlive", true);
		mongodb = MongoClient.createShared(vertx, config);

		AmqpBridgeOptions options = new AmqpBridgeOptions();
		bridge = AmqpBridge.create(vertx, options);

		bridge.endHandler(endHandler -> {
			connectStompServer();
		});
		connectStompServer();

		Router router = Router.router(vertx);
		
		Set<HttpMethod> allowedMethods = new HashSet<HttpMethod>();
		allowedMethods.add(HttpMethod.OPTIONS);
		allowedMethods.add(HttpMethod.GET);
		allowedMethods.add(HttpMethod.POST);
		allowedMethods.add(HttpMethod.PUT);
		allowedMethods.add(HttpMethod.DELETE);
		allowedMethods.add(HttpMethod.CONNECT);
		allowedMethods.add(HttpMethod.PATCH);
		allowedMethods.add(HttpMethod.HEAD);
		allowedMethods.add(HttpMethod.TRACE);

		router.route().handler(CorsHandler.create("*")
				.allowedMethods(allowedMethods)
				.allowedHeader("*")
				.allowedHeader("Content-Type")
				.allowedHeader("lt")
				.allowedHeader("pi")
				.allowedHeader("pv")
				.allowedHeader("di")
				.allowedHeader("dt")
				.allowedHeader("ai"));

		router.route("/ias/starter/audio").handler(BodyHandler.create());
		router.route("/ias/starter/text").handler(BodyHandler.create());

		router.route("/ias/starter/audio").handler(this::audiostarter);
		router.route("/ias/starter/text").handler(this::textstarter);

		HttpServerOptions option = new HttpServerOptions();
		option.setCompressionSupported(true);

		vertx.createHttpServer(option).requestHandler(router::accept).listen(8080, http -> {
			if (http.succeeded()) {
				startFuture.complete();
				System.out.println("HTTP server started on http://localhost:8080");
			} else {
				startFuture.fail(http.cause());
			}
		});
	}

	private void audiostarter(RoutingContext ctx) {
		JsonObject ret = new JsonObject();
		ret.put("rc", "0");
		ret.put("rm", "");
		ret.put("d", new JsonObject());
		
		String productid = ctx.request().getHeader("pi");
		String productversion = ctx.request().getHeader("pv");
		
		if (productid == null || StringUtils.isEmpty(productid) || productversion == null || StringUtils.isEmpty(productversion)) {
			ret.put("rc", "-2");
			ret.put("rm", "�Ƿ�����!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		String accountid = ctx.request().getHeader("ai");
		
		if (accountid == null || accountid.isEmpty()) {
			ret.put("rc", "-2");
			ret.put("rm", "�Ƿ�����!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		JsonObject req = ctx.getBodyAsJson();
		
		if (req == null || req.isEmpty()) {
			ret.put("rc", "-1");
			ret.put("rm", "�������������, �Ƿ�����!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		String clientIp = ctx.request().getHeader("x-real-ip");
		
		String deviceId = ctx.request().getHeader("di");
		
		if (deviceId == null || deviceId.isEmpty()) {
			deviceId = clientIp;
		}

		deviceId = Base64.encodeBase64URLSafeString(deviceId.getBytes());
		
		JsonObject data = req.getJsonObject("d");
		
		if (data == null || data.isEmpty()) {
			ret.put("rc", "-1");
			ret.put("rm", "�����������������, �Ƿ�����!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		String voicecontent = data.getString("vb64");
		
		if (voicecontent == null || StringUtils.isEmpty(voicecontent)) {
			ret.put("rc", "-1");
			ret.put("rm", "��Ƶ�������ݲ�����, �Ƿ�����!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		// �ͻ��˻�����������,����Э��һ����������������
		JsonObject context = req.getJsonObject("c", new JsonObject());
		
		// ֪ͨ���ܷ���, ����������������
		String base64key = Base64.encodeBase64URLSafeString(accountid.getBytes());

		JsonObject message = new JsonObject();
		message.put("deviceId", deviceId);
		message.put("clientIp", clientIp);
		message.put("userId", accountid);
		message.put("content", voicecontent);
		message.put("contentType", "audio");
		message.put("context", context);

		MessageProducer<JsonObject> producer = bridge.createProducer("mwxing_inteligence_service_start");
		producer.send(new JsonObject()
				.put("body", new JsonObject()
						.put("context", message)));

		ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());

	}
	
	private void textstarter(RoutingContext ctx) {
		JsonObject ret = new JsonObject();
		ret.put("rc", "0");
		ret.put("rm", "");
		ret.put("d", new JsonObject());
		
		String productid = ctx.request().getHeader("pi");
		String productversion = ctx.request().getHeader("pv");
		
		if (productid == null || StringUtils.isEmpty(productid) || productversion == null || StringUtils.isEmpty(productversion)) {
			ret.put("rc", "-2");
			ret.put("rm", "�Ƿ�����!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		String accountid = ctx.request().getHeader("ai");
		
		if (accountid == null || accountid.isEmpty()) {
			ret.put("rc", "-2");
			ret.put("rm", "�Ƿ�����!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		JsonObject req = ctx.getBodyAsJson();
		
		if (req == null || req.isEmpty()) {
			ret.put("rc", "-1");
			ret.put("rm", "�������������, �Ƿ�����!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		String clientIp = ctx.request().getHeader("x-real-ip");

		String deviceId = ctx.request().getHeader("di");
		
		if (deviceId == null || deviceId.isEmpty()) {
			deviceId = clientIp;
		}

		deviceId = Base64.encodeBase64URLSafeString(deviceId.getBytes());
		
		JsonObject data = req.getJsonObject("d");
		
		if (data == null || data.isEmpty()) {
			ret.put("rc", "-1");
			ret.put("rm", "�����������������, �Ƿ�����!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		String textcontent = data.getString("text");
		
		if (textcontent == null || StringUtils.isEmpty(textcontent)) {
			ret.put("rc", "-1");
			ret.put("rm", "�ı��������ݲ�����, �Ƿ�����!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		// �ͻ��˻�����������,����Э��һ����������������
		JsonObject context = req.getJsonObject("c", new JsonObject());
		
		JsonObject message = new JsonObject();
		message.put("deviceId", deviceId);
		message.put("clientIp", clientIp);
		message.put("userId", accountid);
		message.put("content", textcontent);
		message.put("contentType", "text");
		message.put("context", context);
		
		MessageProducer<JsonObject> producer = bridge.createProducer("mwxing_inteligence_service_start");
		producer.send(new JsonObject()
				.put("body", new JsonObject()
						.put("context", message)));

		ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());

	}
	
	private void connectStompServer() {
		bridge.start(config().getString("stomp.server.host", "sa-amq"),
				config().getInteger("stomp.server.port", 5672), res -> {
					if (res.failed()) {
						res.cause().printStackTrace();
						if (!config().getBoolean("debug", true)) {
							connectStompServer();
						}
					} else {
						System.out.println("Stomp server connected.");
					}
				});
		
	}

}
