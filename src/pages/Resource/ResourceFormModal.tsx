import AuthorSelectorModal from '@/components/Common/selectorModal/AuthorSelectorModal';
import { queryList } from '@/services/author';
import type { AuthorVo, ResourceVo } from '@/types/entity';
import { TableResponse } from '@/types/response/table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Form } from 'antd';
import React, { FocusEventHandler, useEffect, useState } from 'react';
import { useDispatch } from 'umi';

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

const ResourceFormModal: React.FC<PropsType> = (props: PropsType) => {
  const { reload, data, visible, onCancel } = props;

  const [authorVisible, setAuthorVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAuthor, setSelectedAuthor] = useState({});
  const [form] = Form.useForm<FormType>();
  const dispatch = useDispatch();

  useEffect(() => {
    queryList({
      params: { current: 1, pageSize: 20, userId: 'default_user' },
      sorter: {},
      filter: {},
    }).then((res: TableResponse<AuthorVo>) => {
      if (res.success) {
        for (const author of res.data) {
          if (author.userId !== 'default_user') {
            continue;
          }
          form.setFieldsValue({
            authorId: author.id,
            authorName: author.username,
          });
        }
      }
    });
  });

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

  const setDir: FocusEventHandler<HTMLTextAreaElement> = (e) => {
    e.preventDefault();
    const value: string = form.getFieldValue('filename');
    if (!value) {
      return;
    }
    const filenameArray = value.split('\n');
    const parsed: string[] = parsePath(filenameArray[0]);
    const dir = parsed[1];
    const newValue = filenameArray.reduce((pv: string, cv: string) => {
      return pv + '\n' + parsePath(cv)[0];
    }, parsed[0]);
    form.setFieldsValue({
      dir,
      filename: newValue,
    });
  };

  /**
   *
   * @param filename 解析路径
   * @returns [文件名，目录]
   */
  const parsePath: (arg: string) => string[] = (filename: string) => {
    if (filename.startsWith('"')) {
      filename = filename.substring(1);
    }
    if (filename.endsWith('"')) {
      filename = filename.substring(0, filename.length - 1);
    }
    const end = filename.charAt(filename.length - 1);
    if (end === '/' || end === '\\') {
      return [filename, filename];
    }
    if (filename && (filename.indexOf('/') > -1 || filename.indexOf('\\') > -1)) {
      const index =
        filename.lastIndexOf('/') > -1 ? filename.lastIndexOf('/') : filename.lastIndexOf('\\');
      const dir = filename.substring(0, index);
      const file = filename.substring(index + 1);
      return [file, dir];
    } else {
      return [filename, filename];
    }
  };

  return (
    <ModalForm
      onFinish={onFinish}
      title={data ? `修改资源【${data.filename}】` : '添加资源'}
      trigger={<Button type="primary">新建</Button>}
      modalProps={{ onCancel: onCancel }}
      visible={visible}
      form={form}
      width={500}
    >
      {data && <ProFormText hidden={true} name="id" initialValue={data?.id} />}
      <ProFormTextArea
        label="资源名称"
        name="filename"
        initialValue={data?.filename}
        placeholder="换行输入多个文件，请确保目录相同"
        fieldProps={{
          onBlur: setDir,
        }}
        rules={[{ required: true }]}
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
