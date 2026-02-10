import { Button, Card, Flex, Row, Col, Space, Typography } from 'antd';
import { useAuthStore } from '@entities/auth';
import { useProfileStyles } from '@pages/profile/profile.styles';
import { TelegramLoginButton } from '@shared/ui';
import { ProfilePhotoCard } from '@pages/profile/ui/ProfilePhotoCard';
import { ProfileDetailsForm } from '@pages/profile/ui/ProfileDetailsForm';
import { WizardSpriteComposer } from '@shared/ui';

export function ProfilePage() {
  const authStore = useAuthStore();
  const { styles } = useProfileStyles();

  if (!authStore.user) {
    return null;
  }

  const { user } = authStore;

  return (
    <div className={styles.page}>
      <Row gutter={[24, 24]} className={styles.layoutRow}>
        <Col xs={24} lg={8}>
          <ProfilePhotoCard user={user} />
        </Col>
        <Col xs={24} lg={16}>
          <Space size="middle" vertical>
            <ProfileDetailsForm user={user} />
            <Card title="Wizard sprite">
              <WizardSpriteComposer />
            </Card>
            <Card title="Telegram">
              <Flex vertical gap="small">
                <Typography.Text type="secondary">
                  Link your Telegram account to enable quick sign-in.
                </Typography.Text>
                <TelegramLoginButton redirectPath="/profile" />
              </Flex>
            </Card>
            <Flex justify="end">
              <Button
                danger
                onClick={async () => {
                  await authStore.logout();
                }}
              >
                Logout
              </Button>
            </Flex>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
