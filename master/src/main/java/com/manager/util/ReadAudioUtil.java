package com.manager.util;

import com.iflytek.cloud.speech.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;

/**读取本地音频文件（pcm/wav）
 * @Author: tzx ;
 * @Date: Created in 13:54 2018/4/26
 */
public class ReadAudioUtil {

    private static final String APPID = "5abdfa52";

    private StringBuffer mResult = new StringBuffer();


    /** 最大等待时间， 单位ms */
    private int maxWaitTime = 500;
    /** 每次等待时间 */
    private int perWaitTime = 100;
    /** 出现异常时最多重复次数 */
    private int maxQueueTimes = 3;
    /** 音频文件 */
    private String fileName = "";

    static {
        Setting.setShowLog( false );
        SpeechUtility.createUtility("appid=" + APPID);
    }

    public String voice2words(String fileName) throws InterruptedException {
        return voice2words(fileName, true);
    }

    /**
     *
     * @desc: 工具类，在应用中有一个实例即可， 但是该实例是有状态的， 因此要消除其他调用对状态的修改，所以提供一个init变量
     * @param fileName
     * @param init 是否初始化最大等待时间。
     * @return
     * @throws InterruptedException
     */
    public String voice2words(String fileName, boolean init) throws InterruptedException {
        if(init) {
            maxWaitTime = 500;
            maxQueueTimes = 3;
        }
        if(maxQueueTimes <= 0) {
            mResult.setLength(0);
            mResult.append("解析异常！");
            return mResult.toString();
        }
        this.fileName = fileName;

        return recognize();
    }


    // ****************音频流听写****************

    /**
     * 听写
     * @return
     * @throws InterruptedException
     */
    private String recognize() throws InterruptedException {
        if (SpeechRecognizer.getRecognizer() == null)
            SpeechRecognizer.createRecognizer();
        return RecognizePcmfileByte();
    }

    /**
     * 自动化测试注意要点 如果直接从音频文件识别，需要模拟真实的音速，防止音频队列的堵塞
     * @throws InterruptedException
     */
    private String RecognizePcmfileByte() throws InterruptedException {
        // 1、读取音频文件
        FileInputStream fis = null;
        byte[] voiceBuffer = null;
        try {
            fis = new FileInputStream(new File(fileName));
            voiceBuffer = new byte[fis.available()];
            fis.read(voiceBuffer);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (null != fis) {
                    fis.close();
                    fis = null;
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        // 2、音频流听写
        if (0 == voiceBuffer.length) {
            mResult.append("无音频文件可用!");
        } else {
            //解析之前将存出结果置为空
            mResult.setLength(0);
            SpeechRecognizer recognizer = SpeechRecognizer.getRecognizer();
            recognizer.setParameter(SpeechConstant.DOMAIN, "iat");
            recognizer.setParameter(SpeechConstant.LANGUAGE, "zh_cn");
            recognizer.setParameter (SpeechConstant.ACCENT, "mandarin ");
            recognizer.setParameter(SpeechConstant.AUDIO_SOURCE, "-1");
            //写音频流时，文件是应用层已有的，不必再保存
//          recognizer.setParameter(SpeechConstant.ASR_AUDIO_PATH,
//                  "./iflytek.pcm");
            recognizer.setParameter( SpeechConstant.RESULT_TYPE, "plain" );
//            recognizer.setParameter( SpeechConstant.RESULT_TYPE, "json" );
            recognizer.startListening(recListener);
            ArrayList<byte[]> buffers = splitBuffer(voiceBuffer,
                    voiceBuffer.length, 4800);
            for (int i = 0; i < buffers.size(); i++) {
                // 每次写入msc数据4.8K,相当150ms录音数据
                recognizer.writeAudio(buffers.get(i), 0, buffers.get(i).length);
                try {
                    Thread.sleep(150);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            recognizer.stopListening();
            // 在原有的代码基础上主要添加了这个while代码等待音频解析完成，recognizer.isListening()返回true，说明解析工作还在进行
            while(recognizer.isListening()) {
                if(maxWaitTime < 0) {
                    mResult.setLength(0);
                    mResult.append("解析超时！");
                    break;
                }
                Thread.sleep(perWaitTime);
                maxWaitTime -= perWaitTime;
            }
        }
        return mResult.toString();
    }

    /**
     * 将字节缓冲区按照固定大小进行分割成数组
     *
     * @param buffer
     *            缓冲区
     * @param length
     *            缓冲区大小
     * @param spsize
     *            切割块大小
     * @return
     */
    private ArrayList<byte[]> splitBuffer(byte[] buffer, int length, int spsize) {
        ArrayList<byte[]> array = new ArrayList<byte[]>();
        if (spsize <= 0 || length <= 0 || buffer == null
                || buffer.length < length)
            return array;
        int size = 0;
        while (size < length) {
            int left = length - size;
            if (spsize < left) {
                byte[] sdata = new byte[spsize];
                System.arraycopy(buffer, size, sdata, 0, spsize);
                array.add(sdata);
                size += spsize;
            } else {
                byte[] sdata = new byte[left];
                System.arraycopy(buffer, size, sdata, 0, left);
                array.add(sdata);
                size += left;
            }
        }
        return array;
    }

    /**
     * 听写监听器
     */
    private RecognizerListener recListener = new RecognizerListener() {
        //开始录音
        public void onBeginOfSpeech() { }
        //结束录音
        public void onEndOfSpeech() { }
        //音量值0~30
        public void onVolumeChanged(int volume) { }

        public void onResult(RecognizerResult result, boolean islast) {
            mResult.append(result.getResultString());
        }
        //会话发生错误回调接口
        public void onError(SpeechError error) {
            try {
                voice2words(fileName);
                maxQueueTimes--;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException(e);
            }
        }
        //扩展用接口
        public void onEvent(int eventType, int arg1, int agr2, String msg) { }

    };
}
