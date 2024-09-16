import type TagReferenceVo from '@/types/entity';
import { Tag } from 'antd';
import React from 'react';
import { useDispatch } from 'umi';
import './resourceTag.css';
import consts from '../consts';

const { colorArray } = consts;

export interface ResourceTagPropsType {
  /**
   * 标签列表，由父组件传入。
   */
  tagList: TagReferenceVo[];
  /**
   * 是否可编辑。
   */
  editable?: boolean;
  /**
   * 资源标识，由父组件传入。
   */
  resourceId?: string;
  /**
   * 标签总数。
   */
  totalCount?: number;
  /**
   * 标签数量大于5后，是否展示提示内容。
   */
  showMoreMessage?: boolean;
}

const ResourceTags: React.FC<ResourceTagPropsType> = (props: ResourceTagPropsType) => {
  const { tagList, editable, totalCount, resourceId, showMoreMessage } = props;
  const dispatch = useDispatch();

  const deleteTag = (tag: TagReferenceVo) => {
    dispatch({
      type: 'resource/deleteTag',
      payload: {
        resourceId: resourceId,
        referenceId: tag.id,
      },
    });
  };

  const renderUnEditableTag = () => {
    const leftCount = totalCount ? totalCount - 5 : -1;
    return (
      <React.Fragment>
        {tagList.map((tag, index) => {
          return (
            <Tag color={colorArray[index % 10]} key={tag.id} style={{ color: 'black' }}>
              {tag.tagVo?.name}
            </Tag>
          );
        })}
        {leftCount > 0 && showMoreMessage && <p>{`点击单元格查看剩余${leftCount}个标签`}</p>}
      </React.Fragment>
    );
  };

  const renderEditableTag = () => {
    const tagLength = tagList.length;
    return (
      <React.Fragment>
        {tagList.map((tag, index) => {
          return (
            <Tag
              color={colorArray[index % 10]}
              key={tag.id}
              style={{ color: 'black' }}
              closable={index < tagLength}
              onClose={() => deleteTag(tag)}
            >
              {tag.tagVo?.name}
            </Tag>
          );
        })}
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      {editable && renderEditableTag()}
      {!editable && renderUnEditableTag()}
    </React.Fragment>
  );
};

export default ResourceTags;
