package com.xiaoji.aispeech.xf.aiuiData;

public class AiuiSub {
      private String sub;
      private String auth_id;
      private int result_id;
     // private AiuiLat text;
   //   private AiuiContent content;
     private String content;
      private String text;
      private AiuiIntent intent;

    public String getSub() {
        return sub;
    }

    public void setSub(String sub) {
        this.sub = sub;
    }

    public String getAuth_id() {
        return auth_id;
    }

    public void setAuth_id(String auth_id) {
        this.auth_id = auth_id;
    }

    public int getResult_id() {
        return result_id;
    }

    public void setResult_id(int result_id) {
        this.result_id = result_id;
    }

//    public AiuiLat getText() {
//        return text;
//    }
//
//    public void setText(AiuiLat text) {
//        this.text = text;
//    }
//
//    public AiuiContent getContent() {
//        return content;
//    }
//
//    public void setContent(AiuiContent content) {
//        this.content = content;
//    }

    public AiuiIntent getIntent() {
        return intent;
    }

    public void setIntent(AiuiIntent intent) {
        this.intent = intent;
    }


    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
