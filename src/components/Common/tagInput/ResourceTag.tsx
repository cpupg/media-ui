import TagReferenceVo from '@/types/entity';
import React, { useState } from 'react';
import { connect, useDispatch } from 'umi';
import TagInput from '.';
import { ModelType } from '@/types/model';

interface PropsType {
  /**
   * 资源标识，默认为空。
   */
  resourceId: string;
  /**
   * 标签列表，查表获取。
   */
  tagList?: TagReferenceVo[];
}
/**
 * 展示资源关联的标签，可以向资源增删标签。
 * @param props 属性
 * @returns 组件
 */
const ResourceTag: React.FC<PropsType> = (props) => {
  const { resourceId, tagList } = props;

  const dispatch = useDispatch();
  // 标签列表，从后台获取，添加新标签后刷新
  // 当前输入框的标签
  const [value, setValue] = useState<string>('');

  const onEnter = (value: string) => {
    if (tagList?.map((t) => t.tagVo.name).includes(value)) {
      return;
    }
    setValue('');
    dispatch({
      type: 'tag/addTagToResource',
      payload: {
        name: value,
        resourceId: resourceId,
        tagReferenceId: resourceId,
      },
    });
  };

  const onChange = (current: string) => {
    setValue(current);
  };

  const onClose = (value: string) => {
    dispatch({
      type: 'tag/removeTagFromResource',
      payload: {
        tagReferenceId: '',
      },
    });
  };

  const valueList = (): string[] => {
    if (tagList && tagList.length > 0) {
      // @ts-ignore
      return tagList.map((t) => t.tagVo.name);
    }
    const arr: string[] = [];
    return arr;
  };

  return (
    <TagInput
      onEnter={onEnter}
      onClose={onClose}
      onValueChange={onChange}
      close={true}
      valueList={valueList()}
      value={value}
    />
  );
};

export default connect(({ tag: { tagList } }: ModelType) => tagList)(ResourceTag);
