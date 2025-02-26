import { Modal } from 'antd';
import React from 'react';
import ResourceTag from './ResourceTag';
import { ResourceVo } from '@/types/entity';
import { useDispatch } from 'umi';

interface PropsType {
  /**
   * 点击确认时的回调。
   * 确认、取消和关闭都用此方法。
   */
  onOk: () => void;
  /**
   * 是否可见。
   */
  visible: boolean;
  /**
   * 当前选择的资源。
   */
  resource: ResourceVo;
}

const TagInputModal: React.FC<PropsType> = (props) => {
  const { onOk, resource, visible } = props;

  const dispatch = useDispatch();

  const close = () => {
    onOk();
    dispatch({
      type: 'tag/setTagList',
      payload: [],
    });
  };

  return (
    <Modal visible={visible} onCancel={close} onOk={close} title={resource.filename}>
      <ResourceTag search resourceId={resource.id} />
    </Modal>
  );
};

export default TagInputModal;
