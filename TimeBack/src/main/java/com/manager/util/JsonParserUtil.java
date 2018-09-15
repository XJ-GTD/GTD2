package com.manager.util;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.manager.master.dto.AiUiDataDto;
import com.sun.org.apache.bcel.internal.generic.IF_ACMPEQ;
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
	public static AiUiDataDto parse(String json) {
		AiUiDataDto aiUiData = new AiUiDataDto();

		try {

			JSONObject jsonDataBack = JSONObject.parseObject(json);
			JSONArray jsonData = jsonDataBack.getJSONArray("data");
			JSONObject jsonArray = jsonData.getJSONObject(jsonData.size()-1);
			JSONObject jsonIntent = jsonArray.getJSONObject("intent");

			Integer flag = jsonIntent.getInteger("rc");

			if (flag == 4) {
				return null;
			}
			if (flag == 0) {

				//用户语音
				String userText = jsonIntent.getString("text");
				aiUiData.setUserText(userText);
				//语音播报字段
				JSONObject jsonAnswer = jsonIntent.getJSONObject("answer");
				String speech = jsonAnswer.getString("text");
				aiUiData.setSpeech(speech);


				//获取语义目的动作
				JSONArray jsonResult = jsonIntent.getJSONObject("data").getJSONArray("result");
				JSONObject jsonAction = jsonResult.getJSONObject(0);
				int code = jsonAction.getInteger("code");
				aiUiData.setCode(code);

				//获取各项数据字段
				JSONArray jsonSemantic = jsonIntent.getJSONArray("semantic");
				JSONArray jsonSlots = jsonSemantic.getJSONObject(0).getJSONArray("slots");
				List<String> userNameList = new ArrayList<>();		//参与人
				String scheduleName = null;						//日程主题
				String scheduleStartTime = null;					//开始时间
				String scheduleDeadline = null;					//结束时间
				for (int i = 0; i < jsonSlots.size(); i++) {
					JSONObject jsonSlotData = jsonSlots.getJSONObject(i);
					String name = jsonSlotData.getString("name");				//字段名
					String normValue = jsonSlotData.getString("normValue");	//对应字段数据
					String value = jsonSlotData.getString("value");			//对应用户语音解析

					switch (name) {
						case "person":
							userNameList.add(normValue);
							break;
						case "time":
//							JSONObject obj = JSONObject.parseObject(normValue);
//							String timeList = obj.getString("0");
							normValue = normValue.substring(13);
							String[] a1 = normValue.split("\"");
							String timeList = a1[0];
							String[] dataTime = timeList.split("/");
							scheduleStartTime = dataTime[0];
							if (dataTime.length > 1){
								scheduleDeadline = dataTime[1];
							}
							break;
						case "schedule":
							scheduleName = normValue;
							break;
					}

				}

				//进行赋值操作
				aiUiData.setUserNameList(userNameList);
				aiUiData.setScheduleName(scheduleName);
				aiUiData.setScheduleStartTime(scheduleStartTime);
				aiUiData.setScheduleDeadline(scheduleDeadline);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return aiUiData;
	}


}
