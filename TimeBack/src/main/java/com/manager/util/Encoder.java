package com.manager.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Encoder {

    private static Logger logger = LoggerFactory.getLogger(Encoder.class);

    private static final int[] P = { 2, 5, 8, 10, 15, 17, 20, 23 };
    private static final char[] T = { 'w', '5', 'I', '8', 'n', '6', '9', 'z', '1', 'M' };
    private static final SimpleDateFormat F = new SimpleDateFormat("yyyyMMdd");

    public static String m() {
        String b = find("Win32_BaseBoard", "SerialNumber");

        if (StringUtils.isEmpty(b)) {
            b = find("Win32_BaseBoard", "SerialNumber");
        }

        String d = find("Win32_DiskDrive", "SerialNumber");
        return r(Base64.encodeBase64URLSafeString(DigestUtils.sha(b + d + "pH@$_Dg6^W{g")));
    }

    public static String e(String i, String m, Date d) {
        String str = Base64.encodeBase64URLSafeString(DigestUtils.md5(i + m + "aE3%ad!%B.d[p")).substring(0, 17);
        str = r(str);

        if (d == null) {
            d = new Date(Long.MAX_VALUE);
        }
        String s = F.format(d);
        s = s.substring(s.length() - 8, s.length());

        StringBuilder sb = new StringBuilder(str);
        for (int j = 0; j < P.length; j++) {
            int p = P[j];
            sb.insert(p, T[s.charAt(j) - 48]);
        }

        return sb.toString();
    }

    public static boolean v(String e) {
        if (e.length() != 25) {
            return false;
        }
        for (int i = 0; i < P.length; i++) {
            if (c(T, e.charAt(P[i])) < 0) {
                return false;
            }
        }
        return true;
    }

    private static int c(char[] t, char k) {
        for (int i = 0; i < t.length; i++) {
            if (t[i] == k) {
                return i;
            }
        }
        return -1;
    }

    public static Date d(String e) {
        if (!v(e)) {
            return null;
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < P.length; i++) {
            sb.append(c(T, e.charAt(P[i])));
        }
        try {
            return F.parse(sb.toString());
        } catch (ParseException e1) {
            throw new RuntimeException(e1);
        }
    }

    private static String r(String base64) {
        return base64.replace('-', 'J').replace('_', 'h').replace('+', 'J').replace('/', 'h');
    }

    private static String find(String from, String field) {
        String result = "";
        try {
            File file = File.createTempFile("realhowto", ".vbs");
            file.deleteOnExit();
            FileWriter fw = new FileWriter(file);

            String vbs = "Set objWMIService = GetObject(\"winmgmts:\\\\.\\root\\cimv2\")\n"
                    + "Set colItems = objWMIService.ExecQuery _ \n"
                    + "   (\"Select * from " + from + "\") \n" + "For Each objItem in colItems \n"
                    + "    Wscript.Echo objItem." + field + " \n"
                    + "    exit for  ' do the first cpu only! \n"
                    + "Next \n";

            fw.write(vbs);
            fw.close();
            Process p = Runtime.getRuntime().exec("cscript //NoLogo " + file.getPath());
            BufferedReader input = new BufferedReader(new InputStreamReader(p.getInputStream()));
            String line;
            while ((line = input.readLine()) != null) {
                result += line;
            }
            input.close();
        } catch (Exception e) {
            logger.error("Read WMI Service error.", e);
            e.printStackTrace();
        }
        logger.info(from + "'s " + field + " : " + result);
        return result.trim();
    }

}

