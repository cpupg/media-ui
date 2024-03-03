import AlbumSelectModal from '@/components/Common/selectorModal/AlbumSelectModal';
import { AlbumResourceVo, AlbumVo } from '@/types/entity';
import { ModelType } from '@/types/model';
import { TableResponse } from '@/types/response/table';
import { Button, Modal, Table, TableColumnType, TablePaginationConfig } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'umi';

interface PropsType {
  resourceId: string;
  resourceName: string;
  visible: boolean;
  onCancel: () => void;
  albumTableResponse: TableResponse<AlbumResourceVo>;
}

const Album: React.FC<PropsType> = (props: PropsType) => {
  const { resourceId, albumTableResponse, visible, onCancel, resourceName } = props;
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showAlbumSelect, setShowAlbumSelect] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'resource/queryAlbumList',
      payload: {
        params: {
          resourceId: resourceId,
          pageSize,
          current,
        },
      },
    });
  }, [dispatch]);

  const onPaginationChange = (page: number, pageSize: number) => {
    setCurrent(page);
    setPageSize(pageSize);
    dispatch({
      type: 'resource/queryAlbumList',
      payload: {
        params: {
          resourceId: resourceId,
          pageSize,
          current: page,
        },
      },
    });
  };

  const unSet = (data: AlbumResourceVo) => {
    dispatch({
      type: 'resource/unsetAlbum',
      payload: {
        albumResourceId: data.id,
        resourceId: resourceId,
      },
    });
  };

  const columns: TableColumnType<AlbumResourceVo>[] = [
    {
      title: '专辑名称',
      dataIndex: 'albumName',
    },
    {
      title: '操作',
      render: (_, record) => (
        <Button size="small" onClick={() => unSet(record)}>
          删除
        </Button>
      ),
    },
  ];

  const onSelect = (data: AlbumVo) => {
    dispatch({
      type: 'resource/setAlbum',
      payload: {
        resourceId: resourceId,
        albumId: data.id,
      },
    });
  };

  const pagination: TablePaginationConfig = {
    current: current,
    pageSize: pageSize,
    onChange: onPaginationChange,
    total: albumTableResponse.total,
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title={`包含【${resourceName}】的专辑`}
      footer={[
        <Button
          key={2}
          onClick={() => {
            setShowAlbumSelect(true);
          }}
        >
          选择专辑
        </Button>,
        <Button key={1} type="primary" onClick={onCancel}>
          确定
        </Button>,
      ]}
    >
      <Table
        rowKey="id"
        columns={columns}
        size="small"
        pagination={pagination}
        dataSource={albumTableResponse.data}
      />
      {showAlbumSelect && (
        <AlbumSelectModal
          resourceName={resourceName}
          resourceId={resourceId}
          visible={showAlbumSelect}
          onCancel={() => setShowAlbumSelect(false)}
          onSelect={onSelect}
        />
      )}
    </Modal>
  );
};

export default connect(({ resource: { albumTableResponse } }: ModelType) => ({
  albumTableResponse,
}))(Album);
