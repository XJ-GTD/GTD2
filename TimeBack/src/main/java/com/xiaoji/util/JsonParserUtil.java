//package com.xiaoji.util;
//
//import com.alibaba.fastjson.JSONArray;
//import com.alibaba.fastjson.JSONObject;
//import com.xiaoji.master.dto.AiUiJsonDto;
//import com.xiaoji.master.dto.AiUiSlotsDto;
//import org.apache.logging.log4j.LogManager;
//import org.apache.logging.log4j.Logger;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Map;
//
//import static com.xiaoji.config.configuration.XFSkillConfig.*;
//import static org.apache.logging.log4j.Level.ERROR;
//
///**
// * Json结果解析类
// *
// * create by wzy on 2018/09/14
// */
//public class JsonParserUtil {
//
//	private static Logger logger = LogManager.getLogger(JsonParserUtil.class);
//
//
//
//	/**
//	 * 解析讯飞回传数据
//	 *
//	 * @param json
//	 * @return
//	 */
//	public static AiUiJsonDto parse(String json) {
//		AiUiJsonDto aiUiData = new AiUiJsonDto();
//
//		try {
//
//			JSONObject jsonDataBack = JSONObject.parseObject(json);
//			String jsonCode = jsonDataBack.getString("code");
//			if (!"0".equals(jsonCode)) {
//				logger.log(ERROR, "[讯飞解析错误]code：" + jsonCode);
//				return null;
//			}
//
//			JSONArray jsonData = jsonDataBack.getJSONArray("data");
//			JSONObject jsonArray = jsonData.getJSONObject(0);
//			JSONObject jsonIntent = jsonArray.getJSONObject("intent");
//
//			Integer rc = jsonIntent.getInteger("rc");
//			aiUiData.setRc(rc);
//
//			if (rc.equals(RC_INPUT_ERROR) || rc.equals(RC_SYSTEM_ERROR) || rc.equals(RC_NOT_DEAL)) {
//				return aiUiData;
//			} else if (rc.equals(RC_SUCCESS) || rc.equals(RC_FAIL)) {
//
//				//用户语音
//				String userText = jsonIntent.getString("text");
//				aiUiData.setUserText(userText);
//
//				//语音播报字段
//				JSONObject jsonAnswer = jsonIntent.getJSONObject("answer");
//				String answer = jsonAnswer.getString("text");
//				aiUiData.setAnswer(answer);
//
//				String service = jsonIntent.getString("service");
//				aiUiData.setService(service);
//
//				Map<String, Object> results = jsonIntent.getJSONObject("data").getInnerMap();
//				aiUiData.setResults(results);
//
//				//获取各项数据字段
//				JSONObject jsonSemantic = jsonIntent.getJSONArray("semantic").getJSONObject(0);
//				String intent = jsonSemantic.getString("intent");
//				aiUiData.setIntent(intent);
//
//				JSONArray jsonSlots = jsonSemantic.getJSONArray("slots");
//				List<AiUiSlotsDto> slots = new ArrayList<>();
//				for (int i = 0; i < jsonSlots.size(); i++) {
//					JSONObject jsonSlotData = jsonSlots.getJSONObject(i);
//					AiUiSlotsDto slot = new AiUiSlotsDto();
//					String name = jsonSlotData.getString("name");				//字段名
//					String normValue = jsonSlotData.getString("normValue");	//对应字段数据
//					String value = jsonSlotData.getString("value");			//对应用户语音解析
//
//					slot.setName(name);
//					slot.setNormValue(normValue);
//					slot.setValue(value);
//
//				}
//
//			}
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//
//		return aiUiData;
//	}
//
//
//}
