import RateFc from '@/components/Common/RateFc';
import { RateVo, ResourceVo } from '@/types/entity';
import { ModelType } from '@/types/model';
import { Modal } from 'antd';
import React, { useState } from 'react';
import { connect, useDispatch } from 'umi';

interface PropsType {
  resource: ResourceVo;
  reload: () => void;
  rate: RateVo;
}

/**
 * 评分单元格。
 */
const RateModal: React.FC<PropsType> = (props) => {
  const { resource, reload, rate } = props;
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();

  const onChange = () => {
    setVisible(false);
    reload();
  };

  const close = () => {
    setVisible(false);
  };

  const onClick = () => {
    dispatch({
      type: 'rate/getRate',
      payload: {
        resourceId: resource.id,
      },
    });
    setVisible(true);
  };

  // todo 使用缓存优化
  const getRate = () => {
    // 单元格默认使用span，这样会导致只有点击评分数字才会触发onClick，点击单元格内其他地方不会触发onClick，需要替换为div，
    // 这样整个单元格都可以点击
    if (resource.rate) {
      return <div>{resource.rate}</div>;
    } else {
      // 使用空白，让没有评分的单元格可以点击，使用横线用来标识可以点击的区域
      return <div>-&nbsp;</div>;
    }
  };

  return (
    <React.Fragment>
      <div onClick={onClick} key={1}>
        {getRate()}
      </div>
      <Modal visible={visible} key={2} title="评分" onOk={close} onCancel={close} footer={null}>
        <RateFc
          resourceId={resource.id}
          value={rate ? rate.rate : resource.rate}
          valueChange={onChange}
        />
      </Modal>
    </React.Fragment>
  );
};

export default connect(({ rate: { rate } }: ModelType) => ({
  rate: rate,
}))(RateModal);
