package com.xiaoji.duan.bac;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.FindOptions;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.CorsHandler;

public class MainVerticle extends AbstractVerticle {

	private MongoClient mongodb = null;

	@Override
	public void start(Future<Void> startFuture) throws Exception {

		JsonObject config = new JsonObject();
		config.put("host", "mongodb");
		config.put("port", 27017);
		config.put("keepAlive", true);
		mongodb = MongoClient.createShared(vertx, config);

		Router router = Router.router(vertx);
		
		router.route().handler(CorsHandler.create("*").allowedHeader("*"));

		router.route("/bac/backup").handler(BodyHandler.create());
		router.route("/bac/recover").handler(BodyHandler.create());
		router.route("/bac/latest").handler(BodyHandler.create());

		router.route("/bac/backup").handler(this::backup);
		router.route("/bac/recover").handler(this::recover);
		router.route("/bac/latest").handler(this::latest);

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

	/**
	 * 客户端上传数据进行备份
	 * 数据自带Id，服务器端不考虑版本问题
	 * 相同设备和Id的直接更新
	 * 同时支持差分和全版本备份
	 * 
	 * 请求 {
	 *   数据(d): {
	 *     备份时间戳(dts): long,
	 *     表名1: [{...}, {...}, ...],
	 *     表名1: [{...}, {...}, ...]
	 *   }
	 * }
	 * 
	 * 响应 {
	 *   返回码(rc): string,
	 *   返回消息(rm): string,
	 *   数据(d): {
	 *     备份时间戳(bts): long
	 *   }
	 * }
	 * 
	 * @param ctx
	 */
	private void backup(RoutingContext ctx) {
		
		JsonObject ret = new JsonObject();
		ret.put("rc", "0");
		ret.put("rm", "");
		ret.put("d", new JsonObject());
		
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
			ret.put("rm", "备份数据不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		Long backuptimestamp = data.getLong("bts", System.currentTimeMillis());
		
		List<Future> futures = new ArrayList<Future>();
		
		for (String tablename : req.fieldNames()) {
			Object tablevalues = req.getValue(tablename);
			
			if (tablevalues instanceof JsonArray) {
				Future future = Future.future();
				
				futures.add(future);
				backuptable(future, accountid, tablename, backuptimestamp, (JsonArray) tablevalues);
			}
		}
		
		if (futures.size() > 0) {
			CompositeFuture.all(Arrays.asList(futures.toArray(new Future[futures.size()]))).setHandler(handler -> {
				if (handler.succeeded()) {
					savelatest(accountid, backuptimestamp);
					ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
				} else {
					ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
				}
			});
		} else {
			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
		}
	}
	
	private void backuptable(Future future, String accountid, String tablename, Long backuptimestamp, JsonArray tablevalues) {
		
		List<Future> backupFutures = new ArrayList<Future>();
		
		for (int pos = 0; pos < tablevalues.size(); pos++) {
			JsonObject value = tablevalues.getJsonObject(pos);

			if (value.containsKey("op")) {
				// 存在操作标志
				String op = value.getString("op");
				op = op == null ? "save" : op.trim().toLowerCase();

				JsonObject data = value.copy();
				data.remove("op");
				
				// 新建/更新
				if ("add".equals(op) || "save".equals(op) || "update".equals(op)) {
					Future opFuture = Future.future();
					backupFutures.add(opFuture);
					data.put("accountid", accountid);
					data.put("backuptimestamp", backuptimestamp);
					
					savedata(opFuture, tablename, data);
				}
				
				if ("delete".equals(op) || "remove".equals(op)) {
					Future opFuture = Future.future();
					backupFutures.add(opFuture);
					
					removedata(opFuture, tablename, data);
				}
			} else {
				// 不存在操作标志
				System.out.println("Backup with no operation @" + tablename + " => " + value.encode());

				Future opFuture = Future.future();
				backupFutures.add(opFuture);
				JsonObject data = value.copy();
				data.put("accountid", accountid);
				data.put("backuptimestamp", backuptimestamp);

				savedata(opFuture, tablename, data);
			}
		}
		
		if (backupFutures.size() < 1 || backupFutures.isEmpty()) {
			future.complete();
		} else {
			CompositeFuture.all(Arrays.asList(backupFutures.toArray(new Future[backupFutures.size()]))).compose(mapper -> {
				future.complete();
			}, future);
		}
	}
	
	private void savedata(Future future, String tablename, JsonObject data) {
		mongodb.save("bac_" + tablename, data, save -> {
			if (save.succeeded()) {
				future.complete();
			} else {
				future.fail(save.cause());
			}
		});
	}
	
	private void removedata(Future future, String tablename, JsonObject data) {
		JsonObject condition = new JsonObject();
		condition.put("Id", data.getString("Id"));
		condition.put("deviceId", data.getString("deviceId"));
		
		mongodb.removeDocument("bac_" + tablename, data, remove -> {
			if (remove.succeeded()) {
				future.complete();
			} else {
				future.fail(remove.cause());
			}
		});
	}

	private void recover(RoutingContext ctx) {
		
		JsonObject ret = new JsonObject();
		ret.put("rc", "0");
		ret.put("rm", "");
		ret.put("d", new JsonObject());
		
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
			ret.put("rm", "备份恢复参数不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		Long backuptimestamp = data.getLong("bts");
		JsonArray recoverTables = data.getJsonArray("rdn");

		if (backuptimestamp == null || recoverTables == null || recoverTables.isEmpty()) {
			ret.put("rc", "-1");
			ret.put("rm", "备份恢复参数不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		List<Future> futures = new ArrayList<Future>();

		for (int pos = 0; pos < recoverTables.size(); pos++) {
			String tablename = recoverTables.getString(pos);
			
			Future future = Future.future();
			futures.add(future);
			
			querybackup(future, accountid, tablename, backuptimestamp);
		}

		if (futures.size() < 1 || futures.isEmpty()) {
			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
		} else {
			CompositeFuture.all(Arrays.asList(futures.toArray(new Future[futures.size()])))
			.map(v -> futures.stream().map(Future::result).collect(Collectors.toList()))
			.setHandler(handler -> {
				if (handler.succeeded()) {
					List<Object> results = handler.result();
					
					JsonObject retdata = new JsonObject();
					
					for (Object result : results) {
						if (result instanceof JsonObject) {
							JsonObject backup = (JsonObject) result;
							
							retdata.put(backup.getString("tablename"), backup.getJsonArray("tablevalues", new JsonArray()));
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

	private void querybackup(Future future, String accountid, String tablename, Long backuptimestamp) {
		JsonObject condition = new JsonObject();
		condition.put("accountid", accountid);
		condition.put("backuptimestamp", backuptimestamp);
		
		mongodb.find("bac_" + tablename, condition, find -> {
			if (find.succeeded()) {
				JsonObject backups = new JsonObject();
				backups.put("tablename", tablename);
				backups.put("tablevalues", find.result());
				
				future.complete(backups);
			} else {
				future.fail(find.cause());
			}
		});
	}
	
	private void savelatest(String accountid, Long backuptimestamp) {
		mongodb.save("bac_latest", new JsonObject().put("accountid", accountid).put("backuptimestamp", backuptimestamp), save -> {});
	}
	
	private void latest(RoutingContext ctx) {

		JsonObject ret = new JsonObject();
		ret.put("rc", "0");
		ret.put("rm", "");
		ret.put("d", new JsonObject());
		
		String accountid = ctx.request().getHeader("ai");
		
		if (accountid == null || accountid.isEmpty()) {
			ret.put("rc", "-2");
			ret.put("rm", "非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		mongodb.findWithOptions("bac_latest", new JsonObject().put("accountid", accountid), new FindOptions().setSort(new JsonObject().put("backuptimestamp", -1)).setLimit(1), find -> {
			if (find.succeeded()) {
				List<JsonObject> results = find.result();
				
				if (results == null || results.isEmpty()) {
					ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
				} else {
					JsonObject retdata = new JsonObject();
					retdata.put("backuptimestamp", results.get(0).getLong("results"));
					
					ret.put("d", retdata);
					
					ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
				}
			} else {
				ret.put("rc", "-3");
				ret.put("rm", find.cause().getMessage());

				ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			}
		});
	}
}
