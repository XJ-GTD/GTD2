package com.cortana.ai.service;

import com.cortana.ai.util.DebugLog;
import com.cortana.ai.util.JsonParser;
import com.cortana.ai.util.Version;
import com.iflytek.cloud.speech.*;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.tomcat.util.codec.binary.Base64;

import com.alibaba.fastjson.JSONObject;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

@Service
public class AiuiService {

    private static final String URL = "http://openapi.xfyun.cn/v2/aiui";
    private static final String APPID = "5b3f442f";
    private static final String API_KEY = "21dcc6b1945644c6a848f31f70a69646";
    private static final String DATA_TYPE = "text";
    private static final String SCENE = "main";
    private static final String AUTH_ID = "ecbe6d91d5454e0451a8d736b2865f7b";
    // 语音听写对象
    private static SpeechRecognizer mIat;
    private static AiuiService mObject;
    private boolean mIsLoop = true;

    private static StringBuffer mResult = new StringBuffer();
    private static String ask = "";

    // 语音合成对象
    private static SpeechSynthesizer mTts;



    private static AiuiService getMscObj() {
        if (mObject == null)
            mObject = new AiuiService();
        return mObject;
    }


    private boolean onLoop() {
        boolean isWait = true;
        DebugLog.Log("*********************************");
        DebugLog.Log("输入任意字符，开始你的问题，你只有3秒哦：）");

        Scanner in = new Scanner(System.in);
        String command = in.nextLine();

        DebugLog.Log("You input " + command);

        Recognize();

        return isWait;
    }

