import { Input, Tag } from 'antd';
import 'antd/dist/antd.less';
import React, { useState } from 'react';

interface PropsType {
  /**
   * 按下enter的回调。
   * @param value 当前输入的值。
   * @returns void
   */
  onEnter?: (value: string) => void;
  /**
   * 按下关闭的回调。
   * @param value 当前输入的值。
   * @returns void
   */
  onClose?: (value: string) => void;
  /**
   * 是否可以删除标签。
   */
  close?: boolean;
}

/**
 *
 * @param props 属性。
 * @returns 标签输入框。
 */
const TagInput: React.FC<PropsType> = (props) => {
  const { onEnter, onClose, close } = props;

  const [tagList, setTagList] = useState<string[]>([]);
  const [current, setCurrent] = useState('');

  const handleEnter = (value: string) => {
    const tl: string[] = tagList;
    if (tl.includes(value)) {
      return;
    }
    tl.push(value);
    setTagList(tl);
    setCurrent('');
    if (onEnter) {
      onEnter(value);
    }
  };

  const handleClose = (value: string) => {
    const ttl = tagList.filter((t) => t != value);
    setTagList(ttl);
    if (onClose) {
      onClose(value);
    }
  };

  return (
    // 设置最小高度，否则没有标签时div没有高度。
    // todo 使用span展示输入内容，隐藏input，鼠标点击div时聚焦
    <div className="ant-input" style={{ minHeight: 0 }}>
      {tagList.map((v) => (
        <Tag onClose={(e) => handleClose(v)} closable={close} key={v}>
          {v}
        </Tag>
      ))}
      <Input
        onPressEnter={(e) => handleEnter(current)}
        bordered={false}
        // style={{ width: 50 }}
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
      />
      {/* <span>{current}</span> */}
    </div>
  );
};

export default TagInput;
