package com.xiaoji.duan.sha;

import java.util.Arrays;
import java.util.Calendar;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.client.HttpResponse;
import io.vertx.ext.web.client.WebClient;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.CorsHandler;
import io.vertx.ext.web.handler.StaticHandler;
import io.vertx.ext.web.handler.TemplateHandler;
import io.vertx.ext.web.templ.thymeleaf.ThymeleafTemplateEngine;

public class MainVerticle extends AbstractVerticle {

	private ThymeleafTemplateEngine thymeleaf = null;
	private MongoClient mongodb = null;
	private WebClient client = null;

	@Override
	public void start(Future<Void> startFuture) throws Exception {
		client = WebClient.create(vertx);

		thymeleaf = ThymeleafTemplateEngine.create(vertx);
		TemplateHandler templatehandler = TemplateHandler.create(thymeleaf);

		ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
		resolver.setSuffix(".html");
		resolver.setCacheable(false);
		resolver.setTemplateMode("HTML5");
		resolver.setCharacterEncoding("utf-8");
		thymeleaf.getThymeleafTemplateEngine().setTemplateResolver(resolver);

		JsonObject config = new JsonObject();
		config.put("host", "mongodb");
		config.put("port", 27017);
		config.put("keepAlive", true);
		mongodb = MongoClient.createShared(vertx, config);

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
		router.route("/sha/static/*").handler(staticfiles);
		router.route("/sha").pathRegex("\\/.+\\.json").handler(staticfiles);

		router.route("/sha/agendashare").handler(BodyHandler.create());
		router.route("/sha/agenda/share").handler(BodyHandler.create());
		
		router.route("/sha/planshare").handler(BodyHandler.create());
		router.route("/sha/plan/share").handler(BodyHandler.create());
		
		router.route("/sha/plan/buildin/download").handler(BodyHandler.create());

		router.route("/sha/agendashare").handler(this::agendashare);
		router.route("/sha/agenda/share/:shareid").handler(this::agendashareview);

		router.route("/sha/planshare").consumes("application/json").produces("application/json").handler(this::planshare);
		router.route("/sha/plan/share/:shareid").handler(this::planshareview);
		
		router.route("/sha/plan/buildin/download").handler(this::buildinplandownload);

		router.route("/sha/agenda/share/:shareid").handler(ctx -> {
			thymeleaf.render(new JsonObject(ctx.data()), "/templates/agenda/share", res -> {
				if (res.succeeded()) {
					ctx.response().putHeader("Content-Type", "text/html").end(res.result());
				} else {
					ctx.fail(res.cause());
				}
			});
		});
		router.route("/sha/plan/share/:shareid").handler(ctx -> {
			thymeleaf.render(new JsonObject(ctx.data()), "/templates/plan/share", res -> {
				if (res.succeeded()) {
					ctx.response().putHeader("Content-Type", "text/html").end(res.result());
				} else {
					ctx.fail(res.cause());
				}
			});
		});

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

	private void agendashare(RoutingContext ctx) {
		System.out.println("headers: " + ctx.request().headers());
		System.out.println("body: " + ctx.getBodyAsString());
		JsonObject ret = new JsonObject();
		ret.put("rc", "0");
		ret.put("rm", "");
		ret.put("d", new JsonObject());
		
		String productid = ctx.request().getHeader("pi");
		String productversion = ctx.request().getHeader("pv");
		
		if (productid == null || StringUtils.isEmpty(productid) || productversion == null || StringUtils.isEmpty(productversion)) {
			ret.put("rc", "-2");
			ret.put("rm", "非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		String accountid = ctx.request().getHeader("ai");
		
		if (accountid == null || accountid.isEmpty()) {
			ret.put("rc", "-2");
			ret.put("rm", "非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		JsonObject req = ctx.getBodyAsJson();
		
		if (req == null || req.isEmpty()) {
			ret.put("rc", "-1");
			ret.put("rm", "请求参数不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		JsonObject data = req.getJsonObject("d");
		
		if (data == null || data.isEmpty()) {
			ret.put("rc", "-1");
			ret.put("rm", "日程分享参数不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		JsonObject agenda = data.getJsonObject("a");
		
		if (agenda == null || agenda.isEmpty()) {
			ret.put("rc", "-1");
			ret.put("rm", "日程分享数据不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		String shareId = new String(Base64.encodeBase64URLSafe(UUID.randomUUID().toString().getBytes()));
		agenda.put("_id", shareId);
		agenda.put("_shareaccount", accountid);
		agenda.put("_shareproduct", new JsonObject().put("productid", productid).put("productversion", productversion));
		agenda.put("_sharetime", System.currentTimeMillis());
		agenda.put("_expiretime", 7 * 24 * 60 * 60 * 1000L);
		
		List<Future<JsonObject>> futures = new LinkedList<>();
		
		Future<JsonObject> lessfuture = Future.future();
		futures.add(lessfuture);
		
		client.postAbs("https://www.guobaa.com/sho/linkless")
		.sendJsonObject(new JsonObject()
				.put("type", "default")
				.put("src", "https://pluto.guobaa.com/sha/agenda/share/" + shareId),
				handler -> {
			if (handler.succeeded()) {
				HttpResponse<Buffer> resp = handler.result();
				System.out.println(resp.bodyAsString());
				JsonObject su = resp.bodyAsJsonObject();
				
				lessfuture.complete(su);
			} else {
				lessfuture.complete(new JsonObject());
			}
		});
		
		Future<JsonObject> saveFuture = Future.future();
		futures.add(saveFuture);
		
		mongodb.save("sha_agenda", agenda, save -> {
			if (save.succeeded()) {
				JsonObject retdata = new JsonObject();
				retdata.put("asurl", "https://pluto.guobaa.com/sha/agenda/share/" + shareId);
				
				ret.put("d", retdata);
				
				saveFuture.complete(retdata);
				
				// 创建压缩字体
				client.getAbs("https://www.guobaa.com/mif/sha/agenda/share/" + shareId).send(compress -> {
					if (compress.succeeded()) {
						System.out.println("[mif] Webfont compress succeeded. " + compress.result().bodyAsString());
					} else {
						System.out.println("[mif] Webfont compress failed. " + compress.cause().getMessage());
					}
				});
				
			} else {
				
				saveFuture.fail(save.cause());
			}
		});
		
		CompositeFuture.all(Arrays.asList(futures.toArray(new Future[futures.size()])))
		.map(v -> futures.stream().map(Future::result).collect(Collectors.toList()))
		.setHandler(handler -> {
			if (handler.succeeded()) {
				List<JsonObject> results = handler.result();
				
				JsonObject less = null;
				JsonObject retdata = null;
				
				for (JsonObject result : results) {
					if (result.containsKey("asurl")) {
						retdata = result;
					} else {
						less = result;
					}
				}
				
				retdata.put("asurl", less.getString("url", retdata.getString("asurl")));
				
				ret.put("d", retdata);
				
				ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());

			} else {
				ret.put("rc", "-3");
				ret.put("rm", "服务器异常, 分享失败!");

				ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			}
		});
	}

	private void agendashareview(RoutingContext ctx) {
		System.out.println("headers: " + ctx.request().headers());
		System.out.println("body: " + ctx.getBodyAsString());
		String shareId = ctx.request().getParam("shareid");

		if (!StringUtils.isEmpty(shareId)) {
			JsonObject condition = new JsonObject();
			condition.put("_id", shareId);
			
			mongodb.findOne("sha_agenda", condition, new JsonObject(), findOne -> {
				if (findOne.succeeded()) {
					JsonObject agenda = findOne.result();
					
					ctx.put("minfontcode", Base64.encodeBase64URLSafeString(ctx.request().path().getBytes()));
					ctx.put("agenda", agenda.mapTo(Map.class));
					ctx.next();
				} else {
					ctx.response().setStatusCode(404).end();
				}
			});
		} else {
			ctx.response().setStatusCode(400).end();
		}
	}

	private void planshare(RoutingContext ctx) {
		JsonObject ret = new JsonObject();
		ret.put("rc", "0");
		ret.put("rm", "");
		ret.put("d", new JsonObject());
		
		String productid = ctx.request().getHeader("pi");
		String productversion = ctx.request().getHeader("pv");
		
		if (productid == null || StringUtils.isEmpty(productid) || productversion == null || StringUtils.isEmpty(productversion)) {
			ret.put("rc", "-2");
			ret.put("rm", "非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		String accountid = ctx.request().getHeader("ai");
		
		if (accountid == null || accountid.isEmpty()) {
			ret.put("rc", "-2");
			ret.put("rm", "非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		JsonObject req = ctx.getBodyAsJson();
		
		if (req == null || req.isEmpty()) {
			ret.put("rc", "-1");
			ret.put("rm", "请求参数不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		JsonObject data = req.getJsonObject("d");
		
		if (data == null || data.isEmpty()) {
			ret.put("rc", "-1");
			ret.put("rm", "计划分享参数不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		JsonObject plan = data.getJsonObject("p");
		
		if (plan == null || plan.isEmpty()) {
			ret.put("rc", "-1");
			ret.put("rm", "计划分享数据不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		String shareId = new String(Base64.encodeBase64URLSafe(UUID.randomUUID().toString().getBytes()));
		plan.put("_id", shareId);
		plan.put("_shareaccount", accountid);
		plan.put("_shareproduct", new JsonObject().put("productid", productid).put("productversion", productversion));
		plan.put("_sharetime", System.currentTimeMillis());
		plan.put("_expiretime", 365 * 24 * 60 * 60 * 1000L);
		
		List<Future<JsonObject>> futures = new LinkedList<>();
		
		Future<JsonObject> lessfuture = Future.future();
		futures.add(lessfuture);
		
		client.postAbs("https://www.guobaa.com/sho/linkless")
		.sendJsonObject(new JsonObject()
				.put("type", "default")
				.put("src", "https://pluto.guobaa.com/sha/plan/share/" + shareId),
				handler -> {
			if (handler.succeeded()) {
				HttpResponse<Buffer> resp = handler.result();
				System.out.println(resp.bodyAsString());
				JsonObject su = resp.bodyAsJsonObject();
				
				lessfuture.complete(su);
			} else {
				lessfuture.complete(new JsonObject());
			}
		});
		
		Future<JsonObject> saveFuture = Future.future();
		futures.add(saveFuture);
		
		mongodb.save("sha_plan", plan, save -> {
			if (save.succeeded()) {
				JsonObject retdata = new JsonObject();
				retdata.put("psurl", "https://pluto.guobaa.com/sha/plan/share/" + shareId);
				
				ret.put("d", retdata);
				
				saveFuture.complete(retdata);

				// 创建压缩字体
				client.getAbs("https://www.guobaa.com/mif/sha/plan/share/" + shareId).send(compress -> {
					if (compress.succeeded()) {
						System.out.println("[mif] Webfont compress succeeded. " + compress.result().bodyAsString());
					} else {
						System.out.println("[mif] Webfont compress failed. " + compress.cause().getMessage());
					}
				});
				
			} else {
				saveFuture.fail(save.cause());
			}
		});
		
		CompositeFuture.all(Arrays.asList(futures.toArray(new Future[futures.size()])))
		.map(v -> futures.stream().map(Future::result).collect(Collectors.toList()))
		.setHandler(handler -> {
			if (handler.succeeded()) {
				List<JsonObject> results = handler.result();
				
				JsonObject less = null;
				JsonObject retdata = null;
				
				for (JsonObject result : results) {
					if (result.containsKey("psurl")) {
						retdata = result;
					} else {
						less = result;
					}
				}
				
				retdata.put("psurl", less.getString("url", retdata.getString("psurl")));
				
				ret.put("d", retdata);
				
				ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());

			} else {
				ret.put("rc", "-3");
				ret.put("rm", "服务器异常, 分享失败!");

				ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			}
		});
	}

	private void planshareview(RoutingContext ctx) {

		String shareId = ctx.request().getParam("shareid");

		if (!StringUtils.isEmpty(shareId)) {
			JsonObject condition = new JsonObject();
			condition.put("_id", shareId);
			
			mongodb.findOne("sha_plan", condition, new JsonObject(), findOne -> {
				if (findOne.succeeded()) {
					JsonObject plan = findOne.result();

					ctx.put("minfontcode", Base64.encodeBase64URLSafeString(ctx.request().path().getBytes()));
					ctx.put("today", Calendar.getInstance());
					ctx.put("plan", plan.mapTo(Map.class));
					ctx.next();
				} else {
					ctx.response().setStatusCode(404).end();
				}
			});
		} else {
			ctx.response().setStatusCode(400).end();
		}
	
	}

	private void buildinplandownload(RoutingContext ctx) {
		System.out.println("headers: " + ctx.request().headers());
		System.out.println("body: " + ctx.getBodyAsString());
		JsonObject ret = new JsonObject();
		ret.put("rc", "0");
		ret.put("rm", "");
		ret.put("d", new JsonObject());
		
		String productid = ctx.request().getHeader("pi");
		String productversion = ctx.request().getHeader("pv");
		
		if (productid == null || StringUtils.isEmpty(productid) || productversion == null || StringUtils.isEmpty(productversion)) {
			ret.put("rc", "-2");
			ret.put("rm", "非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		JsonObject req = ctx.getBodyAsJson();
		
		if (req == null || req.isEmpty()) {
			ret.put("rc", "-1");
			ret.put("rm", "请求参数不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		JsonObject data = req.getJsonObject("d");
		
		if (data == null || data.isEmpty()) {
			ret.put("rc", "-1");
			ret.put("rm", "内建计划参数不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		String buildinplan = data.getString("pi");
		
		if (buildinplan == null || StringUtils.isEmpty(buildinplan)) {
			ret.put("rc", "-1");
			ret.put("rm", "内建计划数据不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		List<Future<JsonObject>> futures = new LinkedList<>();
		
		Future<JsonObject> buildin = Future.future();
		futures.add(buildin);
		
		mongodb.findOne("sha_plan_buildin", new JsonObject().put("pi", buildinplan), new JsonObject(), findOne -> {
			System.out.println("Find build-in plan returned.");
			if (findOne.succeeded()) {
				buildin.complete(new JsonObject().put("name", "plan").put("value", findOne.result()));
			} else {
				buildin.fail(findOne.cause());
			}
		});
		
		Future<JsonObject> buildinagendas = Future.future();
		futures.add(buildinagendas);

		mongodb.find("sha_plan_buildin_agendas", new JsonObject().put("pi", buildinplan), find -> {
			System.out.println("Find agendas returned.");
			if (find.succeeded()) {
				buildinagendas.complete(new JsonObject().put("name", "agendas").put("value", find.result()));
			} else {
				buildinagendas.fail(find.cause());
			}
		});

		CompositeFuture.all(Arrays.asList(futures.toArray(new Future[futures.size()])))
		.map(v -> futures.stream().map(Future::result).collect(Collectors.toList()))
		.setHandler(handler -> {
			System.out.println("All search returned.");
			if (handler.succeeded()) {
				List<JsonObject> results = handler.result();
				
				JsonObject retdata = new JsonObject();

				for (JsonObject result : results) {
					System.out.println(result.encode());
					if ("plan".equals(result.getString("name"))) {
						retdata.put("pn", result.getValue("value"));
					}
					
					if ("agendas".equals(result.getString("name"))) {
						retdata.put("pa", result.getValue("value"));
					}
				}
				
				ret.put("d", retdata);
				
				ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			} else {
				ret.put("rc", "-3");
				ret.put("rm", handler.cause().getMessage());
				
				ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			}
		});

	}
}
