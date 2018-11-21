package com.xiaoji.aispeech.xf.aiuiData;

public class AiuiContent {

        private String from;	//string	源语言语种
        private String to;	//string	目标语言语种
        private String result;	//string	翻译的结果
        private String src;	//string	源语言结果
        private String  dst;	//string	翻译的目标语言结果
        private String  sid	;//string	翻译引擎sid
        private int interret;	//number	调用结果

        public String getFrom() {
            return from;
        }

        public void setFrom(String from) {
            this.from = from;
        }

        public String getTo() {
            return to;
        }

        public void setTo(String to) {
            this.to = to;
        }

        public String getResult() {
            return result;
        }

        public void setResult(String result) {
            this.result = result;
        }

        public String getSrc() {
            return src;
        }

        public void setSrc(String src) {
            this.src = src;
        }

        public String getDst() {
            return dst;
        }

        public void setDst(String dst) {
            this.dst = dst;
        }

        public String getSid() {
            return sid;
        }

        public void setSid(String sid) {
            this.sid = sid;
        }

        public int getInterret() {
            return interret;
        }

        public void setInterret(int interret) {
            this.interret = interret;
        }
}
