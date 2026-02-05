import {
  Avatar,
  Button,
  Card,
  Flex,
  Image,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import { DeleteOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import { apiBaseUrl } from "@config/env";
import { useProfileStore } from "@pages/profile/model/useProfileStore";
import { useProfileStyles } from "@pages/profile/profile.styles";
import type { AuthUser } from "@entities/auth";

type ProfilePhotoCardProps = {
  user: AuthUser;
};

export function ProfilePhotoCard({ user }: ProfilePhotoCardProps) {
  const profileStore = useProfileStore();
  const { styles } = useProfileStyles();

  const { email, name, firstName, lastName, middleName, photoUrl } = user;
  const displayName = [lastName, firstName, middleName].filter(Boolean).join(" ").trim();
  const avatarSrc = photoUrl ? `${apiBaseUrl}${photoUrl}` : undefined;

  const handlePhotoUpload = async (file?: File) => {
    if (!file) return;
    await profileStore.uploadPhoto(file);
  };

  const handleDeletePhoto = async () => {
    await profileStore.deletePhoto();
  };

  return (
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
  );
}
