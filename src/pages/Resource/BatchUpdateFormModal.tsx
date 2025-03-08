import TagInputForm from '@/components/Common/tagInput/TagInputForm';
import type { ModelType } from '@/types/model';
import { ResourceData, ResourceParam } from '@/types/request/resource';
import { TableRequest } from '@/types/request/table';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Alert, Button, Form } from 'antd';
import React, { useState } from 'react';
import { connect, useDispatch } from 'umi';
import AlbumInput from './AlbumInput';

interface PropsType {
  /**
   * 关闭弹框。
   */
  onCancel?: () => void;
  /**
   * 搜索条件。
   */
  condition: TableRequest<any, ResourceParam, any>;
  /**
   * 资源标识。
   */
  resourceId?: string;
  /**
   *
   * 检查更新条件是否为空，true为空，false不为空。
   */
  isConditionEmpty: () => boolean;
}

interface PropsType {}

const BatchUpdateFormModal: React.FC<PropsType> = (props) => {
  const { onCancel, condition, resourceId, isConditionEmpty } = props;

  const [form] = Form.useForm<ResourceData>();

  // 批量更新没有选择条件时展示警告。
  const [warn, setWarn] = useState(false);

  const dispatch = useDispatch();

  const onFinish = async (values: any) => {
    const payload: ResourceData = {
      condition,
      ...values,
    };
    dispatch({
      type: 'resource/batchUpdate',
      payload,
    });
    form.resetFields(['addedAlbums', 'addedTags', 'dir']);
    return true;
  };

  const checkCondition = () => {
    if (resourceId) {
      // 点击操作列的修改按钮
      return;
    }
    const b = isConditionEmpty();
    if (b) {
      setWarn(true);
    }
  };

  return (
    <ModalForm
      title="批量修改资源"
      trigger={<Button onClick={checkCondition}>批量修改</Button>}
      onFinish={onFinish}
      modalProps={{ onCancel: onCancel }}
      form={form}
    >
      {warn && <Alert showIcon message="更新条件为空" type="warning" />}
      <div style={{ marginBottom: 10 }}>目录</div>
      <ProFormText name="dir" />
      <div style={{ marginBottom: 10 }}>标签</div>
      <TagInputForm form={form} name="addedTags" />
      <div style={{ marginBottom: 10 }}>专辑</div>
      <AlbumInput form={form} name="addedAlbums" />
    </ModalForm>
  );
};

export default connect(({ resource: { resourceList } }: ModelType) => ({
  resourceList,
}))(BatchUpdateFormModal);