    public void loop() {
        while (mIsLoop) {
            try {
                if (onLoop()) {
                    synchronized(this){
                        this.wait();
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public static void main(String[] args) throws IOException,ParseException, InterruptedException{

        // 初始化听写对象
        StringBuffer param = new StringBuffer();
        param.append( "appid=" + Version.getAppid() );
//		param.append( ","+SpeechConstant.LIB_NAME_32+"=myMscName" );
        SpeechUtility.createUtility( param.toString() );
        mIat=SpeechRecognizer.createRecognizer();

        // 初始化合成对象
        mTts = SpeechSynthesizer.createSynthesizer();
        if( null!=args && args.length>0 && args[0].equals("true") ){
            //在应用发布版本中，请勿显示日志，详情见此函数说明。
            Setting.setShowLog( true );
        }

        SpeechUtility.createUtility("appid=" + APPID);
        getMscObj().loop();
    }

    private static Map<String, String> buildHeader() throws UnsupportedEncodingException, ParseException {
        String curTime = System.currentTimeMillis() / 1000L + "";
        String param = "{\"auth_id\":\""+AUTH_ID+"\",\"data_type\":\""+DATA_TYPE+"\",\"scene\":\""+SCENE+"\"}";
        String paramBase64 = new String(Base64.encodeBase64(param.getBytes("UTF-8")));
        String checkSum = DigestUtils.md5Hex(API_KEY + curTime + paramBase64);

        Map<String, String> header = new HashMap<String, String>();
        header.put("X-Param", paramBase64);
        header.put("X-CurTime", curTime);
        header.put("X-CheckSum", checkSum);
        header.put("X-Appid", APPID);
        return header;
    }


    private static String httpPost(String url, Map<String, String> header, byte[] body) {
        String result = "";
        BufferedReader in = null;
        OutputStream out = null;
        try {
            URL realUrl = new URL(url);
            HttpURLConnection connection = (HttpURLConnection)realUrl.openConnection();
            for (String key : header.keySet()) {
                connection.setRequestProperty(key, header.get(key));
            }
            connection.setDoOutput(true);
            connection.setDoInput(true);

            try {
                out = connection.getOutputStream();
                out.write(body);
                out.flush();
            } catch (Exception e) {
                e.printStackTrace();
            }

            try {
                in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                String line;
                while ((line = in.readLine()) != null) {
                    result += line;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            result = new String(result.getBytes("UTF8"));
        } catch (UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return result;
    }

    public  void query(String text) throws IOException,ParseException, InterruptedException{

        new Thread(){
            public void run(){

                Map<String, String> header;
                try {
                    header = buildHeader();
                    byte[] dataByteArray = text.getBytes("UTF8");
                    String result = httpPost(URL, header, dataByteArray);
                    //DebugLog.Log(result);
                    JSONObject json = JSONObject.parseObject(result);
                    String answer = "";
                    DebugLog.Log(json.toJSONString());
                    if (json.getJSONArray("data").getJSONObject(0).getJSONObject("intent").getJSONObject("answer") != null){
                        answer = json.getJSONArray("data").getJSONObject(0).getJSONObject("intent").getJSONObject("answer").get("text").toString();
                    }else{
                        answer = "我不知道呢";
                    }
                    mTts.startSpeaking( answer, mSynListener );

                    DebugLog.Log("answer：" + answer);
                } catch (UnsupportedEncodingException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } catch (ParseException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }

            }
        }.start();
    }

    private void waitupLoop(){
        synchronized(this){
            AiuiService.this.notify();
        }
    }

    private void Recognize() {
        RecognizePcmfileByte();
    }

    private Map<String, String> mParamMap = new HashMap<String, String>();

    private static class DefaultValue{
        public static final String ENG_TYPE = SpeechConstant.TYPE_CLOUD;
        public static final String SPEECH_TIMEOUT = "60000";
        public static final String NET_TIMEOUT = "20000";
        public static final String LANGUAGE = "zh_cn";

        public static final String ACCENT = "mandarin";
        public static final String DOMAIN = "iat";
        public static final String VAD_BOS = "5000";
        public static final String VAD_EOS = "1800";

        public static final String RATE = "16000";
        public static final String NBEST = "1";
        public static final String WBEST = "1";
        public static final String PTT = "1";

        public static final String RESULT_TYPE = "json";

        public static final String VOICE = "小燕";
        public static final String BG_SOUND = "0";
        public static final String SPEED = "50";
        public static final String PITCH = "50";
        public static final String VOLUME = "50";
        public static final String SAVE = "0";
    }

    public void RecognizePcmfileByte() {
        //写音频流时，文件是应用层已有的，不必再保存
//	recognizer.setParameter(SpeechConstant.ASR_AUDIO_PATH,
//			"./iat_test.pcm");
        //recognizer.setParameter( SpeechConstant.RESULT_TYPE, "plain" );
        setting();

        mIat.startListening(recListener);

        new Thread(){
            @SuppressWarnings("static-access")
            public void run(){

                try {
                    Thread.currentThread().sleep(3000);
                    mIat.stopListening();
                } catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
        }.start();



    }

    /**
     * 听写监听器
     */
    private RecognizerListener recListener = new RecognizerListener() {

        public void onBeginOfSpeech() {
            //DebugLog.Log( "onBeginOfSpeech enter" );
            //DebugLog.Log("*************开始录音*************");
        }

        public void onEndOfSpeech() {
            //DebugLog.Log( "onEndOfSpeech enter" );
        }

        public void onVolumeChanged(int volume) {
            //DebugLog.Log( "onVolumeChanged enter" );
            //if (volume > 0)
            //	DebugLog.Log("*************音量值:" + volume + "*************");

        }

        public void onResult(RecognizerResult result, boolean islast) {

            mResult.append( JsonParser.parseIatResult(result.getResultString()));

            if( islast ){
                ask = mResult.toString();
                DebugLog.Log("问题:" + ask);
                mResult.delete(0, mResult.length());
                try {
                    query(ask);
                } catch (IOException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } catch (ParseException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
                //waitupLoop();
            }
        }

        public void onError(SpeechError error) {
            DebugLog.Log("*************" + error
                    + "*************");
            waitupLoop();
        }

        public void onEvent(int eventType, int arg1, int agr2, String msg) {
            DebugLog.Log( "onEvent enter" );
        }

    };

    void setting(){
        initParamMap();
        final String engType = this.mParamMap.get(SpeechConstant.ENGINE_TYPE);

        for( Map.Entry<String, String> entry : this.mParamMap.entrySet() ){
            mIat.setParameter( entry.getKey(), entry.getValue() );
            mTts.setParameter( entry.getKey(), entry.getValue()  );
        }
        //本地识别时设置资源，并启动引擎
        if( SpeechConstant.TYPE_LOCAL.equals(engType) ){
            //启动合成引擎
            mIat.setParameter( ResourceUtil.ENGINE_START, SpeechConstant.ENG_ASR );

            //设置资源路径
            final String rate = this.mParamMap.get( SpeechConstant.SAMPLE_RATE );
            final String tag = rate.equals("16000") ? "16k" : "8k";
            String curPath = System.getProperty("user.dir");
            //DebugLog.Log( "Current path="+curPath );
            String resPath = ResourceUtil.generateResourcePath( curPath+"/asr/common.jet" )
                    + ";" + ResourceUtil.generateResourcePath( curPath+"/asr/src_"+tag+".jet" );
            System.out.println( "resPath="+resPath );
            mIat.setParameter( ResourceUtil.ASR_RES_PATH, resPath );
        }// end of if is TYPE_LOCAL

        //本地合成时设置资源，并启动引擎
        if( SpeechConstant.TYPE_LOCAL.equals(engType) ){
            //启动合成引擎
            mTts.setParameter( ResourceUtil.ENGINE_START, SpeechConstant.ENG_TTS );
            //设置资源路径
            String curPath = System.getProperty("user.dir");
            //DebugLog.Log( "Current path="+curPath );
            String resPath = ResourceUtil.generateResourcePath( curPath+"/tts/common.jet" )
                    + ";" + ResourceUtil.generateResourcePath( curPath+"/tts/xiayan.jet" );
            System.out.println( "resPath="+resPath );
            mTts.setParameter( ResourceUtil.TTS_RES_PATH, resPath );
        }// end of if is TYPE_LOCAL

        //启用合成音频流事件，不需要时，不用设置此参数
        mTts.setParameter( SpeechConstant.TTS_BUFFER_EVENT, "1" );
    }// end of function setting
    private void initParamMap(){
        this.mParamMap.put( SpeechConstant.ENGINE_TYPE, DefaultValue.ENG_TYPE );
        this.mParamMap.put( SpeechConstant.SAMPLE_RATE, DefaultValue.RATE );
        this.mParamMap.put( SpeechConstant.NET_TIMEOUT, DefaultValue.NET_TIMEOUT );
        this.mParamMap.put( SpeechConstant.KEY_SPEECH_TIMEOUT, DefaultValue.SPEECH_TIMEOUT );

        this.mParamMap.put( SpeechConstant.LANGUAGE, DefaultValue.LANGUAGE );
        this.mParamMap.put( SpeechConstant.ACCENT, DefaultValue.ACCENT );
        this.mParamMap.put( SpeechConstant.DOMAIN, DefaultValue.DOMAIN );
        this.mParamMap.put( SpeechConstant.VAD_BOS, DefaultValue.VAD_BOS );

        this.mParamMap.put( SpeechConstant.VAD_EOS, DefaultValue.VAD_EOS );
        this.mParamMap.put( SpeechConstant.ASR_NBEST, DefaultValue.NBEST );
        this.mParamMap.put( SpeechConstant.ASR_WBEST, DefaultValue.WBEST );
        this.mParamMap.put( SpeechConstant.ASR_PTT, DefaultValue.PTT );

        this.mParamMap.put( SpeechConstant.RESULT_TYPE, DefaultValue.RESULT_TYPE );
        this.mParamMap.put( SpeechConstant.ASR_AUDIO_PATH, null );


        //语音合同
        this.mParamMap.put( SpeechConstant.ENGINE_TYPE, DefaultValue.ENG_TYPE );
        this.mParamMap.put( SpeechConstant.VOICE_NAME, DefaultValue.VOICE );
        this.mParamMap.put( SpeechConstant.BACKGROUND_SOUND, DefaultValue.BG_SOUND );
        this.mParamMap.put( SpeechConstant.SPEED, DefaultValue.SPEED );
        this.mParamMap.put( SpeechConstant.PITCH, DefaultValue.PITCH );
        this.mParamMap.put( SpeechConstant.VOLUME, DefaultValue.VOLUME );
        this.mParamMap.put( SpeechConstant.TTS_AUDIO_PATH, null );
    }

    private SynthesizerListener mSynListener = new SynthesizerListener() {

        @Override
        public void onSpeakBegin() {
        }

        @Override
        public void onBufferProgress(int progress, int beginPos, int endPos,
                                     String info) {
//		DebugLog.Log("--onBufferProgress--progress:" + progress
//				+ ",beginPos:" + beginPos + ",endPos:" + endPos);
        }

        @Override
        public void onSpeakPaused() {

        }

        @Override
        public void onSpeakResumed() {

        }

        @Override
        public void onSpeakProgress(int progress, int beginPos, int endPos) {
//		DebugLog.Log("onSpeakProgress enter progress:" + progress
//				+ ",beginPos:" + beginPos + ",endPos:" + endPos);


//		DebugLog.Log( "onSpeakProgress leave" );
        }

        @Override
        public void onCompleted(SpeechError error) {

            waitupLoop();
        }


        @Override
        public void onEvent(int eventType, int arg1, int arg2, int arg3, Object obj1, Object obj2) {
            if( SpeechEvent.EVENT_TTS_BUFFER == eventType ){
//			DebugLog.Log( "onEvent: type="+eventType
//					+", arg1="+arg1
//					+", arg2="+arg2
//					+", arg3="+arg3
//					+", obj2="+(String)obj2 );
                ArrayList<?> bufs = null;
                if( obj1 instanceof ArrayList<?> ){
                    bufs = (ArrayList<?>) obj1;
                }else{
//				DebugLog.Log( "onEvent error obj1 is not ArrayList !" );
                }//end of if-else instance of ArrayList

                if( null != bufs ){
                    for( final Object obj : bufs ){
                        if( obj instanceof byte[] ){
                            final byte[] buf = (byte[]) obj;
//						DebugLog.Log( "onEvent buf length: "+buf.length );
                        }else{
//						DebugLog.Log( "onEvent error element is not byte[] !" );
                        }
                    }//end of for
                }//end of if bufs not null
            }//end of if tts buffer event
        }
    };
}
