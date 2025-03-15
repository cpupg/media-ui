import { Form } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import React, { useState } from 'react';
import TagInput from '.';

interface PropsType {
  /**
   * 表单名。
   */
  name: string;
  /**
   * 表单实例。
   */
  form: FormInstance<any>;
}
/**
 * 标签表单，只能用来添加新标签，无法复用已有的标签。
 * @param props 属性
 * @returns 标签表单。
 */
const TagInputForm: React.FC<PropsType> = (props) => {
  const { form, name } = props;
  const [valueList, setValueList] = useState<string[]>();

  const onEnter = (value: string) => {
    const vl: string[] = valueList || [];
    valueList?.forEach((v) => {
      if (v === value) {
        return;
      }
    });
    vl.push(value);
    setValueList(vl);
    form.setFieldsValue({
      [name]: vl,
    });
  };

  const onClose = (value: string) => {
    const arr: string[] = valueList || [];
    const arr2: string[] = arr.filter((a) => a !== value);
    setValueList(arr2);
    form.setFieldsValue({
      [name]: arr2,
    });
  };

  return (
    <Form.Item name={name}>
      <TagInput valueList={valueList} onEnter={onEnter} onClose={onClose} close />
    </Form.Item>
  );
};

export default TagInputForm;
