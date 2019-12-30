package com.xiaoji.duan.cdc;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map.Entry;
import java.util.Set;
import java.util.UUID;

import io.vertx.amqpbridge.AmqpBridge;
import io.vertx.amqpbridge.AmqpBridgeOptions;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.MultiMap;
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

		// 注册动态代理地址，用于反向调用
		JsonArray proxy = config().getJsonArray("proxy", new JsonArray());
		
		if (proxy.size() > 0) {
			proxy.forEach(proxydef -> {
				JsonObject def = (JsonObject) proxydef;
				
				String url = def.getString("url");
				String path = def.getString("path", "");
				JsonArray params = def.getJsonArray("params", new JsonArray());
				JsonArray headers = def.getJsonArray("headers", new JsonArray());
				JsonObject response = def.getJsonObject("response", new JsonObject());
				JsonObject trigger = def.getJsonObject("trigger", new JsonObject());
				
				router.route(url).handler(BodyHandler.create());
				router.route(url).handler(ctx -> this.proxy(ctx, path, params, headers, response, trigger));
			});
		}
		
		router.route("/cdc/:caculateid/starter").handler(BodyHandler.create());
		router.route("/cdc/:caculateid/starter").consumes("application/json").produces("application/json").handler(this::caculatestarter);

		router.route("/cdc/:flowid/query/trigger").handler(BodyHandler.create());
		router.route("/cdc/:flowid/query/trigger").produces("application/json").handler(this::querytrigger);

		router.route("/cdc/:flowid/json/trigger").handler(BodyHandler.create());
		router.route("/cdc/:flowid/json/trigger").produces("application/json").handler(this::jsontrigger);

		router.route("/cdc/:flowid/query/synctrigger").handler(BodyHandler.create());
		router.route("/cdc/:flowid/query/synctrigger").produces("application/json").handler(this::syncquerytrigger);

		router.route("/cdc/:flowid/json/synctrigger").handler(BodyHandler.create());
		router.route("/cdc/:flowid/json/synctrigger").produces("application/json").handler(this::syncjsontrigger);

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

	private void proxy(RoutingContext ctx, String path, JsonArray params, JsonArray headers, JsonObject response, JsonObject trigger) {
		JsonObject query = new JsonObject();
		
		query.put("method", ctx.request().method().toString().toLowerCase());
		
		if (ctx.queryParams().size() > 0) {
			JsonObject querys = new JsonObject();
			
			for (Entry<String, String> entry : ctx.queryParams().entries()) {
				querys.put(entry.getKey(), entry.getValue());
			}
			
			query.put("querys", querys);
		} else {
			query.put("querys", new JsonObject());
		}
		
		if (!"".equals(path)) {
			query.put("path", path);
		}
		
		if (params.size() > 0) {
			JsonObject pathparams = new JsonObject();
			List pl = params.getList();
			
			for (Object po : pl) {
				String param = (String) po;
				
				query.put(param, ctx.pathParam(param));
				pathparams.put(param, ctx.pathParam(param));
			}

			query.put("params", pathparams);
		}

		if (headers.size() > 0) {
			JsonObject headerparams = new JsonObject();

			List pl = headers.getList();
			
			for (Object po : pl) {
				String name = (String) po;
				
				String requestHeader = ctx.request().getHeader(name);
				
				if (requestHeader == null) requestHeader = "";
				
				headerparams.put(name, requestHeader);
			}
			
			query.put("header", headerparams);
		}
		
		Boolean passthrough = response.getBoolean("passthrough", Boolean.TRUE);
		
		if (passthrough) {
			ctx.response().end("OK");
		} else {
			Future<JsonObject> future = Future.future();
			
			future.setHandler(handler -> {
				if (handler.succeeded()) {
					JsonObject result = handler.result();
					
					JsonObject resp = null;
					
					if (result != null) {
						System.out.println("result " + result.encode());

						resp = result.getJsonObject("body", new JsonObject())
								.getJsonObject("context", new JsonObject())
								.getJsonObject("executed", new JsonObject())
								.getJsonObject("response", new JsonObject());
					}
					
					if (resp == null)
						resp = new JsonObject();
					
					System.out.println("responsed " + resp.encode());
					ctx.response().putHeader("Content-Type", "application/json; charset=utf-8").end(resp.encode());
				} else {
					handler.cause().printStackTrace();
					ctx.response().putHeader("Content-Type", "application/json; charset=utf-8").end("{}");
				}
			});
			
			String address = config().getString("amq.app.id", "cdc") + "." + UUID.randomUUID().toString();
			subscribeTrigger(future, address);
			
			query.put("callback", new JsonArray().add(address));
		}
		
		String strbody = ctx.getBodyAsString();
		
		JsonObject body = new JsonObject();
		
		if (strbody != null && !"".equals(strbody.trim())) {
			body = ctx.getBodyAsJson();
		}
		
		query.put("body", body);

		String flowid = trigger.getString("flowid");
		
		MessageProducer<JsonObject> producer = bridge.createProducer(flowid);
		producer.send(new JsonObject()
				.put("body", new JsonObject()
						.put("context", query)));
		producer.end();
	}
	
	private void querytrigger(RoutingContext ctx) {
		System.out.println("headers: " + ctx.request().headers());
		String flowid = ctx.request().getParam("flowid");
		MultiMap query = ctx.request().params();
		
		JsonObject parameters = new JsonObject();
		
		for (Entry<String, String> entry : query.entries()) {
			parameters.put(entry.getKey(), entry.getValue());
		}
		
		Future<JsonObject> future = Future.future();
		
		future.setHandler(handler -> {
			System.out.println(flowid);
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

		MessageProducer<JsonObject> producer = bridge.createProducer(flowid);
		producer.send(new JsonObject()
				.put("body", new JsonObject()
						.put("context", parameters)));
		producer.end();

		future.complete(new JsonObject());
	}
	
	private void jsontrigger(RoutingContext ctx) {
		System.out.println("headers: " + ctx.request().headers());
		System.out.println("body: " + ctx.getBodyAsString());
		String flowid = ctx.request().getParam("flowid");
		JsonObject query = ctx.getBodyAsJson();
		
		List<String> headers = new ArrayList<String>();
		headers.add("lt");
		headers.add("pi");
		headers.add("pv");
		headers.add("di");
		headers.add("dt");
		headers.add("ai");
		
		// 增加冥王星客户端请求头参数
		JsonObject mwxing = new JsonObject();

		for (Entry<String, String> entry : ctx.request().headers().entries()) {
			String key = entry.getKey();
			
			if (headers.contains(key)) {
				String value = entry.getValue();
				
				mwxing.put(key, value);
			}
		}
		
		if (!mwxing.isEmpty()) {
			query.put("mwxing", mwxing);
		}
		
		Future<JsonObject> future = Future.future();
		
		future.setHandler(handler -> {
			System.out.println(flowid);
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

		MessageProducer<JsonObject> producer = bridge.createProducer(flowid);
		producer.send(new JsonObject()
				.put("body", new JsonObject()
						.put("context", query)));
		producer.end();

		System.out.println("Send context [" + query.encode() + "]");
		
		future.complete(new JsonObject());
	}
	
	private void syncquerytrigger(RoutingContext ctx) {
		System.out.println("headers: " + ctx.request().headers());
		String flowid = ctx.request().getParam("flowid");
		MultiMap query = ctx.request().params();
		
		JsonObject parameters = new JsonObject();
		
		for (Entry<String, String> entry : query.entries()) {
			parameters.put(entry.getKey(), entry.getValue());
		}
		
		Future<JsonObject> future = Future.future();
		
		future.setHandler(handler -> {
			System.out.println(flowid);
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
		message.put("query", parameters);
		
		MessageProducer<JsonObject> producer = bridge.createProducer(flowid);
		producer.send(new JsonObject()
				.put("body", new JsonObject()
						.put("context", message)));
		producer.end();

	}
	
	private void syncjsontrigger(RoutingContext ctx) {
		System.out.println("headers: " + ctx.request().headers());
		System.out.println("body: " + ctx.getBodyAsString());
		String flowid = ctx.request().getParam("flowid");
		JsonObject query = ctx.getBodyAsJson();
		
		Future<JsonObject> future = Future.future();
		
		future.setHandler(handler -> {
			System.out.println(flowid);
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
		message.put("query", query);
		
		MessageProducer<JsonObject> producer = bridge.createProducer(flowid);
		producer.send(new JsonObject()
				.put("body", new JsonObject()
						.put("context", message)));
		producer.end();

		System.out.println("Send context [" + query.encode() + "]");
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
		producer.end();

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
