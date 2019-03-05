package com.xiaoji.duan.sha;

import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.CorsHandler;
import io.vertx.ext.web.handler.StaticHandler;
import io.vertx.ext.web.handler.TemplateHandler;
import io.vertx.ext.web.templ.thymeleaf.ThymeleafTemplateEngine;

public class MainVerticle extends AbstractVerticle {

	private ThymeleafTemplateEngine thymeleaf = null;
	private MongoClient mongodb = null;

	@Override
	public void start(Future<Void> startFuture) throws Exception {
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
		
		router.route().handler(CorsHandler.create("*").allowedHeader("*"));
		
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

		router.route("/sha").path("/agenda/share").handler(templatehandler);
		router.route("/sha").path("/plan/share").handler(templatehandler);

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
		
		JsonObject req = ctx.getBodyAsJson();
		
		if (req == null || req.isEmpty()) {
			ret.put("rc", "-1");
			ret.put("rm", "请求参数不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		String accountid = req.getString("ai");
		
		if (accountid == null || accountid.isEmpty()) {
			ret.put("rc", "-2");
			ret.put("rm", "非法请求!");

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
		
		mongodb.save("sha_agenda", agenda, save -> {
			if (save.succeeded()) {
				JsonObject retdata = new JsonObject();
				retdata.put("asurl", "https://pluto.guobaa.com/sha/agenda/share/" + shareId);
				
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
		String shareId = ctx.request().getParam("shareid");

		if (!StringUtils.isEmpty(shareId)) {
			JsonObject condition = new JsonObject();
			condition.put("_id", shareId);
			
			mongodb.findOne("sha_agenda", condition, new JsonObject(), findOne -> {
				if (findOne.succeeded()) {
					JsonObject agenda = findOne.result();
					
					ctx.put("agenda", agenda);
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
		
		JsonObject req = ctx.getBodyAsJson();
		
		if (req == null || req.isEmpty()) {
			ret.put("rc", "-1");
			ret.put("rm", "请求参数不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		String accountid = req.getString("ai");
		
		if (accountid == null || accountid.isEmpty()) {
			ret.put("rc", "-2");
			ret.put("rm", "非法请求!");

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
		
		mongodb.save("sha_plan", plan, save -> {
			if (save.succeeded()) {
				JsonObject retdata = new JsonObject();
				retdata.put("psurl", "https://pluto.guobaa.com/sha/plan/share/" + shareId);
				
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
					
					ctx.put("plan", plan);
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
		
		JsonObject buildinplan = data.getJsonObject("bipi");
		
		if (buildinplan == null || buildinplan.isEmpty()) {
			ret.put("rc", "-1");
			ret.put("rm", "内建计划数据不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		List<Future<JsonObject>> futures = new LinkedList<>();
		
		Future<JsonObject> buildin = Future.future();
		futures.add(buildin);
		
		mongodb.findOne("sha_plan_buildin", new JsonObject().put("planid", buildinplan), new JsonObject(), findOne -> {
			if (findOne.succeeded()) {
				buildin.complete(new JsonObject().put("name", "plan").put("value", findOne.result()));
			} else {
				buildin.fail(findOne.cause());
			}
		});
		
		Future<JsonObject> buildinagendas = Future.future();
		futures.add(buildinagendas);

		mongodb.find("sha_plan_buildin_agendas", new JsonObject().put("planid", buildinplan), find -> {
			if (find.succeeded()) {
				buildinagendas.complete(new JsonObject().put("name", "agendas").put("value", find.result()));
			} else {
				buildinagendas.fail(find.cause());
			}
		});
		
		CompositeFuture.all(Arrays.asList(futures.toArray(new Future[futures.size()])))
		.map(v -> futures.stream().map(Future::result).collect(Collectors.toList()))
		.setHandler(handler -> {
			if (handler.succeeded()) {
				List<JsonObject> results = handler.result();
				
				JsonObject retdata = new JsonObject();

				for (JsonObject result : results) {
					if ("plan".equals(result.getString("name"))) {
						retdata.put("pn", result.getJsonObject("value"));
					}
					
					if ("agendas".equals(result.getString("name"))) {
						retdata.put("pa", result.getJsonObject("value"));
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
