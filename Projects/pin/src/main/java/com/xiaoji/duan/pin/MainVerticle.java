package com.xiaoji.duan.pin;

import java.util.List;

import com.github.promeg.pinyinhelper.Pinyin;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.Option;

import io.vertx.amqpbridge.AmqpBridge;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.eventbus.Message;
import io.vertx.core.eventbus.MessageConsumer;
import io.vertx.core.eventbus.MessageProducer;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

public class MainVerticle extends AbstractVerticle {

	private AmqpBridge bridge = null;

	@Override
	public void start(Future<Void> startFuture) throws Exception {
		bridge = AmqpBridge.create(vertx);

		bridge.endHandler(endHandler -> {
			connectStompServer();
		});
		connectStompServer();
	}

	private void connectStompServer() {
		bridge.start(config().getString("stomp.server.host", "sa-amq"), config().getInteger("stomp.server.port", 5672),
				res -> {
					if (res.failed()) {
						res.cause().printStackTrace();
						connectStompServer();
					} else {
						subscribeTrigger(config().getString("amq.app.id", "pin"));
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
		
		String type = data.getJsonObject("context").getString("type");
		Object origin = data.getJsonObject("context").getValue("data");
		String textPaths = data.getJsonObject("context").getString("text-paths");
		String text = data.getJsonObject("context").getString("text");
		String next = data.getJsonObject("context").getString("next");

		if ("IN_DATA_COVERAGE".equals(type))
			pinyin(consumer, origin, textPaths, next, 1);
		else
			pinyin(consumer, text, next, 1);
	}
	
	private void pinyin(String consumer, Object origin, String textPaths, String nextTask, Integer retry) {

		String encode = "{}";
		Object output = null;
		
		if (origin instanceof JsonObject) {
			encode = ((JsonObject) origin).encode();
			output = ((JsonObject) origin).copy();
		} else if (origin instanceof JsonArray) {
			encode = ((JsonArray) origin).encode();
			output = ((JsonArray) origin).copy();
		} else if (origin != null) {
			encode = origin.toString();
			output = origin;
		}

		try {
			String jsonpath = textPaths.replaceAll("json-path", "\\$");
			
			Configuration document = Configuration.builder().options(Option.ALWAYS_RETURN_LIST).build();
	
			List<String> values = JsonPath.using(document).parse(encode).read(jsonpath);
			System.out.println(values.toString());

			Configuration aspath = Configuration.builder().options(Option.AS_PATH_LIST).build();
			List<String> paths = JsonPath.using(aspath).parse(encode).read(jsonpath);
			
			System.out.println(paths.toString());
			
			DocumentContext setdocument = JsonPath.using(document).parse(encode);
			
			for (int i=0; i < values.size(); i++) {
				String change = values.get(i);
				setdocument.set(paths.get(i), Pinyin.toPinyin(change, "").toLowerCase());
			}
			
			output = new JsonObject(setdocument.jsonString());
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Pinyin process skipped.");
		}
		
		JsonObject nextctx = new JsonObject().put("context", new JsonObject().put("pinyin", output));
		
		MessageProducer<JsonObject> producer = bridge.createProducer(nextTask);
		producer.send(new JsonObject().put("body", nextctx));
		System.out.println("Consumer " + consumer + " send to [" + nextTask + "] result [" + nextctx.encode() + "]");

	}
	
	private void pinyin(String consumer, String text, String nextTask, Integer retry) {

		text = text == null ? "" : text;
		String pinyin = Pinyin.toPinyin(text, "");
		JsonObject nextctx = new JsonObject().put("context", new JsonObject().put("pinyin", new JsonObject().put("text", text).put("pinyin", pinyin)));
		
		MessageProducer<JsonObject> producer = bridge.createProducer(nextTask);
		producer.send(new JsonObject().put("body", nextctx));
		System.out.println("Consumer " + consumer + " send to [" + nextTask + "] result [" + nextctx.encode() + "]");

	}
	public static void main(String[] args) {
		System.out.println(Pinyin.toPinyin("Hello张金洋", ","));
		System.out.println("json-path.announceContent.content..parameters.fs[?(@.n)]".replaceAll("json-path", "\\$"));
	}
}
