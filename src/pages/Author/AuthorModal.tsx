import SiteSelectorModal from '@/components/Common/selectorModal/SiteSelectorModal';
import type { ModelType } from '@/types/model';
import type { SiteVo } from '@/types/entity';
import { Form, Input, Modal } from 'antd';
import React, { useState } from 'react';
import { connect, useDispatch } from 'umi';

const { Item } = Form;

interface PropsType {
  visible: boolean;
  /**
   * 关闭弹框的回调，即onOk和onCancel。
   */
  closeModal: () => void;
  reload: () => void;
}

const AuthorModal: React.FC<PropsType> = (props) => {
  const { visible, closeModal, reload } = props;
  const [form] = Form.useForm();
  const [selectedSite, setSelectedSite] = useState<SiteVo>();
  const [page, setPage] = useState(1);
  const [siteVisible, setSiteVisible] = useState(false);
  const dispatch = useDispatch();

  const onSelect = (record: SiteVo) => {
    setSelectedSite(record);
    form.setFieldsValue({
      siteId: record.id,
      siteName: record.siteName,
    });
    setSiteVisible(false);
  };

  const setCurrentPage = (current: number) => {
    setPage(current);
  };

  const onCancel = () => {
    setSiteVisible(false);
  };

  const submitAuthorData = () => {
    form
      .validateFields()
      .then((values) => {
        dispatch({
          type: 'author/addAuthor',
          payload: {
            ...values,
          },
        });
        closeModal();
        form.resetFields();
        reload();
      })
      .catch((errors) => {
        console.log(errors);
      });
  };

  const closeAuthorModal = () => {
    closeModal();
  };

  return (
    <Modal visible={visible} title="新增作者" onOk={submitAuthorData} onCancel={closeAuthorModal}>
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} form={form}>
        <Item
          name="username"
          label="用户名"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Item>
        <Item name="userId" label="用户id">
          <Input />
        </Item>
        <Item name="homepage" label="用户主页" rules={[{ type: 'url' }]}>
          <Input />
        </Item>
        <Item name="siteName" label="网站" rules={[{ required: true }]}>
          <Input onClick={() => setSiteVisible(true)} onFocus={() => setSiteVisible(true)} />
        </Item>
        <Item name="siteId" label="网站" hidden={true} rules={[{ required: true }]}>
          <Input />
        </Item>
        {siteVisible && (
          <SiteSelectorModal
            title="设置作者注册时用的网站"
            currentPage={page}
            setCurrentPage={setCurrentPage}
            selectedSite={selectedSite}
            onSelect={onSelect}
            visible={siteVisible}
            onCancel={onCancel}
          />
        )}
      </Form>
    </Modal>
  );
};

export default connect(({ author: { authorList } }: ModelType) => ({
  authorList,
}))(AuthorModal);
