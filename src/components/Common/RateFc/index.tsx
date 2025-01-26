import { RateVo } from '@/types/entity';
import { ModelType } from '@/types/model';
import { Rate } from 'antd';
import React from 'react';
import { connect, useDispatch } from 'umi';

interface PropsType {
  resourceId: string;
  rate?: RateVo;
  value?: number;
  /**
   * 评分改变时的回调。
   */
  valueChange?: () => void;
}
/**
 * 评分组件。
 * @param props 属性
 * @returns 评分组件。
 */
const RateFc: React.FC<PropsType> = (props) => {
  const { resourceId, rate, value, valueChange } = props;

  const dispatch = useDispatch();

  const onChange = (value: number) => {
    dispatch({
      type: 'rate/rate',
      payload: {
        resourceId: resourceId,
        rate: value,
      },
    });
    if (valueChange) {
      valueChange();
    }
  };

  // rate不为空说明调用过接口
  return <Rate count={10} value={rate ? rate.rate : value} onChange={(v) => onChange(v)} />;
};

export default connect(({ rate: { rate } }: ModelType) => ({
  rate: rate,
}))(RateFc);
