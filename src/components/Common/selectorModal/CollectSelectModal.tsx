import { CollectVo, ResourceVo } from '@/types/entity';
import { ModelType } from '@/types/model';
import { TableResponse } from '@/types/response/table';
import { Button, Col, Input, message, Modal, Row, Table, TablePaginationConfig } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'umi';

interface PropsType {
  /**
   * 资源。
   */
  resource: ResourceVo;
  /**
   * 点击确定和取消的回调。
   */
  onOk: () => void;
  /**
   * 可见性。
   */
  visible: boolean;
  /**
   * 收藏夹。
   */
  collectList?: TableResponse<CollectVo>;
}

const CollectResourceModal: React.FC<PropsType> = (props) => {
  const { resource, onOk, visible, collectList } = props;
  const dispatch = useDispatch();

  const [current, setCurrent] = useState(1);
  const [name, setName] = useState('');
  const [showSearch, setShowSearch] = useState(true);

  const search = () => {
    dispatch({
      type: 'collect/queryCollect',
      payload: {
        params: {
          current: current,
          pageSize: 10,
          collectName: name,
        },
      },
    });
  };

  const onSearch = () => {
    search();
    if (collectList?.total == 0) {
      setShowSearch(false);
    }
  };

  useEffect(() => {
    search();
  }, [dispatch]);

  const pagination: TablePaginationConfig = {
    onChange: (page) => {
      search();
      setCurrent(page);
    },
    total: collectList?.total,
    current: current,
  };

  const create = () => {
    if (name.length == 0 || name.length > 32) {
      message.warn('收藏夹名称最少1个字符最多32个字符');
      return;
    }
    dispatch({
      type: 'collect/create',
      payload: {
        collectName: name,
      },
    });
    setShowSearch(true);
    search();
  };

  const onRow: (data: CollectVo) => React.HTMLAttributes<any> = (data: CollectVo) => {
    return {
      onClick: () => {
        dispatch({
          type: 'collect/addCollect',
          payload: {
            resourceId: resource.id,
            collectId: data.collectId,
          },
        });
      },
      style: { backgroundColor: 'green' },
    };
  };

  return (
    <Modal title="选择收藏夹" onOk={onOk} onCancel={onOk} visible={visible}>
      <Row>
        <Col span={18}>
          <Input
            placeholder="输入收藏夹来查询"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Col>
        <Col span={6}>
          {showSearch ? (
            <Button type="primary" onClick={onSearch}>
              查询
            </Button>
          ) : (
            <Button type="primary" onClick={create}>
              创建收藏夹
            </Button>
          )}
        </Col>
      </Row>
      <Table onRow={onRow} dataSource={collectList?.data} pagination={pagination} />
    </Modal>
  );
};

export default connect(({ collect: { collectList } }: ModelType) => ({
  collectList: collectList,
}))(CollectResourceModal);
