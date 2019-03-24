package com.xiaoji.duan.cdc;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import io.vertx.amqpbridge.AmqpBridge;
import io.vertx.amqpbridge.AmqpBridgeOptions;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.eventbus.Message;
import io.vertx.core.eventbus.MessageConsumer;
import io.vertx.core.eventbus.MessageProducer;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.CorsHandler;
import io.vertx.ext.web.handler.StaticHandler;

public class MainVerticle extends AbstractVerticle {

	private AmqpBridge bridge = null;

	@Override
	public void start(Future<Void> startFuture) throws Exception {
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

		StaticHandler staticfiles = StaticHandler.create().setCachingEnabled(false).setWebRoot("static");
		router.route("/cdc/static/*").handler(staticfiles);
		router.route("/cdc").pathRegex("\\/.+\\.json").handler(staticfiles);

		router.route("/cdc/:caculateid/starter").handler(BodyHandler.create());
		router.route("/cdc/:caculateid/starter").consumes("application/json").produces("application/json").handler(this::caculatestarter);

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

	private void caculatestarter(RoutingContext ctx) {
		System.out.println("headers: " + ctx.request().headers());
		//System.out.println("body: " + ctx.getBodyAsString());
		String caculateid = ctx.request().getParam("caculateid");
		System.out.println("cdc " + caculateid + " starting.");

		JsonObject req = ctx.getBodyAsJson();

		if (req == null) {
			req = new JsonObject();
		}
		System.out.println("cdc " + caculateid + " request json getted.");

		Object d = req.getValue("d", new JsonArray());

		Future<JsonObject> future = Future.future();
		
		future.setHandler(handler -> {
			System.out.println("cdc " + caculateid + " responsed.");
			if (handler.succeeded()) {
				JsonObject result = handler.result();
				
				if (result == null)
					result = new JsonObject();
				System.out.println("responsed " +result.size());
				ctx.response().putHeader("Content-Type", "application/json; charset=utf-8").end(result.encode());
			} else {
				handler.cause().printStackTrace();
				ctx.response().putHeader("Content-Type", "application/json; charset=utf-8").end("{}");
			}
		});
		
		String address = config().getString("amq.app.id", "cdc") + "." + UUID.randomUUID().toString();
		subscribeTrigger(future, address);

		JsonObject message = new JsonObject();
		message.put("callback", new JsonArray().add(address));
		message.put("caculateid", caculateid);
		message.put("data", (JsonArray) d);

		MessageProducer<JsonObject> producer = bridge.createProducer("cdc_" + caculateid + "_start");
		producer.send(new JsonObject()
				.put("body", new JsonObject()
						.put("context", message)));

	}
	
	private void subscribeTrigger(Future future, String trigger) {
		MessageConsumer<JsonObject> consumer = bridge.createConsumer(trigger);
		System.out.println("Consumer " + trigger + " subscribed.");
		consumer.handler(vertxMsg -> this.process(future, trigger, vertxMsg));
	}
	
	private void process(Future future, String consumer, Message<JsonObject> received) {
		System.out.println("cdc processed.");
		future.complete(received.body());
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
