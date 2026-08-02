import Collect from '@/components/Common/Collect';
import AuthorInput from '@/components/Common/input/AuthorInput';
import TagInputModal from '@/components/Common/tagInput/TagInputModal';
import TagList from '@/components/Common/tagInput/TagList';
import ImageUpload from '@/components/Common/upload/ImageUpload';
import { fetchResourceList } from '@/services/resource/resource';
import type { ResourceVo } from '@/types/entity';
import type { ModelType } from '@/types/model';
import { ProFormCheckbox, ProFormInstance } from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Col, Input, Modal, Popconfirm, Row, Tooltip, message } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { TableRowSelection } from 'antd/lib/table/interface';
import copy from 'copy-to-clipboard';
import React, { useRef, useState } from 'react';
import { connect, useDispatch } from 'umi';
import Album from './Album';
import BatchUpdateFormModal from './BatchUpdateFormModal';
import RateModal from './RateModal';
import ResourceFormModal from './ResourceFormModal';
interface ResourceProps {
  resourceList: ResourceVo[];
}

const Resource: React.FC<ResourceProps> = () => {
  const dispatch = useDispatch();
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [resourceId, setResourceId] = useState('');
  const [currentResource, setCurrentResource] = useState<ResourceVo>();
  const [albumVisible, setAlbumVisible] = useState(false);
  // 修改弹窗，使用的是添加弹窗，只是多了id字段。
  const [modifyVisible, setModifyVisible] = useState(false);
  // 要修改的资源
  const [resToModify, setResToModify] = useState<ResourceVo>();
  const [showPreview, setShowPreview] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>();
  const [showCollect, setShowCollect] = useState(false);
  const [dir, setDir] = useState<string>();

  const reload = () => {
    actionRef.current?.reload();
  };

  const deleteResource = (id: string) => {
    dispatch({
      type: 'resource/deleteResource',
      payload: id,
    });
    reload();
  };

  const onTagClick = (entity: ResourceVo) => {
    setResourceId(entity.id);
    setCurrentResource(entity);
    setTagModalVisible(true);
  };

  const closeTagModal = () => {
    setTagModalVisible(false);
    actionRef.current?.reload();
  };

  const renderTag = (_dom: any, entity: ResourceVo) => {
    // todo 1+n查询方案优化
    return (
      <Tooltip title={<TagList valueList={entity.tags} />}>
        <div>
          <TagList valueList={entity.tags} maxCount={entity.tagCount} />
        </div>
      </Tooltip>
    );
  };

  const copyAbsolutePath = (data: ResourceVo) => {
    const path = data.dir + data.filename;
    const success = copy(path.replaceAll('/', '\\'));
    if (success) {
      message.success('全路径复制成功');
    } else {
      // 显示失败消息影响用户体验
      console.log('全路径复制失败');
    }
  };

  const renderRowNumber = (dom: React.ReactNode, entity: object, index: number) => {
    return index + 1;
  };

  const onDirChange = (e: React.ChangeEvent<HTMLInputElement>, form: FormInstance) => {
    setDir(e.target.value);
    form.setFieldsValue({
      dir: e.target.value,
    });
  };

  const onAccurateDirChange = (e, form) => {
    form.setFieldsValue({
      dir,
    });
  };

  const renderFormItem = (schema: ProColumns, config: any, form: FormInstance) => {
    // 资源搜索框是两个input，共用一个onchange，因此使用state控制目录输入框，多选框由antd控制。
    return (
      <Row>
        <Col span={20}>
          <Input value={dir} onChange={(e) => onDirChange(e, form)} />
        </Col>
        <Col span={4}>
          <ProFormCheckbox
            label="精确查询"
            name="accurateDir"
            fieldProps={{
              defaultChecked: true,
              onChange: (e) => onAccurateDirChange(e, form),
            }}
          />
        </Col>
      </Row>
    );
  };

  const columns: ProColumns<ResourceVo>[] = [
    {
      title: '序号',
      render: renderRowNumber,
      width: 50,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '文件名',
      dataIndex: 'filename',
      // width: 200,
      ellipsis: true,
      copyable: true,
      sorter: {
        multiple: 4,
      },
    },
    {
      title: '资源目录',
      // width: '30%',
      dataIndex: 'dir',
      ellipsis: true,
      copyable: true,
      sorter: { multiple: 3 },
      renderFormItem,
    },
    {
      title: '作者',
      dataIndex: ['authorVo', 'username'],
      ellipsis: true,
      copyable: true,
      renderFormItem: (_item, _c, form) => {
        // 使用authorName和authorId，增加可读性，同时防止和resource的id混淆。
        // 返回时username是嵌套属性，查询时不是嵌套属性
        return <AuthorInput form={form} labelName="authorName" valueName="authorId" />;
      },
      width: 100,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 330,
      ellipsis: true,
      onCell: (data) => ({
        onClick: () => onTagClick(data),
      }),
      render: renderTag,
    },
    {
      title: '评分',
      dataIndex: 'rate',
      hideInSearch: true,
      hideInForm: true,
      width: 50,
      align: 'center',
      render: (_, data) => {
        return <RateModal reload={reload} resource={data} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 150,
      sorter: { multiple: 2 },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 150,
      sorter: { multiple: 1 },
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 300,
      render: (_, entity: ResourceVo) => {
        return (
          <>
            <Popconfirm
              title="确认删除"
              okButtonProps={{ danger: true, type: 'primary' }}
              onConfirm={() => deleteResource(entity.id)}
            >
              <Button size="small" type="primary" danger>
                删除
              </Button>
            </Popconfirm>
            <Button
              size="small"
              onClick={() => {
                setModifyVisible(true);
                setResToModify(entity);
              }}
            >
              修改
            </Button>
            <Button size="small" onClick={() => copyAbsolutePath(entity)}>
              复制
            </Button>
            <Button
              size="small"
              onClick={() => {
                setResourceId(entity.id);
                setAlbumVisible(true);
                setCurrentResource(entity);
              }}
            >
              专辑
            </Button>
            <Button
              size="small"
              onClick={() => {
                setResourceId(entity.id);
                setCurrentResource(entity);
                setShowPreview(true);
              }}
            >
              预览
            </Button>
            <Button
              size="small"
              onClick={() => {
                setResourceId(entity.id);
                setCurrentResource(entity);
                setShowCollect(true);
              }}
            >
              收藏
            </Button>
          </>
        );
      },
    },
  ];

  const closeImageUpload = () => {
    setShowPreview(false);
    dispatch({
      type: 'upload/imageUpload/setFileList',
      payload: [],
    });
  };

  const batchDelete = () => {
    const params = formRef.current?.getFieldsValue();
    const idList = selectedRowKeys;
    if (checkCondition()) {
      message.warn('请输入查询条件或勾选数据');
      return;
    }
    dispatch({
      type: 'resource/batchDelete',
      payload: {
        params,
        idList,
      },
    });
    reload();
  };

  const rowSelection: TableRowSelection<ResourceVo> = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: ResourceVo[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys: selectedRowKeys,
  };

  /**
   * 检查批量操作时条件是否为空，true代表没有条件。
   * @returns true为空。
   */
  const checkCondition = (): boolean => {
    const values = formRef.current?.getFieldsValue();
    const { filename, dir, authorId, tags } = values;
    // 批量更新时必须有条件
    if (
      (selectedRowKeys && selectedRowKeys.length > 0) ||
      filename ||
      dir ||
      authorId ||
      (tags && tags.length > 1)
    ) {
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    reload();
  };

  return (
    <div>
      <ProTable<ResourceVo>
        rowKey="id"
        pagination={{ showQuickJumper: true }}
        onLoad={() => setSelectedRowKeys([])}
        rowSelection={rowSelection}
        actionRef={actionRef}
        formRef={formRef}
        defaultSize="small"
        columns={columns}
        request={async (params, sorter, filter) => {
          if (params.tags) {
            const tags: string = params.tags;
            const tagNames: string[] = [];
            const arr = tags.split(',');
            arr.forEach((a) => {
              const at = a.trim();
              if (at.length > 0) {
                tagNames.push(at);
              }
            });
            params.tagNames = tagNames;
          }
          // 资源搜索框是两个input，共用一个onchange，因此使用state控制目录输入框，多选框由antd控制。
          if (dir) {
            let td = dir.toLowerCase().replaceAll('\\', '/').replaceAll('"', '');
            if(!td.endsWith('/')) {
              td = td + '/';
            }
            params.dir = td;
          }
          return fetchResourceList({ params, sorter, filter }).then((v) => {
            if (v.success) {
              return v;
            } else {
              message.error(v.message);
            }
          });
        }}
        toolBarRender={() => [
          <ResourceFormModal key={1} reload={reload} />,
          <Popconfirm key={2} title="批量删除" onConfirm={batchDelete}>
            <Button>批量删除</Button>
          </Popconfirm>,
          <BatchUpdateFormModal
            key={3}
            onSubmit={onSubmit}
            condition={{ params: formRef.current?.getFieldsValue(), idList: selectedRowKeys }}
            isConditionEmpty={checkCondition}
          />,
        ]}
      />
      {tagModalVisible && (
        // @ts-expect-error
        <TagInputModal onOk={closeTagModal} visible={tagModalVisible} resource={currentResource} />
      )}
      {modifyVisible && (
        <ResourceFormModal
          data={resToModify}
          visible={modifyVisible}
          reload={() => {
            reload();
            setModifyVisible(false);
            setResToModify(undefined);
          }}
          onCancel={() => {
            setModifyVisible(false);
            setResToModify(undefined);
          }}
        />
      )}
      {albumVisible && (
        <Album
          resourceName={currentResource?.filename ?? ''}
          onCancel={() => setAlbumVisible(false)}
          resourceId={resourceId}
          visible={albumVisible}
        />
      )}
      {showPreview && (
        <Modal
          visible={showPreview}
          title={`资源【${currentResource?.filename}】预览`}
          onCancel={closeImageUpload}
          onOk={closeImageUpload}
        >
          <ImageUpload businessCode={resourceId} businessType={4} />
        </Modal>
      )}
      {showCollect && (
        <Collect
          visible={showCollect}
          resource={currentResource}
          onOK={() => {
            setShowCollect(false);
          }}
        />
      )}
    </div>
  );
};

export default connect(({ resource: { resourceList } }: ModelType) => ({
  resourceList,
}))(Resource);
