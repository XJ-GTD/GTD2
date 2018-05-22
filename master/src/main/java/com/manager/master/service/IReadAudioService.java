package com.manager.master.service;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/** 语音处理
 * @Author: tzx ;
 * @Date: Created in 14:18 2018/4/28
 */
public interface IReadAudioService {
    /**
     * 获取音频文件路径
     * @param request
     * @return
     */
    String getFilePath(HttpServletRequest request);

    /**
     * 语音识别+语音解析
     * @param fileName  音频文件路径
     * @param path_timem    FNLP时间解析库路径
     * @param path_models   FNLP解析模型库路径
     * @return
     */
    Map<String, Object> readAudio(String fileName, String path_timem, String path_models);

}
