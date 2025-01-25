import { CollectVo, ResourceCollectVo, ResourceVo } from '@/types/entity';
import { ModelType } from '@/types/model';
import { TableResponse } from '@/types/response/table';
import { Button, Modal, Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'umi';
import CollectSelectModal from '../selectorModal/CollectSelectModal';
interface PropsType {
  /**
   * 资源标识。
   */
  resource: ResourceVo;
  /**
   * 点击确认喝关闭的回调。
   */
  onOK: () => void;
  /**
   * 弹框是否可见。
   */
  visible: boolean;
  /**
   * 收藏夹。
   */
  collectList?: TableResponse<CollectVo>;
  /**
   * 已添加的收藏夹。
   */
  resourceCollectList?: TableResponse<ResourceCollectVo>;
}

const Collect: React.FC<PropsType> = (props) => {
  const { resource, visible, onOK, resourceCollectList } = props;

  const dispatch = useDispatch();

  const [current, setCurrent] = useState(1);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'collect/queryResourceCollect',
      payload: {
        params: {
          resourceId: resource.id,
          current: 1,
          pageSize: 5,
        },
      },
    });
  }, [dispatch]);

  const columns: ColumnsType<ResourceCollectVo> = [
    {
      title: '收藏夹',
      dataIndex: 'collectName',
    },
  ];

  const pagination: TablePaginationConfig = {
    onChange: (page, pageSize) => {
      dispatch({
        type: 'collect/queryResourceCollect',
        payload: {
          params: {
            resourceId: resource.id,
            current: 1,
            pageSize: 10,
          },
        },
      });
      setCurrent(page);
    },
    current: current,
    total: resourceCollectList?.total,
  };

  return (
    <React.Fragment>
      <Modal
        title="添加到收藏夹"
        onOk={onOK}
        onCancel={onOK}
        visible={visible}
        footer={[
          <Button onClick={() => setShowModal(true)}>添加到收藏夹</Button>,
          <Button type="primary" onClick={onOK}>
            确定
          </Button>,
        ]}
      >
        <Table
          size="small"
          dataSource={resourceCollectList?.data}
          columns={columns}
          pagination={pagination}
        />
      </Modal>
      {showModal && (
        <CollectSelectModal
          resource={resource}
          visible={showModal}
          onOk={() => setShowModal(false)}
        />
      )}
    </React.Fragment>
  );
};

export default connect(({ collect: { collectList, resourceCollectList } }: ModelType) => ({
  resourceCollectList: resourceCollectList,
}))(Collect);
