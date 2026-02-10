import {
  DatabaseOutlined,
  RocketOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Card, Col, Flex, List, Row, Tag, Typography } from 'antd';

const stats = [
  { label: 'Active sessions', value: '1,248', icon: <RocketOutlined /> },
  { label: 'Latency', value: '84 ms', icon: <ThunderboltOutlined /> },
  { label: 'Compute', value: '62%', icon: <DatabaseOutlined /> },
];

export function HomePage() {
  return (
    <Flex vertical gap="large">
      <Card title="Добро пожаловать в панель управления">
        <Typography.Paragraph type="secondary">
          Собрано на Ant Design с тёмной темой и встроенной системой
          компонентов.
        </Typography.Paragraph>
        <Tag color="blue">Status: Live</Tag>
      </Card>

      <Row gutter={[16, 16]}>
        {stats.map((item) => (
          <Col key={item.label} xs={24} md={8}>
            <Card title={item.label} extra={item.icon}>
              <Typography.Title level={2}>{item.value}</Typography.Title>
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Последние события">
        <List
          dataSource={[
            'Обновление маршрутов: /auth и /',
            'Добавлен layout на Ant Design Layout',
            'Стилизация под темную тему Ant Design',
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item} description="just now" />
            </List.Item>
          )}
        />
      </Card>
    </Flex>
  );
}
