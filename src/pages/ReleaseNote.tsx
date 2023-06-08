import request from '@/utils/request';
import { Typography } from 'antd';
import React, { useEffect, useState } from 'react';

const { Title, Paragraph, Link } = Typography;

interface PropsType {}
const ReleaseNote: React.FC<PropsType> = () => {
  const [version, setVersion] = useState();
  const [backVersion, setBackVersion] = useState();
  const [frontVersion, setFrontVersion] = useState();

  useEffect(() => {
    request('http://localhost:9000/version/main', {
      method: 'GET',
    })
      .then((v) => setVersion(v))
      .catch((e) => {
        console.error(e);
        setVersion(undefined);
      });

    request('http://localhost:9000/version/backVersion', {
      method: 'GET',
    })
      .then((v) => setBackVersion(v))
      .catch((e) => {
        console.error(e);
        setBackVersion(undefined);
      });

    request('http://localhost:9000/version/frontVersion', {
      method: 'GET',
    })
      .then((v) => setFrontVersion(v))
      .catch((e) => {
        console.error(e);
        setFrontVersion(undefined);
      });
  }, []);

  return (
    <Typography>
      <Title level={3}>版本信息</Title>
      <Paragraph>
        <ul>
          <li>发行版本：{version}</li>
          <li>前台版本：{frontVersion}</li>
          <li>后台版本：{backVersion}</li>
        </ul>
      </Paragraph>
      <Title level={3}>发行说明</Title>
      <Paragraph>
        <ul>
          {/* 前台发行说明在开发环境不可用 */}
          {/* 两个html需要手动复制到后台的static目录。 */}
          {/* release工作流包含复制发行说明的步骤。 */}
          <li>
            <Link href="/api/releasenote-ui.html">前台发行说明</Link>
          </li>
          <li>
            <Link href="/api/releasenote.html">后台发行说明</Link>
          </li>
        </ul>
      </Paragraph>
    </Typography>
  );
};

export default ReleaseNote;
