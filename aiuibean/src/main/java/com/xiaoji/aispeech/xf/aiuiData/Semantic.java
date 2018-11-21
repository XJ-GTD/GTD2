package com.xiaoji.aispeech.xf.aiuiData;

import java.util.List;

public class Semantic{
    private String intent;

    private List<Slot> slots;

    private String entrypoint;

    private double score;

    private boolean hazard;

    private String template;

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public List<Slot> getSlots() {
        return slots;
    }

    public void setSlots(List<Slot> slots) {
        this.slots = slots;
    }

    public String getEntrypoint() {
        return entrypoint;
    }

    public void setEntrypoint(String entrypoint) {
        this.entrypoint = entrypoint;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    public boolean isHazard() {
        return hazard;
    }

    public void setHazard(boolean hazard) {
        this.hazard = hazard;
    }


}

