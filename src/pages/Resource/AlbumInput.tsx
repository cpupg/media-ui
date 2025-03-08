import AlbumSelectModal from '@/components/Common/selectorModal/AlbumSelectModal';
import TagInput from '@/components/Common/tagInput';
import { AlbumVo } from '@/types/entity';
import { Form, FormInstance, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'umi';

interface PropsType {
  /**
   * 资源标识。
   */
  resourceId?: string;
  /**
   * 资源名。
   */
  resourceName?: string;
  /**
   * 弹框标题，如果有次属性则覆盖`为【${resourceName}】选择专辑`。
   */
  title?: string;
  /**
   * 表单实例。
   */
  form: FormInstance<any>;
  /**
   * 表单名。
   */
  name: string;
}

/**
 * 专辑输入框，封装TagInput。
 * @param props 属性。
 */
const AlbumInput: React.FC<PropsType> = (props) => {
  const { resourceId, resourceName, title, form, name }: PropsType = props;

  // 显示专辑选择弹框
  const [visible, setVisible] = useState(false);
  // 已选择专辑，在标签上展示。
  const [tagList, setTagList] = useState<string[]>([]);
  // 已选择专辑
  const [albums, setAlbums] = useState<AlbumVo[]>([]);

  const dispatch = useDispatch();

  const query = () => {
    dispatch({
      type: 'resource/queryAlbumList',
      payload: {
        params: {
          current: 1,
          pageSize: 10,
          resourceId,
          queryWithResource: resourceId ?? false,
        },
      },
    });
  };

  useEffect(() => {
    query();
  }, [dispatch]);

  const onSelect = (data: AlbumVo) => {
    for (const al of albums) {
      if (al.name === data.name) {
        message.warn('已添加专辑' + data.name);
        return;
      }
    }
    const arr: AlbumVo[] = albums;
    arr.push(data);
    // @ts-expect-error
    const values: string[] = arr.map((a) => a.name);

    setTagList(values);
    setAlbums(arr);
    form.setFieldsValue({
      [name]: arr.map((a) => a.id),
    });
    setVisible(false);
  };

  const onClose = (value: string) => {
    const arr: AlbumVo[] = albums.filter((a) => a.name !== value);
    // @ts-expect-error
    const values: string[] = arr.map((a) => a.name);
    setTagList(values);
    setAlbums(arr);
    form.setFieldsValue({
      [name]: arr.map((a) => a.id),
    });
  };

  const onCancel = () => {
    setVisible(false);
    query();
  };

  return (
    <React.Fragment>
      <Form.Item name={name}>
        <TagInput
          valueList={tagList}
          onClose={onClose}
          close
          readonly={true}
          onClick={() => setVisible(true)}
          key={1}
        />
      </Form.Item>
      {visible && (
        <AlbumSelectModal
          onSelect={onSelect}
          visible={visible}
          key={2}
          queryWithResource={resourceId ? true : false}
          resourceName={resourceName}
          title={title}
          onCancel={onCancel}
          resourceId={resourceId}
        />
      )}
    </React.Fragment>
  );
};

export default connect()(AlbumInput);
