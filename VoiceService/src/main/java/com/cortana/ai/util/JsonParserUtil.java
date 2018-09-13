package com.cortana.ai.util;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 * Json结果解析类
 *
 * create by wzy on 2018/09/14
 */
public class JsonParserUtil {

	/**
	 * 解析讯飞回传数据
	 *
	 * @param json
	 * @return
	 */
	public static Map parse(String json) {
		Map<String, Object> data = new TreeMap<>();

		try {

			JSONObject jsonDataBack = new JSONObject(json);
			JSONArray jsonData = jsonDataBack.getJSONArray("data");
			JSONObject jsonArray = jsonData.getJSONObject(0);
			JSONObject jsonIntent = jsonArray.getJSONObject("intent");
			Integer flag = jsonIntent.getInt("rc");
			if (flag == 4) {
				return null;
			}
			if (flag == 0) {

				//语音播报字段
				JSONObject jsonAnswer = jsonIntent.getJSONObject("answer");
				String answer = jsonAnswer.getString("text");
				data.put("speech", answer);

				//获取语义目的动作
				JSONArray jsonResult = jsonIntent.getJSONObject("data").getJSONArray("result");
				JSONObject jsonAction = jsonResult.getJSONObject(0);
				int actionFlag = jsonAction.getInt("code");

				//获取各项数据字段
				JSONArray jsonSemantic = jsonIntent.getJSONArray("semantic");
				JSONArray jsonSlots = jsonSemantic.getJSONObject(0).getJSONArray("slots");
				List userNameList = new ArrayList();
				String scheduleName;
				String scheduleStartTime;
				String scheduleDeadline;
				for (int i = 0; i < jsonSlots.length(); i++) {
					JSONObject jsonSlotData = jsonSlots.getJSONObject(i);
					String name = jsonSlotData.getString("name");				//字段名
					String normValue = jsonSlotData.getString("normValue");	//对应字段数据
					String value = jsonSlotData.getString("value");			//对应用户语音解析

					switch (name) {
						case "person":
							break;
						case "time":
							break;
						case "schedule":
							break;
					}

				}


			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return data;
	}

	public static String parseIatResult(String json) {
		StringBuffer ret = new StringBuffer();
		try {
			JSONTokener tokener = new JSONTokener(json);
			JSONObject joResult = new JSONObject(tokener);

			JSONArray words = joResult.getJSONArray("ws");
			for (int i = 0; i < words.length(); i++) {
				// 转写结果词，默认使用第一个结果
				JSONArray items = words.getJSONObject(i).getJSONArray("cw");
				JSONObject obj = items.getJSONObject(0);
				ret.append(obj.getString("w"));
//				如果需要多候选结果，解析数组其他字段
//				for(int j = 0; j < items.length(); j++)
//				{
//					JSONObject obj = items.getJSONObject(j);
//					ret.append(obj.getString("w"));
//				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} 
		return ret.toString();
	}
	
	public static String parseGrammarResult(String json) {
		StringBuffer ret = new StringBuffer();
		try {
			JSONTokener tokener = new JSONTokener(json);
			JSONObject joResult = new JSONObject(tokener);

			JSONArray words = joResult.getJSONArray("ws");
			for (int i = 0; i < words.length(); i++) {
				JSONArray items = words.getJSONObject(i).getJSONArray("cw");
				for(int j = 0; j < items.length(); j++)
				{
					JSONObject obj = items.getJSONObject(j);
					if(obj.getString("w").contains("nomatch"))
					{
						ret.append("没有匹配结果.");
						return ret.toString();
					}
					ret.append("【结果】" + obj.getString("w"));
					ret.append("【置信度】" + obj.getInt("sc"));
					ret.append("\n");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			ret.append("没有匹配结果.");
		} 
		return ret.toString();
	}
}
