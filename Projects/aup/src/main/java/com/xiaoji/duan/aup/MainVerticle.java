package com.xiaoji.duan.aup;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashSet;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.UUID;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import io.vertx.amqpbridge.AmqpBridge;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.eventbus.MessageProducer;
import io.vertx.core.http.HttpHeaders;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
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
import io.vertx.rabbitmq.RabbitMQClient;
import io.vertx.rabbitmq.RabbitMQOptions;

public class MainVerticle extends AbstractVerticle {

	private ThymeleafTemplateEngine thymeleaf = null;
	private MongoClient mongodb = null;
	private WebClient client = null;
	private RabbitMQClient rabbitmq = null;
	private AmqpBridge bridge = null;

	@Override
	public void start(Future<Void> startFuture) throws Exception {
		client = WebClient.create(vertx);

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
		
		JsonObject config = new JsonObject();
		config.put("host", config().getString("mongo.host", "mongodb"));
		config.put("port", config().getInteger("mongo.port", 27017));
		config.put("keepAlive", config().getBoolean("mongo.keepalive", true));
		mongodb = MongoClient.createShared(vertx, config);

		initDefaultApps();
		
		thymeleaf = ThymeleafTemplateEngine.create(vertx);
		TemplateHandler templatehandler = TemplateHandler.create(thymeleaf);

		ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
		resolver.setSuffix(".html");
		resolver.setCacheable(false);
		resolver.setTemplateMode("HTML5");
		resolver.setCharacterEncoding("utf-8");
		thymeleaf.getThymeleafTemplateEngine().setTemplateResolver(resolver);

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
		router.route("/aup/static/*").handler(staticfiles);
		router.route("/aup").pathRegex("\\/.+\\.json").handler(staticfiles);

		BodyHandler datahandler = BodyHandler.create();
		router.route("/aup").pathRegex("\\/*").handler(datahandler);
		
		router.route("/aup/dologin").handler(datahandler);
		router.route("/aup/dologin").produces("application/json").handler(ctx -> this.doLogin(ctx));

		router.route("/aup/doregister").handler(datahandler);
		router.route("/aup/doregister").produces("application/json").handler(ctx -> this.doRegister(ctx));

		router.route("/aup/verifycode").handler(datahandler);
		router.route("/aup/verifycode").produces("application/json").handler(ctx -> this.sendVerifyCode(ctx));
		
		router.route("/aup/user/:unionid").handler(datahandler);
		router.get("/aup/user/:unionid").produces("application/json").handler(ctx -> this.getUserInfo(ctx));
		router.put("/aup/user/:unionid").produces("application/json").handler(ctx -> this.updateUserInfo(ctx));

		router.route("/aup/user/:phoneno/userinfo").handler(datahandler);
		router.get("/aup/user/:phoneno/userinfo").produces("application/json").handler(ctx -> this.getUserInfoSimpleByPhone(ctx));

		router.route("/aup/user/:phoneno/avatar").handler(datahandler);
		router.get("/aup/user/:phoneno/avatar").handler(ctx -> this.getAvatarByPhone(ctx));

		router.route("/aup/data/:phoneno/userinfo").handler(datahandler);
		router.get("/aup/data/:phoneno/userinfo").produces("application/json").handler(ctx -> this.getUserInfoByPhone(ctx));
		
		router.route("/aup/api/*").handler(datahandler);
		router.route("/aup/api/access_token").handler(ctx -> this.accessToken(ctx));
		router.route("/aup/api/refresh_token").handler(ctx -> this.refreshToken(ctx));
		router.route("/aup/api/userinfo").handler(ctx -> this.userinfo(ctx));

		router.route("/aup/register").handler(ctx -> this.register(ctx));
		router.route("/aup/login").handler(ctx -> this.login(ctx));
		
		router.route("/aup").pathRegex("\\/[^\\.]*").handler(templatehandler);

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

	private void getUserInfoSimpleByPhone(RoutingContext ctx) {
        String phoneno = ctx.request().getParam("phoneno");

		JsonObject ret = new JsonObject();
		ret.put("errcode", "0");
		ret.put("errmsg", "");
		ret.put("data", new JsonObject());

        mongodb.findOne("aup_user_info", new JsonObject().put("$or", new JsonArray()
        		.add(new JsonObject().put("openid", phoneno))
        		.add(new JsonObject().put("phoneno", phoneno))
        		), new JsonObject(), findOne -> {
        	if (findOne.succeeded()) {
        		JsonObject userinfo = findOne.result();
        		
        		if (userinfo == null || userinfo.isEmpty()) {
        			ret.put("errcode", "10041");
        			ret.put("errmsg", "用户不存在!");

        			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
        		} else {
        			if (!userinfo.containsKey("avatarbase64") || StringUtils.isEmpty(userinfo.getString("avatarbase64"))) {
        				String username = userinfo.getString("nickname");
						String avatarurl = getAvatarUrl(username);

						client.getAbs(avatarurl).send(handler -> {
							if (handler.succeeded()) {
								HttpResponse<Buffer> avatarresult = handler.result();
								String avatarbase64 = avatarresult.bodyAsString();
								
								userinfo.put("avatarbase64", avatarbase64);

			        			ret.put("data", new JsonObject()
			        					.put("phoneno", userinfo.getString("phoneno"))
			        					.put("nickname", userinfo.getString("nickname"))
			        					.put("avatar", userinfo.getString("avatar"))
			        					.put("avatarbase64", avatarbase64)
			        					);
			        			
			        			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
							} else {
			        			ret.put("data", new JsonObject()
			        					.put("phoneno", userinfo.getString("phoneno"))
			        					.put("nickname", userinfo.getString("nickname"))
			        					.put("avatar", userinfo.getString("avatar"))
			        					);
			        			
			        			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
							}
						});
        			} else {
            			ret.put("data", new JsonObject()
            					.put("phoneno", userinfo.getString("phoneno"))
            					.put("nickname", userinfo.getString("nickname"))
            					.put("avatar", userinfo.getString("avatar"))
            					);
            			
            			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
        			}

        		}
        	} else {
				ret.put("errcode", "-3");
				ret.put("errmsg", "服务器异常, 用户获取失败!");

				ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
        	}
        });
	}
	
	private void getAvatarByPhone(RoutingContext ctx) {
        String phoneno = ctx.request().getParam("phoneno");

		JsonObject ret = new JsonObject();
		ret.put("errcode", "0");
		ret.put("errmsg", "");
		ret.put("data", new JsonObject());

        mongodb.findOne("aup_user_info", new JsonObject().put("$or", new JsonArray()
        		.add(new JsonObject().put("openid", phoneno))
        		.add(new JsonObject().put("phoneno", phoneno))
        		), new JsonObject(), findOne -> {
        	if (findOne.succeeded()) {
        		JsonObject userinfo = findOne.result();
        		
        		if (userinfo == null || userinfo.isEmpty()) {
        			ret.put("errcode", "10041");
        			ret.put("errmsg", "用户不存在!");

        			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
        		} else {
        			if (userinfo.getString("avatar").startsWith("http")) {
            			client.getAbs(userinfo.getString("avatar")).send(handler -> {
            				if (handler.succeeded()) {
            					HttpResponse<Buffer> resp = handler.result();
                    			ctx.response().putHeader("Content-Type", "text/plain").end(resp.bodyAsString());
            				} else {
                    			ctx.response().putHeader("Content-Type", "text/plain").end("");
            				}
            			});
        			} else {
            			ctx.response().putHeader("Content-Type", "text/plain").end(userinfo.getString("avatar"));
        			}
        		}
        	} else {
				ret.put("errcode", "-3");
				ret.put("errmsg", "服务器异常, 用户获取失败!");

				ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
        	}
        });
	}
	
	private void getUserInfoByPhone(RoutingContext ctx) {
        String phoneno = ctx.request().getParam("phoneno");

		JsonObject ret = new JsonObject();
		ret.put("errcode", "0");
		ret.put("errmsg", "");
		ret.put("data", new JsonObject());

        mongodb.findOne("aup_user_info", new JsonObject().put("$or", new JsonArray()
        		.add(new JsonObject().put("openid", phoneno))
        		.add(new JsonObject().put("phoneno", phoneno))
        		), new JsonObject(), findOne -> {
        	if (findOne.succeeded()) {
        		JsonObject userinfo = findOne.result();
        		
        		if (userinfo == null || userinfo.isEmpty()) {
        			ret.put("errcode", "10041");
        			ret.put("errmsg", "用户不存在!");

        			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
        		} else {
        			if (!userinfo.containsKey("avatarbase64") || StringUtils.isEmpty(userinfo.getString("avatarbase64"))) {
        				String username = userinfo.getString("nickname");
						String avatarurl = getAvatarUrl(username);

						client.getAbs(avatarurl).send(handler -> {
							if (handler.succeeded()) {
								HttpResponse<Buffer> avatarresult = handler.result();
								String avatarbase64 = avatarresult.bodyAsString();
								
								userinfo.put("avatarbase64", avatarbase64);

								ret.put("data", userinfo);
		            			
		            			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
							} else {
		            			ret.put("data", userinfo);
		            			
		            			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
							}
						});
        			} else {
            			ret.put("data", userinfo);
            			
            			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
        			}
        		}
        	} else {
				ret.put("errcode", "-3");
				ret.put("errmsg", "服务器异常, 用户获取失败!");

				ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
        	}
        });
	}
	
	private void getUserInfo(RoutingContext ctx) {
        String unionid = ctx.request().getParam("unionid");

		JsonObject ret = new JsonObject();
		ret.put("errcode", "0");
		ret.put("errmsg", "");
		ret.put("data", new JsonObject());

        mongodb.findOne("aup_user_info", new JsonObject().put("unionid", unionid), new JsonObject(), findOne -> {
        	if (findOne.succeeded()) {
        		JsonObject userinfo = findOne.result();
        		
        		if (userinfo == null || userinfo.isEmpty()) {
        			ret.put("errcode", "10041");
        			ret.put("errmsg", "用户不存在!");

        			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
        		} else {
        			if (!userinfo.containsKey("avatarbase64") || StringUtils.isEmpty(userinfo.getString("avatarbase64"))) {
        				String username = userinfo.getString("nickname");
						String avatarurl = getAvatarUrl(username);

						client.getAbs(avatarurl).send(handler -> {
							if (handler.succeeded()) {
								HttpResponse<Buffer> avatarresult = handler.result();
								String avatarbase64 = avatarresult.bodyAsString();
								
								userinfo.put("avatarbase64", avatarbase64);

								ret.put("data", userinfo);
		            			
		            			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
							} else {
		            			ret.put("data", userinfo);
		            			
		            			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
							}
						});
        			} else {
            			ret.put("data", userinfo);
            			
            			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
        			}
        		}
        	} else {
				ret.put("errcode", "-3");
				ret.put("errmsg", "服务器异常, 用户获取失败!");

				ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
        	}
        });
	}

	private void updateUserInfo(RoutingContext ctx) {
		System.out.println("headers: " + ctx.request().headers());
		System.out.println("body: " + ctx.getBodyAsString());
        String unionid = ctx.request().getParam("unionid");

        JsonObject ret = new JsonObject();
		ret.put("errcode", "0");
		ret.put("errmsg", "");
		ret.put("data", new JsonObject());

		JsonObject req = ctx.getBodyAsJson();
		
		if (req == null || req.isEmpty()) {
			ret.put("errcode", "-1");
			ret.put("errmsg", "请求参数不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}

		System.out.println("request unionid " + unionid);
		mongodb.findOne("aup_user_info", new JsonObject().put("unionid", unionid), new JsonObject(), findOne -> {
        	if (findOne.succeeded()) {
        		JsonObject userinfo = findOne.result();
        		
        		if (userinfo == null || userinfo.isEmpty()) {
        			ret.put("errcode", "10041");
        			ret.put("errmsg", "用户不存在!");

        			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
        		} else {
        			System.out.println(userinfo.encode());
        			
        			JsonObject data = req.copy();
        			
        			data.remove("_id");
        			data.remove("openid");
        			data.remove("unionid");
        			
        			if (data.containsKey("password") && !"".equals(data.getString("password"))) {
        				String password = req.getString("password");
        				String md5password = DigestUtils.md5Hex(password);
        				
        				System.out.println("request id " + unionid + " with " + md5password + " to do update.");

        				data.put("password", md5password);
        			}
        			
        			JsonObject updateuserinfo = userinfo.copy().mergeIn(data);
        			System.out.println(updateuserinfo.encode());

        			mongodb.save("aup_user_info", updateuserinfo, save -> {
        				if (save.succeeded()) {
        					ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
        				} else {
        					ret.put("errcode", "-3");
        					ret.put("errmsg", "服务器异常, 用户信息更新失败!");

        					ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
        				}
        			});
        		}
        	} else {
				ret.put("errcode", "-3");
				ret.put("errmsg", "服务器异常, 用户获取失败!");

				ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
        	}
        });
	}
	
	private void sendVerifyCode(RoutingContext ctx) {
		System.out.println("headers: " + ctx.request().headers());
		System.out.println("body: " + ctx.getBodyAsString());
		JsonObject ret = new JsonObject();
		ret.put("errcode", "0");
		ret.put("errmsg", "");
		ret.put("data", new JsonObject());

		JsonObject req = ctx.getBodyAsJson();
		
		if (req == null || req.isEmpty()) {
			ret.put("errcode", "-1");
			ret.put("errmsg", "请求参数不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		String phoneno = req.getString("phoneno");
		
		if (phoneno == null || StringUtils.isEmpty(phoneno)) {
			ret.put("errcode", "-1");
			ret.put("errmsg", "手机号码参数不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		if (!StringUtils.isNumeric(phoneno) || phoneno.length() != 11) {
			ret.put("errcode", "10010");
			ret.put("errmsg", "手机号码不正确, 请重新输入!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}

		String code = new Random().nextInt(10) + String.valueOf((new Random().nextInt(89999)) + 10000);
		String verifykey = Base64.encodeBase64URLSafeString(UUID.randomUUID().toString().getBytes());

		System.out.println("sms starting...");
		client.head(
				config().getInteger("sms.service.port", 8080),
				config().getString("sms.service.host", "sa-sms"),
				config().getString("sms.service.starter.singlesend", "/sms/send"))
		.method(HttpMethod.POST)
		.addQueryParam("platformType", "*")
		.addQueryParam("mobile", phoneno)
		.addQueryParam("sendType", config().getString("sms.service.template.verifycode", "v94vW2"))
		.addQueryParam("sendContent", new JsonObject().put("code", code).put("time", (config().getLong("sms.expiretime", 10 * 60L) / 60) + "分钟").encode())
		.send(handler -> {
				if (handler.succeeded()) {
					System.out.println("sms response " + handler.result().statusCode() + " " + handler.result().bodyAsString());
					System.out.println("sms sent verify code message to " + phoneno + " completed. [" + code + "]");
				} else {
					handler.cause().printStackTrace();
					System.out.println("sms sent verify code message to " + phoneno + " failed. [" + code + "]");
				}
			}
		);
		System.out.println("sms end.");

		mongodb.save(
				"aup_verifycode_cache",
				new JsonObject()
				.put("verifykey", verifykey)
				.put("verifyphone", phoneno)
				.put("verifycode", code)
				.put("createtime", System.currentTimeMillis())
				.put("expiretime", config().getLong("sms.expiretime", config().getLong("sms.service.verifycode.expiretime", 10 * 60L))),
				save -> {
					if (save.succeeded()) {
						JsonObject retdata = new JsonObject();
						
						retdata.put("verifykey", verifykey);
						
						ret.put("data", retdata);
						
						ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
					} else {
						ret.put("errcode", "-3");
						ret.put("errmsg", "服务器异常, 验证码获取失败!");

						ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
					}
				}
		);
		
	}
	
	private void register(RoutingContext ctx) {
		ctx.next();
	}
	
	public static String getAvatarUrl(String username) {
		StringBuffer url = new StringBuffer("https://www.guobaa.com/aaf/base64/aup/256/avatar.png?name=");

		if (username.matches("[a-zA-Z0-9]+.*")) {
			url.append(username.charAt(0));
		} else if (username.length() > 2)
			url.append(username.substring(username.length() - 2));
		else
			url.append(username);
		
		return url.toString();
	}

	private void doRegister(RoutingContext ctx) {
		System.out.println("headers: " + ctx.request().headers());
		System.out.println("body: " + ctx.getBodyAsString());
		JsonObject ret = new JsonObject();
		ret.put("errcode", "0");
		ret.put("errmsg", "");
		ret.put("data", new JsonObject());

		JsonObject req = ctx.getBodyAsJson();
		
		if (req == null || req.isEmpty()) {
			ret.put("errcode", "-1");
			ret.put("errmsg", "请求参数不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		String phoneno = req.getString("phoneno");
		
		if (phoneno == null || StringUtils.isEmpty(phoneno)) {
			ret.put("errcode", "-1");
			ret.put("errmsg", "手机号码参数不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		if (!StringUtils.isNumeric(phoneno) || phoneno.length() != 11) {
			ret.put("errcode", "10010");
			ret.put("errmsg", "手机号码不正确, 请重新输入!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}

		String verifykey = req.getString("verifykey");
		
		if (verifykey == null || StringUtils.isEmpty(verifykey)) {
			ret.put("errcode", "-1");
			ret.put("errmsg", "验证码key参数不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		String verifycode = req.getString("verifycode");
		
		if (verifycode == null || StringUtils.isEmpty(verifycode)) {
			ret.put("errcode", "-1");
			ret.put("errmsg", "验证码key参数不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		String password = req.getString("userpassword");
		
		if (password == null || StringUtils.isEmpty(password)) {
			ret.put("errcode", "-1");
			ret.put("errmsg", "密码参数不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		String username = req.getString("username");
		
		if (username == null || StringUtils.isEmpty(username)) {
			ret.put("errcode", "-1");
			ret.put("errmsg", "姓名参数不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		mongodb.findOne("aup_verifycode_cache", new JsonObject()
				.put("verifykey", verifykey)
				.put("verifyphone", phoneno)
				.put("verifycode", verifycode), new JsonObject(), findOne -> {
					if (findOne.succeeded()) {
						JsonObject result = findOne.result();

						if (result != null && !result.isEmpty()) {
							Long createtime = result.getLong("createtime", 0L);
							Long expiretime = result.getLong("expiretime", 0L);
							
							if (System.currentTimeMillis() <= (createtime + expiretime * 1000)) {
								
								mongodb.findOne("aup_user_info",
										new JsonObject().put("openid", phoneno),
										new JsonObject(),
										findOneUser -> {
											if (findOneUser.succeeded()) {
												JsonObject userinfo = findOneUser.result() == null ? new JsonObject() : findOneUser.result();
												
												if (userinfo.isEmpty()) {
													String avatarurl = getAvatarUrl(username);

													client.getAbs(avatarurl).send(handler -> {
														if (handler.succeeded()) {
															HttpResponse<Buffer> avatarresult = handler.result();
															String avatarbase64 = avatarresult.bodyAsString();
															
															userinfo
															.put("_id", Base64.encodeBase64URLSafeString(UUID.randomUUID().toString().getBytes()))
															.put("openid", phoneno)
															.put("nickname", username)
															.put("password", DigestUtils.md5Hex(password))
															.put("unionid", UUID.randomUUID().toString())
															.put("sex", "0")
															.put("province", "")
															.put("city", "")
															.put("country", "")
															.put("avatar", avatarurl)
															.put("avatarbase64", avatarbase64)
															.put("privilege", new JsonArray());
															mongodb.save("aup_user_info", userinfo, save -> {
																if (save.succeeded()) {
																	JsonObject res = userinfo.copy();
																	res.remove("password");
			
																	ret.mergeIn(res);
																	ret.put("data", res);
																	
																	ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
																} else {
																	ret.put("errcode", "-3");
																	ret.put("errmsg", "服务器异常, 用户注册失败!");
			
																	ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
																}
															});
														} else {
															userinfo
																.put("_id", Base64.encodeBase64URLSafeString(UUID.randomUUID().toString().getBytes()))
																.put("openid", phoneno)
																.put("nickname", username)
																.put("password", DigestUtils.md5Hex(password))
																.put("unionid", UUID.randomUUID().toString())
																.put("sex", "0")
																.put("province", "")
																.put("city", "")
																.put("country", "")
																.put("avatar", getAvatarUrl(username))
																.put("privilege", new JsonArray());
															mongodb.save("aup_user_info", userinfo, save -> {
																if (save.succeeded()) {
																	JsonObject res = userinfo.copy();
																	res.remove("password");
			
																	ret.mergeIn(res);
																	ret.put("data", res);
																	
																	ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
																} else {
																	ret.put("errcode", "-3");
																	ret.put("errmsg", "服务器异常, 用户注册失败!");
			
																	ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
																}
															});
														}
													});

												} else {
													ret.put("errcode", "10020");
													ret.put("errmsg", "该手机号已注册, 注册失败!");

													ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
												}
											} else {
												ret.put("errcode", "-3");
												ret.put("errmsg", "服务器异常, 用户注册失败!");

												ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
											}
										}
								);
								
							} else {
								ret.put("errcode", "10021");
								ret.put("errmsg", "验证码错误或已失效, 注册失败!");

								ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
							}
						} else {
							ret.put("errcode", "10021");
							ret.put("errmsg", "验证码错误或已失效, 注册失败!");

							ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
						}
					} else {
						ret.put("errcode", "-3");
						ret.put("errmsg", "服务器异常, 用户注册失败!");

						ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
					}
				});
		
	}

	private void doLogin(RoutingContext ctx) {
		System.out.println("headers: " + ctx.request().headers());
		System.out.println("body: " + ctx.getBodyAsString());
		JsonObject ret = new JsonObject();
		ret.put("errcode", "0");
		ret.put("errmsg", "");
		ret.put("data", new JsonObject());

		JsonObject req = ctx.getBodyAsJson();
		
		if (req == null || req.isEmpty()) {
			ret.put("errcode", "-1");
			ret.put("errmsg", "请求参数不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		String phoneno = req.getString("phoneno");
		
		if (phoneno == null || StringUtils.isEmpty(phoneno)) {
			ret.put("errcode", "-1");
			ret.put("errmsg", "手机号码参数不存在, 非法请求!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}
		
		if (!StringUtils.isNumeric(phoneno) || phoneno.length() != 11) {
			ret.put("errcode", "10010");
			ret.put("errmsg", "手机号码不正确, 请重新输入!");

			ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
			return;
		}

		String password = req.getString("userpassword");
		String verifykey = req.getString("verifykey");
		String verifycode = req.getString("verifycode");
		
		if (StringUtils.isEmpty(password)) {
			if (verifykey == null || StringUtils.isEmpty(verifykey)) {
				ret.put("errcode", "-1");
				ret.put("errmsg", "验证码key参数不存在, 非法请求!");
	
				ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
				return;
			}
			
			
			if (verifycode == null || StringUtils.isEmpty(verifycode)) {
				ret.put("errcode", "-1");
				ret.put("errmsg", "验证码key参数不存在, 非法请求!");
	
				ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
				return;
			}
		} else {
			System.out.println(DigestUtils.md5Hex(password));
			if (password == null || StringUtils.isEmpty(password)) {
				ret.put("errcode", "-1");
				ret.put("errmsg", "密码参数不存在, 非法请求!");
	
				ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
				return;
			}
		}
		
		String state = req.getString("state", "");

		// 短信登录
		if (StringUtils.isEmpty(password)) {
			mongodb.findOne("aup_verifycode_cache", new JsonObject()
				.put("verifykey", verifykey)
				.put("verifyphone", phoneno)
				.put("verifycode", verifycode), new JsonObject(), findOne -> {
					if (findOne.succeeded()) {
						JsonObject result = findOne.result();

						if (result != null && !result.isEmpty()) {
							Long createtime = result.getLong("createtime", 0L);
							Long expiretime = result.getLong("expiretime", 0L);
							
							if (System.currentTimeMillis() <= (createtime + expiretime * 1000)) {
								
								mongodb.findOne("aup_user_info",
										new JsonObject()
										.put("openid", phoneno),
										new JsonObject(),
										findOneUser -> {
											if (findOneUser.succeeded()) {
												JsonObject userinfo = findOneUser.result();
												
												if (userinfo != null && !userinfo.isEmpty()) {

													userinfo.put("_id", Base64.encodeBase64URLSafeString(UUID.randomUUID().toString().getBytes()));
													mongodb.save("aup_user_access", userinfo, insert -> {
														if (insert.succeeded()) {

															JsonObject access = new JsonObject()
																	.put("code", userinfo.getString("_id"))
																	.put("openid", userinfo.getString("openid"))
																	.put("unionid", userinfo.getString("unionid"))
																	.put("state", state);

															mongodb.save("aup_user_access", new JsonObject().mergeIn(req.copy()).mergeIn(userinfo).mergeIn(access), save -> {});
															ret.mergeIn(access);
															ret.put("data", access);
															
															ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
														} else {
															ret.put("errcode", "-3");
															ret.put("errmsg", "服务器异常, 用户登录失败!");

															ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
														}
													});
													
												} else {
													ret.put("errcode", "10031");
													ret.put("errmsg", "密码错误或用户不存在, 登录失败!");

													ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
												}
											} else {
												ret.put("errcode", "-3");
												ret.put("errmsg", "服务器异常, 用户登录失败!");

												ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
											}
										});
								
							} else {
								ret.put("errcode", "10021");
								ret.put("errmsg", "验证码错误或已失效, 登录失败!");

								ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
							}
						} else {
							ret.put("errcode", "10021");
							ret.put("errmsg", "验证码错误或已失效, 登录失败!");

							ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
						}
					} else {
						ret.put("errcode", "-3");
						ret.put("errmsg", "服务器异常, 用户登录失败!");

						ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
					}
				});
		} else {
			String md5password = DigestUtils.md5Hex(password);
			System.out.println("request id " + phoneno + " with " + md5password + " to do login.");
			// 密码登录
			mongodb.findOne("aup_user_info",
				new JsonObject()
				.put("openid", phoneno)
				.put("password", md5password),
				new JsonObject(),
				findOneUser -> {
					if (findOneUser.succeeded()) {
						JsonObject userinfo = findOneUser.result();
						
						if (userinfo != null && !userinfo.isEmpty()) {

							userinfo.put("_id", Base64.encodeBase64URLSafeString(UUID.randomUUID().toString().getBytes()));
							mongodb.save("aup_user_access", userinfo, insert -> {
								if (insert.succeeded()) {

									JsonObject access = new JsonObject()
											.put("code", userinfo.getString("_id"))
											.put("openid", userinfo.getString("openid"))
											.put("unionid", userinfo.getString("unionid"))
											.put("state", state);

									mongodb.save("aup_user_access", new JsonObject().mergeIn(req.copy()).mergeIn(userinfo).mergeIn(access), save -> {});
									ret.mergeIn(access);
									ret.put("data", access);
									
									ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
								} else {
									ret.put("errcode", "-3");
									ret.put("errmsg", "服务器异常, 用户登录失败!");

									ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
								}
							});
							
						} else {
							ret.put("errcode", "10031");
							ret.put("errmsg", "密码错误或用户不存在, 登录失败!");

							ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
						}
					} else {
						ret.put("errcode", "-3");
						ret.put("errmsg", "服务器异常, 用户登录失败!");

						ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(ret.encode());
					}
				});
		}
	}
	
	private void login(RoutingContext ctx) {
		// OAuth Check
        String appId = ctx.request().getParam("appid");
        String redirectUri = ctx.request().getParam("redirect_uri");
        String responseType = ctx.request().getParam("response_type");
        String scope = ctx.request().getParam("scope");
        String state = ctx.request().getParam("state");
        
        JsonObject oauth = new JsonObject()
        		.put("appid", appId)
        		.put("redirecturi", redirectUri)
        		.put("responsetype", responseType)
        		.put("scope", scope)
        		.put("state", state);
        
        System.out.println(oauth.encode());
        
        if (redirectUri != null && !StringUtils.isEmpty(redirectUri)) {
        	// OAuth
	        String site = "";
	        
	        try {
				site = new URL(redirectUri).getHost();
				
				if (site.contains(":")) {
					site = site.substring(0, site.indexOf(":"));
				}
			} catch (MalformedURLException e) {
				System.out.println(e.getMessage());
			}
	        
	        JsonObject query = new JsonObject()
	        		.put("appid", appId)
	        		.put("site", site);
	        
	        if (config().getBoolean("debug")) {
				ctx.put("oauth", oauth.mapTo(Map.class));
				ctx.next();
	        } else {
	        
		        mongodb.findOne("aup_oauth_apps", query, new JsonObject(), ar -> {
		        	if (ar.succeeded()) {
		        		JsonObject oauthapp = ar.result();
		        		
		        		if (oauthapp != null && !oauthapp.isEmpty()) {
		        			ctx.put("oauth", oauth.mapTo(Map.class));
		        			ctx.next();
		        		} else {
		        			ctx.response().putHeader(HttpHeaders.CONTENT_TYPE, "text/plain;charset=utf-8").end("非法AppId或网站请求!");
		        		}
		        	} else {
		    			ctx.response().putHeader(HttpHeaders.CONTENT_TYPE, "text/plain;charset=utf-8").end("非法AppId或网站请求!");
		        	}
		        });
	        }
        } else {
        	// Origin auth
        	oauth
			.put("appid", Base64.encodeBase64URLSafeString(config().getString("apps.default.appid", "www.guobaa.com").getBytes()))
    		.put("redirecturi", "https://www.guobaa.com")
    		.put("responsetype", "code")
    		.put("scope", "snsapi_login")
    		.put("state", "");

			ctx.put("oauth", oauth.mapTo(Map.class));
			ctx.next();
        }
	}

	private void accessToken(RoutingContext ctx) {
		HttpServerRequest req = ctx.request();
		
        String appId = req.getParam("appid");
        String secret = req.getParam("secret");
        String code = req.getParam("code");
        String grantType = req.getParam("grant_type");
        
        System.out.println("appId:" + appId);
        System.out.println("secret:" + secret);
        System.out.println("code:" + code);
        System.out.println("grantType:" + grantType);
        
        mongodb.findOne("aup_oauth_apps",
        		new JsonObject()
        		.put("appid", appId)
        		.put("secret", secret), new JsonObject(), findOne -> {
        			if (findOne.succeeded()) {
        				JsonObject app = findOne.result();
        				
        				if (app == null || app.isEmpty()) {
        					ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(new JsonObject().put("errcode", 10001).put("errmsg", "Access Token取得失败").encode());
        				} else {
        					
        					mongodb.findOne("aup_user_access",
        							new JsonObject().put("code", code),
        							new JsonObject(),
        							update -> {
        								if (update.succeeded()) {
        									JsonObject access = update.result();

        									access
        					        		.put("appid", appId)
                							.put("access_token", Base64.encodeBase64URLSafeString(UUID.randomUUID().toString().getBytes()))
                							.put("refresh_token", Base64.encodeBase64URLSafeString(UUID.randomUUID().toString().getBytes()))
                							.put("access_time", System.currentTimeMillis())
                							.put("expires_in", 0);	// 0表示永不过期, 一个月过期设置 60 * 60 * 24 * 31
        									
        									mongodb.save("aup_user_access", access, updateAT -> {});
        									
        									JsonObject retaccess = access.copy();
        									retaccess.remove("_id");
        									retaccess.remove("userpassword");
        									retaccess.remove("password");
        									retaccess.remove("code");
        									retaccess.remove("state");
        									retaccess.put("scope", "snsapi_login, snsapi_userinfo");

        									String deviceId = Base64.encodeBase64URLSafeString((req.getHeader("di") == null || "".equals(req.getHeader("di"))) ? req.getHeader("x-real-ip").getBytes() : req.getHeader("di").getBytes());
        									String queue = retaccess.getString("openid") + "." + deviceId;
        									String exchange = "exchange.mwxing.direct";
        									String announceexchange = "exchange.mwxing.fanout";
        									String routingkey = "mwxing.announce";
        									String routingkeyAccount = "mwxing." + retaccess.getString("unionid");
        									String routingkeyDevice = "mwxing." + retaccess.getString("unionid") + "." + deviceId;
        									retaccess.put("cmq", queue);

        									rabbitmq.exchangeDeclare(exchange, "direct", true, false, handler -> {
        										if (handler.succeeded()) {
        										    System.out.println("Exchange " + exchange + " successfully declared with fanout");
        										} else {
        											handler.cause().printStackTrace();
        										}
        									});
        									rabbitmq.exchangeDeclare(announceexchange, "fanout", true, false, handler -> {
        										if (handler.succeeded()) {
        										    System.out.println("Exchange " + announceexchange + " successfully declared with fanout");
        										} else {
        											handler.cause().printStackTrace();
        										}
        									});
        									rabbitmq.queueDeclare(queue, true, false, false, handler -> {
        										if (handler.succeeded()) {
        										    System.out.println("Queue " + queue + " successfully declared");
        										} else {
        											handler.cause().printStackTrace();
        										}
        									});
        									rabbitmq.queueBind(queue, announceexchange, routingkey, handler -> {
        										if (handler.succeeded()) {
        										    System.out.println("Queue " + queue + " successfully binded to Exchange " + announceexchange + " with routing key " + routingkey);
        										} else {
        											handler.cause().printStackTrace();
        										}
        									});
        									rabbitmq.queueBind(queue, exchange, routingkeyAccount, handler -> {
        										if (handler.succeeded()) {
        										    System.out.println("Queue " + queue + " successfully binded to Exchange " + exchange + " with routing key " + routingkeyAccount);
        										} else {
        											handler.cause().printStackTrace();
        										}
        									});
        									rabbitmq.queueBind(queue, exchange, routingkeyDevice, handler -> {
        										if (handler.succeeded()) {
        										    System.out.println("Queue " + queue + " successfully binded to Exchange " + exchange + " with routing key " + routingkeyDevice);
        										} else {
        											handler.cause().printStackTrace();
        										}
        									});
        									
        									// 发送未注册用户缓存消息
        									MessageProducer<JsonObject> producer = bridge.createProducer("mwxing_agenda_notification_stored_activation");

        									JsonObject body = new JsonObject().put("context", new JsonObject().put("openid", retaccess.getString("openid")));
        									producer.send(new JsonObject().put("body", body));
        									
        									System.out.println("Exist user login " + retaccess.encode());

        									ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(retaccess.encode());
        								} else {
        									ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(new JsonObject().put("errcode", 10001).put("errmsg", "Access Token取得失败").encode());
        								}
        							}
        					);
        				}
        			} else {
        				ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(new JsonObject().put("errcode", 10001).put("errmsg", "Access Token取得失败").encode());
        			}
        		});
	}

	private void refreshToken(RoutingContext ctx) {
		HttpServerRequest req = ctx.request();
		
        String appId = req.getParam("appid");
        String refreshToken = req.getParam("refresh_token");
        String grantType = req.getParam("grant_type");

        System.out.println("Refresh token appId:" + appId + ", refreshToken:" + refreshToken + ", grantType:" + grantType);
        mongodb.findOne("aup_user_access",
				new JsonObject()
				.put("appid", appId)
				.put("refresh_token", refreshToken),
				new JsonObject(),
				findOne -> {
					if (findOne.succeeded()) {
						JsonObject refreshTokenUser = findOne.result();
						
						if (refreshTokenUser != null && !refreshTokenUser.isEmpty()) {
							
							Long accessTime = refreshTokenUser.getLong("access_time");
							Long expiresIn = refreshTokenUser.getLong("expires_in");
							
							if (expiresIn != 0 && System.currentTimeMillis() <= accessTime + (expiresIn * 1000)) {
						        System.out.println("Refresh token get failed for expired.");
						        ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(new JsonObject().put("errcode", 10004).put("errmsg", "登录已失效,请重新登录.").encode());
							} else {
								refreshTokenUser.remove("_id");
								refreshTokenUser.remove("phoneno");
								refreshTokenUser.remove("userpassword");
								refreshTokenUser.remove("code");
								refreshTokenUser.remove("password");
								
								ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(refreshTokenUser.encode());
							}
							
						} else {
					        System.out.println("Refresh token get failed for no matched user access.");
					        ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(new JsonObject().put("errcode", 10003).put("errmsg", "Refresh token取得失败").encode());
						}
					} else {
				        System.out.println("Refresh token get failed for query error.");
				        ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(new JsonObject().put("errcode", 10003).put("errmsg", "Refresh token取得失败").encode());
					}
				});        
	}

	private void userinfo(RoutingContext ctx) {
		HttpServerRequest req = ctx.request();
		
        String openId = req.getParam("openid");
        String accessToken = req.getParam("access_token");
        
        System.out.println("Userinfo openId:" + openId + ", accessToken:" + accessToken);

		mongodb.findOne("aup_user_access",
				new JsonObject()
				.put("openid", openId)
				.put("access_token", accessToken),
				new JsonObject(),
				findOne -> {
					if (findOne.succeeded()) {
						JsonObject access = findOne.result();
						
						if (access != null && !access.isEmpty()) {
							System.out.println("accessinfo " + access.encode());

							mongodb.findOne("aup_user_info",
									new JsonObject().put("unionid", access.getString("unionid")),
									new JsonObject(),
									findUser -> {
										if (findUser.succeeded()) {
											JsonObject userinfo = findUser.result();
											
											System.out.println("userinfo " + userinfo);
											
											if (userinfo != null && !userinfo.isEmpty()) {
												userinfo.remove("password");
												userinfo.remove("_id");
												
												ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(userinfo.encode());
											} else {
												ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(new JsonObject().put("errcode", 10002).put("errmsg", "userinfo取得失败").encode());
											}
										} else {
											ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(new JsonObject().put("errcode", 10002).put("errmsg", "userinfo取得失败").encode());
										}
									}
							);
						} else {
							ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(new JsonObject().put("errcode", 10002).put("errmsg", "userinfo取得失败").encode());
						}
					} else {
						ctx.response().putHeader("Content-Type", "application/json;charset=UTF-8").end(new JsonObject().put("errcode", 10002).put("errmsg", "userinfo取得失败").encode());
					}
				}
		);
	}

	private void connectStompServer() {
		bridge.start(config().getString("stomp.server.host", "sa-amq"),
				config().getInteger("stomp.server.port", 5672), res -> {
					if (res.failed()) {
						res.cause().printStackTrace();
						connectStompServer();
					} else {
						System.out.println("Stomp server connected.");
					}
				});
	}
	
	private void initDefaultApps() {
		mongodb.save("aup_oauth_apps", 
				new JsonObject()
				.put("_id", Base64.encodeBase64URLSafeString(config().getString("apps.default.appid", "www.guobaa.com").getBytes()))
				.put("appid", Base64.encodeBase64URLSafeString(config().getString("apps.default.appid", "www.guobaa.com").getBytes()))
				.put("secret", Base64.encodeBase64URLSafeString(config().getString("apps.default.secret", "secret@www.guobaa.com").getBytes()))
				.put("site", config().getString("apps.default.site", "www.guobaa.com")),
				ar -> {
					if (ar.succeeded()) {
						System.out.println("Default site appid initialized.");
					} else {
						System.out.println("Default site appid initialize failed.");
					}
				}
		);
	}
}
