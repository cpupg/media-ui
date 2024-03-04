import { ResourceVo } from '@/types/entity';
import { ModelType } from '@/types/model';
import { TableResponse } from '@/types/response/table';
import { useDebounceFn } from 'ahooks';
import { Input, Modal, Table, TableColumnType, TablePaginationConfig } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'umi';
import './style.less';

interface PropsType {
  onSelect: (data: ResourceVo) => void;
  onCancel: () => void;
  response?: TableResponse<ResourceVo>;
  visible: boolean;
  albumId?: string;
}

const ResourceSelectModal: React.FC<PropsType> = (props) => {
  const { onCancel, onSelect, response, visible, albumId } = props;
  const [current, setCurrent] = useState(1);
  const [name, setName] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'selectModal/resource/queryList',
      payload: {
        params: {
          current,
          pageSize: 10,
          filename: name,
          albumId,
        },
      },
    });
  }, [dispatch]);

  const columns: TableColumnType<ResourceVo>[] = [
    {
      title: '文件名',
      ellipsis: true,
      dataIndex: 'filename',
    },
    {
      title: '路径',
      ellipsis: true,
      dataIndex: 'dir',
    },
  ];

  const pagination: TablePaginationConfig = {
    showTotal: (total) => `总计:${total}`,
    onChange: (page) => {
      setCurrent(page);
      dispatch({
        type: 'selectModal/resource/queryList',
        payload: {
          params: {
            current: page,
            pageSize: 10,
            filename: name,
            albumId,
          },
        },
      });
    },
    total: response?.total,
    current: current,
  };

  const onRow = (data: ResourceVo) => ({
    onClick: () => {
      onSelect(data);
    },
  });

  const { run: onSearch } = useDebounceFn(
    (value: string) => {
      dispatch({
        type: 'selectModal/resource/queryList',
        payload: {
          params: {
            current,
            pageSize: 10,
            filename: value,
            albumId,
          },
        },
      });
    },
    { wait: 500 },
  );

  const rowClassName = (record: ResourceVo) => {
    if (record.albumId) {
      return 'selectRow';
    }
    return '';
  };

  return (
    <Modal visible={visible} title="选择资源" onCancel={onCancel} onOk={onCancel}>
      <Input.Search value={name} onSearch={onSearch} onChange={(e) => setName(e.target.value)} />
      <Table
        rowClassName={rowClassName}
        size="small"
        columns={columns}
        pagination={pagination}
        dataSource={response?.data}
        onRow={onRow}
      />
    </Modal>
  );
};

export default connect(({ 'selectModal/resource': { response } }: ModelType) => ({
  response,
}))(ResourceSelectModal);
