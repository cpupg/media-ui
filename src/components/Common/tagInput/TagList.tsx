import { Tag } from 'antd';
import React from 'react';

interface PropsType {
  /**
   * 标签列表。
   */
  valueList: string[];
  /**
   * 展示的标签数量。
   */
  maxCount?: number;
}

const TagList: React.FC<PropsType> = (props: PropsType) => {
  const { valueList, maxCount } = props;

  let vl: string[] = valueList;
  if (maxCount && maxCount > 0) {
    vl = valueList.slice(0, maxCount);
  }

  return (
    <React.Fragment>
      {vl.map((v) => (
        <Tag key={v}>{v}</Tag>
      ))}
    </React.Fragment>
  );
};

export default TagList;
