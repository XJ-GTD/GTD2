package com.manager.master.repository;

import com.manager.master.entity.GtdGroupLabel;
import com.manager.master.entity.GtdLabelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GroupLabelJpaRepository extends JpaRepository<GtdGroupLabel,Integer> {
    /**
     * 根据标签ID查询标签
     * @param labelId
     * @return
     */
    List<GtdGroupLabel> findByLabelId(int labelId);


    /**
     *根据标签和群组id查找
     */
    List<GtdGroupLabel> findByLabelIdAndAndGroupId(int labelId,int groupId);

    void deleteAllByGroupId(int groupId);
}
