import AuthorSelectorModal from '@/components/Common/selectorModal/AuthorSelectorModal';
import ImageUpload from '@/components/Common/upload/ImageUpload';
import type { AuthorVo, ResourceVo } from '@/types/entity';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Button, Form } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'umi';

interface ModalType {
  /**
   * 刷新父组件。
   */
  reload: () => void;
  /**
   * 关闭弹框。
   */
  onCancel?: () => void;
  /**
   * 要修改的资源。
   */
  data?: ResourceVo;
  visible?: boolean;
}

interface FormType {
  /**
   * 资源标识
   */
  id?: string;
  /**
   * 资源对应的文件名。
   */
  filename: string;
  /**
   * 资源所在目录。
   */
  dir: string;
  /**
   * 作者标识，author.id，不是author.useId。
   */
  authorId: string;
  /**
   * 作者名称。
   */
  authorName: string;
  /**
   * 第一次出现的专辑，可选。
   */
  albumId?: string;
  /**
   * 专辑名称。
   */
  albumName?: string;
}

const ResourceFormModal: React.FC<ModalType> = (props: ModalType) => {
  const { reload, data, visible, onCancel } = props;

  const [authorVisible, setAuthorVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAuthor, setSelectedAuthor] = useState({});
  const [form] = Form.useForm<FormType>();
  const dispatch = useDispatch();

  const onSelect = (author: AuthorVo) => {
    setSelectedAuthor(author);
    setAuthorVisible(false);
    form.setFieldsValue({
      authorId: author.id,
      authorName: author.username,
    });
  };

  const onFinish = async (values: FormType) => {
    dispatch({
      type: 'resource/addResource',
      payload: {
        authorId: values.authorId,
        dir: values.dir,
        filename: values.filename,
        id: values.id,
      },
    });
    form.resetFields();
    setSelectedAuthor({});
    reload();
    return true;
  };

  return (
    <ModalForm
      onFinish={onFinish}
      title="添加资源"
      trigger={<Button type='primary'>新建</Button>}
      modalProps={{ onCancel: onCancel }}
      visible={visible}
      form={form}
      width={500}
    >
      {data && <ProFormText hidden={true} name="id" initialValue={data?.id} />}
      <ProFormText
        label="资源名称"
        name="filename"
        initialValue={data?.filename}
        rules={[{ required: true, max: 90 }]}
      />
      <ProFormText
        label="资源目录"
        name="dir"
        initialValue={data?.dir}
        rules={[{ required: true, max: 900 }]}
      />
      <ProFormText
        hidden={true}
        name="authorId"
        initialValue={data?.authorVo.id}
        rules={[{ required: true, max: 90 }]}
      />
      <ProFormText
        fieldProps={{
          onClick: () => setAuthorVisible(true),
          onFocus: () => setAuthorVisible(true),
        }}
        label="作者姓名"
        name="authorName"
        initialValue={data?.authorVo.username}
        rules={[{ required: true, max: 90 }]}
      />
      {authorVisible && (
        <AuthorSelectorModal
          addButton
          title="设置资源创建者"
          currentPage={currentPage}
          selectedAuthor={selectedAuthor}
          visible={authorVisible}
          onCancel={() => setAuthorVisible(false)}
          onSelect={onSelect}
          setCurrentPage={setCurrentPage}
        />
      )}
    </ModalForm>
  );
};

export default ResourceFormModal;
