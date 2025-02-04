import type { ModelType } from '@/types/model';
import { ResourceData, ResourceParam } from '@/types/request/resource';
import { TableRequest } from '@/types/request/table';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Button, Form } from 'antd';
import React from 'react';
import { connect, useDispatch } from 'umi';

interface PropsType {
  /**
   * 刷新父组件。
   */
  reload: () => void;
  /**
   * 关闭弹框。
   */
  onCancel?: () => void;
  /**
   * 搜索条件。
   */
  condition: TableRequest<any, ResourceParam, any>;
}

interface PropsType {}

const BatchUpdateFormModal: React.FC<PropsType> = (props) => {
  const { onCancel, condition, reload } = props;
  const [form] = Form.useForm<ResourceData>();
  const dispatch = useDispatch();

  const onFinish = async (values: any) => {
    const { dir } = values;
    const payload: ResourceData = {
      condition,
      dir,
    };
    dispatch({
      type: 'resource/batchUpdate',
      payload
    });
    return true;
  };

  return (
    <ModalForm
      title="批量修改资源"
      trigger={<Button>批量修改</Button>}
      onFinish={onFinish}
      modalProps={{ onCancel: onCancel }}
      form={form}
    >
      <ProFormText label="目录" name="dir" />
    </ModalForm>
  );
};

export default connect(({ resource: { resourceList } }: ModelType) => ({
  resourceList,
}))(BatchUpdateFormModal);
