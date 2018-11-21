package com.xiaoji.master.service;

import java.io.IOException;

/**
 * 创建队列Service
 *
 *
 */
public interface ICreateQueueService {
    /**
     * 创建队列
     *
     * @param userId 用户id
     */
      String createQueue(int userId, String deviceId, String exchangeName) throws IOException;

      String createExchange(int userId, int type) throws IOException;
}
