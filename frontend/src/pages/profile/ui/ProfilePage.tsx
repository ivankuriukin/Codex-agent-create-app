import {
  Button,
  Card,
  Flex,
  Typography,
  Form,
  Input,
  Upload,
  Avatar,
  Row,
  Col,
  DatePicker,
  Image,
  Tooltip,
} from "antd";
import { useAuthStore } from "@entities/auth";
import { CheckOutlined, DeleteOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import { apiBaseUrl } from "@config/env";
import { useEffect, useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { useProfileStyles } from "@pages/profile/profile.styles";
import { TelegramLoginButton } from "@shared/ui/TelegramLoginButton";
import { useProfileStore } from "@pages/profile/model/useProfileStore";
import { useNavigate, useRouterState } from "@tanstack/react-router";

export function ProfilePage() {
  const authStore = useAuthStore();
  const profileStore = useProfileStore();
  const navigate = useNavigate();
  const location = useRouterState({ select: (state) => state.location });
  const [form] = Form.useForm();
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success">("idle");
  const { styles } = useProfileStyles();
  const searchValue =
    typeof location.search === "string"
      ? location.search
      : new URLSearchParams(location.search as Record<string, string>).toString();
  const redirectPath = `${location.pathname}${searchValue ? `?${searchValue}` : ""}`;

  const birthDateValue = useMemo(() => {
    if (!authStore.user?.birthDate) return null;
    const parsed = dayjs(authStore.user.birthDate);
    return parsed.isValid() ? parsed : null;
  }, [authStore.user?.birthDate]);

  useEffect(() => {
    if (!authStore.user) return;
    const { firstName, lastName, middleName, description } = authStore.user;
    form.setFieldsValue({
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      middleName: middleName ?? "",
      description: description ?? "",
      birthDate: birthDateValue,
    });
    setIsDirty(false);
  }, [authStore.user, birthDateValue, form]);

  if (!authStore.user) {
    return null;
  }

  const { email, name } = authStore.user;
  const { firstName, lastName, middleName, photoUrl } = authStore.user;
  const displayName = [lastName, firstName, middleName].filter(Boolean).join(" ").trim();
  const avatarSrc = photoUrl ? `${apiBaseUrl}${photoUrl}` : undefined;

  const handlePhotoUpload = async (file?: File) => {
    if (!file) return;
    await profileStore.uploadPhoto(file);
  };

  const handleDeletePhoto = async () => {
    await profileStore.deletePhoto();
  };

  const handleSave = async (values: {
    firstName: string;
    lastName: string;
    middleName?: string;
    description?: string;
    birthDate?: Dayjs | null;
  }) => {
    await profileStore.saveProfile({
      firstName: values.firstName,
      lastName: values.lastName,
      middleName: values.middleName,
      description: values.description,
      birthDate: values.birthDate ? values.birthDate.toISOString() : null,
    });
    setIsDirty(false);
    setSaveStatus("success");
    setTimeout(() => setSaveStatus("idle"), 300);
  };

  return (
    <div className={styles.page}>
      <Row gutter={[24, 24]} className={styles.layoutRow}>
        <Col xs={24} lg={8}>
          <Card className={styles.photoCard} title="Profile photo">
            <div className={styles.photoBox}>
              {avatarSrc ? (
                <Image className={styles.photoImage} src={avatarSrc} preview={false} />
              ) : (
                <div className={styles.photoPlaceholder}>
                  <Avatar size={64} icon={<UserOutlined />} />
                  <Typography.Text type="secondary">No photo</Typography.Text>
                </div>
              )}
              <div className={`${styles.photoOverlay} profile-photo-overlay`}>
                <div className={styles.photoActions}>
                  <Upload
                    showUploadList={false}
                    accept="image/*"
                    beforeUpload={(file) => {
                      handlePhotoUpload(file);
                      return false;
                    }}
                  >
                    <Tooltip title="Upload">
                      <Button type="primary" icon={<UploadOutlined />} />
                    </Tooltip>
                  </Upload>
                  <Tooltip title="Remove">
                    <Button
                      danger
                      type="primary"
                      icon={<DeleteOutlined />}
                      onClick={handleDeletePhoto}
                      disabled={!photoUrl}
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
            <Flex vertical gap="small">
              <Typography.Text strong>{displayName || name || "—"}</Typography.Text>
              <Typography.Text type="secondary">{email}</Typography.Text>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card className={styles.formCard}>
            <Typography.Title level={5}>Profile details</Typography.Title>
            <Form
              form={form}
              layout="vertical"
              requiredMark="optional"
              onFinish={handleSave}
              onValuesChange={() => {
                setIsDirty(form.isFieldsTouched(true));
              }}
            >
              <Form.Item label="First name" name="firstName" rules={[{ required: true }]}>
                <Input placeholder="Enter first name" />
              </Form.Item>
              <Form.Item label="Last name" name="lastName" rules={[{ required: true }]}>
                <Input placeholder="Enter last name" />
              </Form.Item>
              <Form.Item label="Patronymic" name="middleName">
                <Input placeholder="Enter patronymic" />
              </Form.Item>
              <Form.Item label="Date of birth" name="birthDate">
                <DatePicker placeholder="Select date" />
              </Form.Item>
              <Form.Item label="Description" name="description">
                <Input.TextArea rows={4} placeholder="Tell about yourself" />
              </Form.Item>
              <div className={styles.actionsRow}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!isDirty}
                  icon={saveStatus === "success" ? <CheckOutlined /> : undefined}
                >
                  {saveStatus === "success" ? "Saved" : "Save"}
                </Button>
              </div>
            </Form>
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
                navigate({ to: "/auth", search: { redirect: redirectPath } });
              }}
            >
              Logout
            </Button>
          </Flex>
        </Col>
      </Row>
    </div>
  );
}
