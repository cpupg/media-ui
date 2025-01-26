import type { AuthorStateType } from '@/models/author';
import { queryList } from '@/services/author';
import type { AuthorVo, SiteVo } from '@/types/entity';
import type { ModelType } from '@/types/model';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Input, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import { connect, useDispatch } from 'umi';
import AuthorModal from './AuthorModal';

const Author: React.FC<AuthorStateType> = () => {
  const [authorModalVisible, setAuthorModalVisible] = useState(false);
  const [siteSelectorVisible, setSiteSelectorVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedSites, setSelectedSites] = useState(null);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const dispatch = useDispatch();

  const reload = () => {
    actionRef.current?.reload();
  };

  const closeModal = () => {
    setAuthorModalVisible(false);
  };

  const deleteAuthor = (_dom: any, record: AuthorVo) => {
    dispatch({
      type: 'author/deleteAuthor',
      payload: record.id,
    });
    reload();
  };

  const onSiteSelect = (site: SiteVo) => {
    const form = formRef.current;
    form?.setFieldsValue({
      siteId: site.id,
      siteName: site.siteName,
    });
    setSelectedSites(site);
    setSiteSelectorVisible(false);
  };

  const columns: ProColumns<AuthorVo>[] = [
    {
      dataIndex: 'userId',
      title: '用户标识',
      width: 200,
    },
    {
      dataIndex: 'username',
      title: '用户名',
      width: 200,
    },
    {
      dataIndex: ['site', 'siteName'],
      title: '用户来源',
      formItemProps: {
        name: 'siteName',
      },
      renderFormItem: () => {
        return <Input allowClear={true} onClick={() => setSiteSelectorVisible(true)} />;
      },
    },
    {
      dataIndex: 'siteIdFormKey',
      hideInTable: true,
      hideInSearch: true,
      formItemProps: {
        name: 'siteId',
      },
    },
    {
      dataIndex: 'createTime',
      valueType: 'dateTime',
      title: '注册时间',
      hideInSearch: true,
      width: 150,
    },
    {
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      title: '更新时间',
      hideInSearch: true,
      width: 150,
    },
    {
      dataIndex: 'option',
      title: '操作',
      hideInSearch: true,
      width: 50,
      render: (_dom, record) => {
        return (
          <Popconfirm
            title="确认删除"
            okButtonProps={{ danger: true, type: 'primary' }}
            onConfirm={() => deleteAuthor(_dom, record)}
          >
            <Button size="small" type="primary" danger>
              删除
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <div>
      <ProTable<AuthorVo>
        formRef={formRef}
        pagination={{ showQuickJumper: true }}
        actionRef={actionRef}
        defaultSize="small"
        columns={columns}
        rowKey="id"
        request={async (params, sorter, filter) => queryList({ params, sorter, filter })}
        toolBarRender={() => [
          <Button key="button" onClick={() => setAuthorModalVisible(true)}>
            新建
          </Button>,
        ]}
      />
      {authorModalVisible && (
        <AuthorModal reload={reload} visible={authorModalVisible} closeModal={closeModal} />
      )}
    </div>
  );
};

export default connect(({ author }: ModelType) => ({
  author,
}))(Author);
