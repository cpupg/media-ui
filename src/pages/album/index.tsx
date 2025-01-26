import ImageUpload from '@/components/Common/upload/ImageUpload';
import { queryAlbumList } from '@/services/album';
import type { AlbumVo } from '@/types/entity';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { Button, Input, Modal, Popover, message } from 'antd';
import React, { useRef, useState } from 'react';
import type { AlbumModelState } from 'umi';
import { connect, useDispatch } from 'umi';
import Detail from './Detail';

type PropsType = AlbumModelState;

const Album: React.FC<PropsType> = () => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const actionRef = useRef<ActionType>();
  const [albumId, setAlbumId] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const columns: ProColumns<AlbumVo>[] = [
    {
      title: '专辑名称',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '操作',
      hideInSearch: true,
      hideInForm: true,
      width: 50,
      render: (_, data: AlbumVo) => (
        <Button.Group>
          <Button
            size="small"
            onClick={() => {
              setAlbumId(data.id);
              setCurrentName(data.name);
              setShowPreview(true);
            }}
          >
            预览
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setAlbumId(data.id);
              setCurrentName(data.name);
              setShowDetail(true);
            }}
          >
            详情
          </Button>
        </Button.Group>
      ),
    },
  ];

  const addAlbum = () => {
    if (name.length === 0 || name.length > 32) {
      message.warn('专辑名称过长或为空');
      return;
    }
    dispatch({
      type: 'album/addAlbum',
      payload: {
        albumName: name.trim(),
        coverId: '0',
      },
    });
    setName('');
    actionRef.current?.reload();
  };

  const formPopover: React.FC = () => {
    return (
      <>
        <Input
          style={{ marginBottom: 5 }}
          onPressEnter={(e) => addAlbum()}
          size="small"
          placeholder="请输入专辑名称"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button size="small" type="primary" onClick={(e) => addAlbum()}>
          确定
        </Button>
      </>
    );
  };

  const closePreview = () => {
    setShowPreview(false);
    dispatch({
      type: 'upload/imageUpload/setFileList',
      payload: [],
    });
  };

  return (
    <>
      <ProTable<AlbumVo>
        columns={columns}
        pagination={{ showQuickJumper: true }}
        rowKey="id"
        defaultSize="small"
        actionRef={actionRef}
        toolBarRender={() => [
          <Popover key={1} content={formPopover} trigger="click">
            <Button>新建</Button>
          </Popover>,
        ]}
        request={async (params, sort, filter) => {
          params.albumName = params.name;
          return queryAlbumList({ params, sort, filter }).then((v) => {
            if (v.success) {
              return v;
            } else {
              message.error(v.message);
            }
          });
        }}
      />
      {showDetail && (
        <Detail
          albumName={currentName}
          albumId={albumId}
          onCancel={() => setShowDetail(false)}
          visible={showDetail}
        />
      )}
      {showPreview && (
        <Modal
          visible={showPreview}
          title={`专辑【${currentName}】预览`}
          onCancel={closePreview}
          onOk={closePreview}
        >
          <ImageUpload businessCode={albumId} businessType={4} />
        </Modal>
      )}
    </>
  );
};

export default connect(() => ({}))(Album);
