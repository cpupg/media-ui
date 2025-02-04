import { AlbumVo } from '@/types/entity';
import { ModelType } from '@/types/model';
import { Input, Modal } from 'antd';
import Table, { ColumnType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'umi';
import './style.less';

interface PropsType {
  /**
   * 专辑列表，由umi注入。
   */
  albumList?: AlbumVo[];
  /**
   * 专辑总数，由umi注入。
   */
  total: number;
  /**
   * 点击专辑的回调。
   * @param data 当前选择的专辑。
   * @returns none
   */
  onSelect: (data: AlbumVo) => void;
  /**
   * 资源标识。
   */
  resourceId: string;
  /**
   * 可见性。
   */
  visible: boolean;
  /**
   * 点击取消的回调。
   * @returns void
   */
  onCancel: () => void;
  /**
   * 资源名。
   */
  resourceName?: string;
  /**
   * 查询专辑时是否关联资源，默认false。
   */
  queryWithResource?: boolean;
  /**
   * 弹框标题，如果有次属性则覆盖`为【${resourceName}】选择专辑`。
   */
  title?: string;
}
/**
 * 传入资源名和资源标识，然后选择专辑。已包含当前资源的专辑会高亮。
 * @param props 专辑选择弹框。
 * @returns 专辑弹框。
 */
const AlbumSelectModal: React.FC<PropsType> = (props) => {
  const {
    albumList,
    total,
    visible,
    onCancel,
    resourceName,
    onSelect,
    resourceId,
    queryWithResource,
    title,
  } = props;
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    dispatch({
      type: 'selectModal/albumSelectModal/queryAlbumList',
      payload: {
        params: {
          current: current,
          pageSize: 10,
          queryWithResource,
          resourceId,
        },
      },
    });
  }, [dispatch]);

  const columns: ColumnType<AlbumVo>[] = [
    {
      title: '专辑名称',
      dataIndex: 'name',
    },
  ];

  const rowClassName = (record: AlbumVo) => {
    if (record.resourceId) {
      return 'selectRow';
    }
    return '';
  };

  const onRow: (data: AlbumVo) => React.HTMLAttributes<any> = (data: AlbumVo) => ({
    onClick: () => {
      onSelect(data);
    },
  });

  const onPageChange = (page: number) => {
    setCurrent(page);
    dispatch({
      type: 'selectModal/albumSelectModal/queryAlbumList',
      payload: {
        params: {
          current: page,
          pageSize: 10,
          queryWithResource,
          resourceId,
        },
      },
    });
  };

  const onSearch = (value: string) => {
    dispatch({
      type: 'selectModal/albumSelectModal/queryAlbumList',
      payload: {
        params: {
          current: current,
          pageSize: 10,
          queryWithResource,
          albumName: value,
          resourceId,
        },
      },
    });
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={onCancel}
      title={title ?? `为【${resourceName}】选择专辑`}
    >
      <Input.Search onSearch={onSearch} />
      <Table
        rowClassName={rowClassName}
        size="small"
        rowKey="id"
        columns={columns}
        dataSource={albumList}
        pagination={{
          current: current,
          showTotal: (total) => `总计:${total}`,
          total: total,
          onChange: onPageChange,
          pageSize: 10,
        }}
        onRow={onRow}
      />
    </Modal>
  );
};

export default connect(({ 'selectModal/albumSelectModal': { albumList, total } }: ModelType) => ({
  albumList,
  total,
}))(AlbumSelectModal);
