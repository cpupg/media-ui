import ResourceSelectModal from '@/components/Common/selectorModal/ResourceSelectModal';
import { AlbumResourceVo, ResourceVo } from '@/types/entity';
import { ModelType } from '@/types/model';
import { Button, message, Modal, Table, TablePaginationConfig } from 'antd';
import { ColumnType } from 'antd/lib/table';
import copy from 'copy-to-clipboard';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'umi';

interface PropsType {
  albumId: string;
  albumName: string;
  visible: boolean;
  onCancel: () => void;
  dataList: AlbumResourceVo[];
  total: number;
}

const Detail: React.FC<PropsType> = (props) => {
  const { albumId, visible, onCancel, dataList, total, albumName } = props;
  const [showResModal, setShowResModal] = useState(false);
  const dispatch = useDispatch();

  const [current, setCurrent] = useState(1);

  useEffect(() => {
    dispatch({
      type: 'resource/queryAlbumList',
      payload: {
        params: {
          albumId: albumId,
          pageSize: 10,
          current: 1,
        },
      },
    });
  }, [dispatch]);

  const pagination: TablePaginationConfig = {
    pageSize: 10,
    total: total,
    showTotal: (total) => `总计:${total}`,
    current: current,
    onChange: (page) => {
      setCurrent(page);
      dispatch({
        type: 'resource/queryAlbumList',
        payload: {
          params: {
            albumId: albumId,
            pageSize: 10,
            current: page,
          },
        },
      });
    },
  };

  const copyAbsolutePath = (data: AlbumResourceVo) => {
    const path = data.resourceDir + data.resourceName;
    const success = copy(path.replaceAll('/', '\\'));
    if (success) {
      message.success('全路径复制成功');
    } else {
      // 显示失败消息影响用户体验
      console.log('全路径复制失败');
    }
  };

  const columns: ColumnType<AlbumResourceVo>[] = [
    {
      title: '文件名',
      dataIndex: 'resourceName',
      ellipsis: true,
    },
    {
      title: '目录',
      dataIndex: 'resourceDir',
      ellipsis: true,
    },
    {
      title: '操作',
      width: 120,
      render: (_, data) => (
        <>
          <Button
            size="small"
            type="primary"
            danger
            onClick={() => {
              dispatch({
                type: 'resource/unsetAlbum',
                payload: {
                  albumResourceId: data.id,
                  albumId: data.albumId,
                },
              });
            }}
          >
            删除
          </Button>
          <Button size="small" onClick={() => copyAbsolutePath(data)}>
            复制
          </Button>
        </>
      ),
    },
  ];

  const closeResModal = () => {
    setShowResModal(false);
    dispatch({
      type: 'resource/queryAlbumList',
      payload: {
        params: {
          albumId: albumId,
          pageSize: 10,
          current: 1,
        },
      },
    });
  };

  const addResourceToAlbum = (data: ResourceVo) => {
    dispatch({
      type: 'resource/setAlbum',
      payload: {
        albumId,
        resourceId: data.id,
      },
    });
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title={`专辑【${albumName}】包含的资源`}
      footer={[
        <Button key={1} onClick={() => setShowResModal(true)}>
          添加资源
        </Button>,
        <Button type="primary" key={2} onClick={onCancel}>
          确定
        </Button>,
      ]}
    >
      <Table
        size="small"
        columns={columns}
        rowKey="id"
        dataSource={dataList}
        pagination={pagination}
      />
      {showResModal && (
        <ResourceSelectModal
          onCancel={closeResModal}
          onSelect={addResourceToAlbum}
          visible={showResModal}
          albumId={albumId}
        />
      )}
    </Modal>
  );
};

export default connect(({ resource: { albumTableResponse } }: ModelType) => ({
  dataList: albumTableResponse.data,
  total: albumTableResponse.total,
}))(Detail);
