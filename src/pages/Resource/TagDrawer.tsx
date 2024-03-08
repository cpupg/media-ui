import FavoriteTag from '@/components/Common/tagFc/FavoriteTag';
import RateTag from '@/components/Common/tagFc/RateTag';
import ResourceTags from '@/components/Common/tagFc/ResourceTag';
import type TagReferenceVo from '@/types/entity';
import type { TagVo } from '@/types/entity';
import type { ModelType } from '@/types/model';
import { useDebounceFn } from 'ahooks';
import { Divider, Drawer, Input, Tag, message } from 'antd';
import type { CSSProperties, ReactNode } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch } from 'umi';

const colorArray = [
  '#ffa39e',
  '#ffa940',
  '#fff1b8',
  '#ffc53d',
  '#73d13d',
  '#5cdbd3',
  '#4096ff',
  '#b37feb',
  '#f759ab',
  '#ffd6e7',
];

export interface TagDrawerPropsType {
  /**
   * 当前资源拥有的标签。
   */
  tagList: TagReferenceVo[];
  /**
   * 模糊查询输入框输入内容。
   */
  dbTagList: TagVo[];
  resourceId: string;
  setVisible: (v: boolean) => void;
  visible: boolean;
  /**
   * 关闭时调用。
   */
  onClose: () => void;
  /**
   * 抽屉标题。
   */
  renderTitle?: ReactNode;
}

const TagDrawer: React.FC<TagDrawerPropsType> = (props) => {
  const { resourceId, tagList, visible, onClose, renderTitle, dbTagList, setVisible } = props;
  const [newTag, setNewTag] = useState('');
  const dispatch = useDispatch();
  const editInputRef = useRef(null);

  useEffect(() => {
    dispatch({
      type: 'resource/fetchTagList',
      payload: {
        resourceId: resourceId,
      },
    });
  }, [dispatch, resourceId]);

  const { run: handleInputChangeDe } = useDebounceFn(
    () => {
      if (newTag.length == 0) {
        return;
      }
      dispatch({
        type: 'tag/queryTagList',
        payload: {
          name: newTag,
        },
      });
    },
    { wait: 500 },
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
    handleInputChangeDe();
  };

  const addNewTag = () => {
    if (newTag.indexOf(',') > -1) {
      const tags: string[] = newTag.split(',');
      tags.forEach((t) => {
        if (t.length == 0 || t.length > 10) {
          message.warn('标签为空或超过10位');
          return;
        }
        dispatch({
          type: 'resource/addTag',
          payload: {
            resourceId,
            tagName: t,
          },
        });
      });
      setNewTag('');
      return;
    }
    if (newTag.length == 0 || newTag.length > 10) {
      message.warn('标签为空或超过10位');
      return;
    }
    dispatch({
      type: 'resource/addTag',
      payload: {
        resourceId,
        tagName: newTag,
      },
    });
    setNewTag('');
  };

  const addTagByClick = (tag: TagVo) => {
    dispatch({
      type: 'resource/addTag',
      payload: {
        resourceId,
        tagName: tag.name,
      },
    });
  };

  const closeDrawer = () => {
    onClose();
    setVisible(false);
    dispatch({
      type: 'tag/setTagList',
      payload: [],
    });
  };

  /**
   * 选然searchTag查到的标签，点击标签可以为当前资源添加标签。
   */
  const renderTagArea = () => {
    return (
      <React.Fragment>
        {dbTagList.map((tag: TagVo, index: number) => {
          return (
            <Tag
              color={colorArray[index % 10]}
              style={{ color: 'black' }}
              onClick={() => addTagByClick(tag)}
              key={tag.id}
            >
              {tag.name}
            </Tag>
          );
        })}
      </React.Fragment>
    );
  };

  const dividerStyle: CSSProperties = {
    marginBottom: 10,
    marginTop: 10,
    paddingTop: 5,
  };

  return (
    <Drawer title={renderTitle} onClose={closeDrawer} visible={visible} placement="right">
      <Input
        placeholder="按回车添加标签，点击模糊查询查看相似标签"
        ref={editInputRef}
        value={newTag}
        onChange={handleInputChange}
        type="text"
        size="small"
        style={{ marginBottom: 5 }}
        onPressEnter={addNewTag}
      />
      <Divider style={dividerStyle} orientation="left">
        评分
      </Divider>
      <RateTag resourceId={resourceId} />
      <Divider style={dividerStyle} orientation="left">
        收藏
      </Divider>
      <FavoriteTag resourceId={resourceId} />
      <Divider style={dividerStyle} orientation="left">
        当前标签
      </Divider>
      <ResourceTags resourceId={resourceId} editable={true} tagList={tagList || []} />
      {dbTagList && dbTagList.length > 0 ? (
        <Divider style={dividerStyle} orientation="left">
          搜索结果
        </Divider>
      ) : null}
      {renderTagArea()}
    </Drawer>
  );
};

export default connect(({ resource: { tagList }, tag: { tagList: dbTagList } }: ModelType) => ({
  tagList,
  dbTagList,
}))(TagDrawer);
