package com.xiaoji.aispeech.xf.aiuiData;

import java.util.List;

public class Answer{
   private String text;//通用的文字显示，属于text数据
   private String type; //显示的类型，通过这个类型，可以确定数据的返回内容和客户端的显示内容，默认值为 T 。 T：text数据 U：url数据 TU：text+url数据 IT：image+text数据 ITU：image+text+url数据
   private String imgUrl;//图片的链接地址，属于image数据
   private String imgDesc;//图片的描述文字
   private String url;//url链接
   private String urlDesc;//url链接的描述文字
   private String emotion;//回答的情绪，取值参见附录的情感标签对照表

   public String getText() {
       return text;
   }

   public void setText(String text) {
       this.text = text;
   }

   public String getType() {
       return type;
   }

   public void setType(String type) {
       this.type = type;
   }

   public String getImgUrl() {
       return imgUrl;
   }

   public void setImgUrl(String imgUrl) {
       this.imgUrl = imgUrl;
   }

   public String getImgDesc() {
       return imgDesc;
   }

   public void setImgDesc(String imgDesc) {
       this.imgDesc = imgDesc;
   }

   public String getUrl() {
       return url;
   }

   public void setUrl(String url) {
       this.url = url;
   }

   public String getUrlDesc() {
       return urlDesc;
   }

   public void setUrlDesc(String urlDesc) {
       this.urlDesc = urlDesc;
   }

   public String getEmotion() {
       return emotion;
   }

   public void setEmotion(String emotion) {
       this.emotion = emotion;
   }
}

