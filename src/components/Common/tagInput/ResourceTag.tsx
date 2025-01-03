import TagReferenceVo, { TagVo } from '@/types/entity';
import { ModelType } from '@/types/model';
import { useDebounceFn } from 'ahooks';
import { message, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'umi';
import TagInput from '.';

interface PropsType {
  /**
   * 资源标识，默认为空。
   */
  resourceId: string;
  /**
   * 标签列表，查表获取。
   */
  tagList: TagReferenceVo[];
  /**
   * 是否展示模糊搜索结果。
   */
  search?: boolean;
  /**
   * 模糊搜索结果。
   */
  searchResult: TagVo[];
}
/**
 * 展示资源关联的标签，可以向资源增删标签。
 * @param props 属性
 * @returns 组件
 */
const ResourceTag: React.FC<PropsType> = (props) => {
  const { resourceId, tagList, search, searchResult } = props;

  const dispatch = useDispatch();
  // 标签列表，从后台获取，添加新标签后刷新
  // 当前输入框的标签
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    dispatch({
      type: 'tag/queryResourceList',
      payload: { resourceId },
    });
  }, [dispatch]);

  const onEnter = (value: string) => {
    if (value.length === 0) {
      message.warn('标签为空');
      return;
    }
    value.split(',').forEach((v) => {
      if (tagList?.map((t) => t.tagVo.name).includes(v)) {
        return;
      }
      dispatch({
        type: 'tag/addTagToResource',
        payload: {
          name: v.trim(),
          resourceId: resourceId,
        },
      });
    });
    setValue('');
  };

  const { run: onSearch } = useDebounceFn(
    (value: string) => {
      dispatch({
        type: 'tag/queryList',
        payload: {
          name: value.trim(),
        },
      });
    },
    { wait: 500 },
  );

  const onChange = (current: string) => {
    setValue(current);
    if (search && current.length > 0) {
      onSearch(current);
    }
  };

  const onClose = (value: string) => {
    if (!tagList) {
      return;
    }
    const v: TagReferenceVo[] = tagList?.filter((p) => p?.tagVo?.name == value);
    dispatch({
      type: 'tag/removeTagFromResource',
      payload: {
        referenceId: v[0].id,
        resourceId: v[0].resourceId,
      },
    });
    dispatch({
      type: 'tag/queryResourceList',
      payload: { resourceId },
    });
  };

  const valueList = (): string[] => {
    if (tagList && tagList.length > 0) {
      // @ts-ignore
      return tagList.map((t) => t?.tagVo?.name);
    }
    const arr: string[] = [];
    return arr;
  };

  const renderSearchResult = () => {
    return searchResult.map((t) => (
      <Tag key={t.id} onClick={(e) => onEnter(t.name)}>
        {t.name}
      </Tag>
    ));
  };

  return (
    <React.Fragment>
      <TagInput
        onEnter={onEnter}
        onClose={onClose}
        onValueChange={onChange}
        close={true}
        valueList={valueList()}
        value={value}
      />
      {search && renderSearchResult()}
    </React.Fragment>
  );
};

export default connect(({ tag: { tagReferenceVoList, tagList } }: ModelType) => ({
  tagList: tagReferenceVoList,
  searchResult: tagList,
}))(ResourceTag);
