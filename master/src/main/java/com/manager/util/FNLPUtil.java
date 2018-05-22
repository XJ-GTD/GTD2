package com.manager.util;

import org.fnlp.ml.types.Dictionary;
import org.fnlp.nlp.cn.CNFactory;
import org.fnlp.nlp.cn.ner.TimeNormalizer;
import org.fnlp.nlp.cn.ner.TimeUnit;
import org.fnlp.nlp.cn.tag.CWSTagger;
import org.fnlp.nlp.cn.tag.POSTagger;
import org.fnlp.util.exception.LoadModelException;

import java.util.Map;


/**语义分析（对中文文本进行分词、中文词性标注、实体名识别、时间表达式识别等处理）
 * @Author: tzx ;
 * @Date: Created in 18:29 2018/4/26
 */
public class FNLPUtil {
    static CWSTagger cws;
    static POSTagger tag;
    static TimeNormalizer normalizer;

    /**
     * @Title: seg
     * @Description:  分词处理
     * @param: @param target
     * @return: String
     * @throws
     */
    public static String seg(String target, String path_segm){
        String result = "";
        try {
            cws = new CWSTagger(path_segm);
            String str = cws.tag(target);
            //设置英文预处理
            cws.setEnFilter(true);
            result = cws.tag(str);
        } catch (LoadModelException e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * @Title: seg2Dict
     * @Description:  使用字典分词处理
     * @param: @param target
     * @return: String
     * @throws
     */
    public static String seg2Dict(String target, String path_segm, String path_dict){
        String result = "";
        try {
            cws = new CWSTagger(path_segm, new Dictionary(path_dict));
            String str = cws.tag(target);
            //设置英文预处理
            cws.setEnFilter(true);
            result = cws.tag(str);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * @Title: pos
     * @Description: 词性标注
     * @param: @param target
     * @return: String
     * @throws
     */
    public static String pos(String target, String path_segm, String path_posm){
        String result = "";
        try {
            cws = new CWSTagger(path_segm);
            tag = new POSTagger(cws,path_posm);
            String str = tag.tag(target);
            //使用英文标签
//			tag.SetTagType("en");
            result = tag.tag(str);
        } catch (LoadModelException e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * @Title: pos2Dict
     * @Description:  使用字典来词性标注
     * @param: @param target
     * @return: String
     * @throws
     */
    public static String pos2Dict(String target, String path_segm, String path_posm, String path_dict){
        String result = "";
        try {
            //分词使用字典
            cws = new CWSTagger(path_segm, new Dictionary(path_dict));
            //Boolean值指定该dict是否用于cws分词（分词和词性可以使用不同的词典）
            tag = new POSTagger(cws, path_posm, new Dictionary(path_dict), true);//true就替换了之前的dict.txt
            //不移除分词的词典
            tag.removeDictionary(false);
            //设置POS词典，分词使用原来设置
            tag.setDictionary(new Dictionary(path_dict), false);
            result = tag.tag(target);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * @Title: analytical
     * @Description:  解析文本，获取人名和地名
     * @return: Map<String,Object>
     * @throws
     */
    @SuppressWarnings("static-access")
    public static Map<String, String> analytical(String result, String path_models){
        Map<String, String> map = null;
        try {
            CNFactory factory = CNFactory.getInstance(path_models);
            map = factory.ner(result);
        } catch (LoadModelException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return map;
    }

    /**
     * @Title: getTime
     * @Description:  时间表达式识别 (单句中含有时间的)
     * @param: @param target
     * @return: Map<String,Object>
     * @throws
     */
    public static String getTime(String target, String path_timem){
        String result = "";
        normalizer = new TimeNormalizer(path_timem);
        normalizer.parse(target);
        TimeUnit[] unit = normalizer.getTimeUnit();
        if(unit.length > 0){
            result = unit[0].Time_Norm;
        }
        return result;
    }

    /**
     * @Title: getTitle
     * @Description:  获取除时间以外的内容（去掉结尾的标点）
     * @param: @param target
     * @param: @param path_timem
     * @return: String
     * @throws
     */
    public static String getTitle(String target, String path_timem){
        String result = "";
        normalizer = new TimeNormalizer(path_timem);
        normalizer.parse(target);
        TimeUnit[] unit = normalizer.getTimeUnit();
        if(unit.length > 0){
            String time_str = unit[0].Time_Expression;
            if(target.length() > time_str.length()){
                String tilte = target.substring(time_str.length(), target.length());
                String removeSpace = tilte.replace(" ", "");//去掉空格
                result = removeSpace.replaceAll("[\\pP\\p{Punct}]", "");//清除所有符号,只留下字母 数字  汉字  共3类
            }
        }
        return result;
    }
}
