package com.manager.master.service.serviceImpl;

import com.manager.master.service.IReadAudioService;
import com.manager.util.FNLPUtil;
import com.manager.util.ReadAudioOnlineUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.*;

/**
 * 语音处理
 *
 * @Author: tzx ;
 * @Date: Created in 14:26 2018/4/28
 */
@Service
@Transactional
public class ReadAudioServiceImpl implements IReadAudioService {

    /**
     * 获取音频文件路径
     *
     * @param request
     * @return
     * @throws IOException
     */
    public String getFilePath(HttpServletRequest request) {
        String path = "";
        //将当前上下文初始化给  CommonsMutipartResolver （多部分解析器）
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(
                request.getSession().getServletContext());
        //检查form中是否有enctype="multipart/form-data"
        if (multipartResolver.isMultipart(request)) {
            //将request变成多部分request
            MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
            //获取multiRequest 中所有的文件名
            Iterator iter = multiRequest.getFileNames();

            while (iter.hasNext()) {
                //一次遍历所有文件
                MultipartFile file = multiRequest.getFile(iter.next().toString());
                if (file != null) {
                    path = "C:/SOUND/" + file.getOriginalFilename();
                    //上传
                    try {
                        file.transferTo(new File(path));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }

            }

        }
        return path;
    }

    /**
     * 语音识别+语音解析
     *
     * @param fileName    音频文件路径
     * @param path_timem  FNLPUtil时间解析库路径
     * @param path_models FNLPUtil解析模型库路径
     * @return
     */
    @Override
    public Map<String, Object> readAudio(String fileName, String path_timem, String path_models) {
        Map<String, Object> map = new HashMap<String, Object>();
        String result = ReadAudioOnlineUtil.getResult(fileName);
        map.put("result", result);//音频文件在线识别结果
        if (!"".equals(result)) {
            String date = FNLPUtil.getTime(result, path_timem);
            map.put("scheduleFinshDateString", date);//时间
            String title = FNLPUtil.getTitle(result, path_timem);
            map.put("scheduleName", title);//日程主题
            /*List<String> nameList = new ArrayList<String>();
            List<String> addressList = new ArrayList<String>();
            Map<String, String> names = FNLPUtil.analytical(result, path_models);//获取文本中的人名和地名
            for (Map.Entry<String, String> entry : names.entrySet()) {
                if ("人名".equals(entry.getValue())) {
                    nameList.add(entry.getKey());
                }
                if ("地名".equals(entry.getValue())) {
                    addressList.add(entry.getKey());
                }
            }
            map.put("name", nameList);//人名
            map.put("address", addressList);//地点*/
        }
        System.out.println(map);
        return map;
    }
}
