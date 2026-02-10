import { CheckOutlined } from '@ant-design/icons';
import type { AuthUser } from '@entities/auth';
import { useProfileStore } from '@pages/profile/model/useProfileStore';
import { useProfileStyles } from '@pages/profile/profile.styles';
import { Button, Card, DatePicker, Form, Input, Typography } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

type ProfileDetailsFormProps = {
  user: AuthUser;
};

export function ProfileDetailsForm({ user }: ProfileDetailsFormProps) {
  const profileStore = useProfileStore();
  const [form] = Form.useForm();
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');
  const { styles } = useProfileStyles();

  const birthDateValue = useMemo(() => {
    if (!user.birthDate) return null;
    const parsed = dayjs(user.birthDate);
    return parsed.isValid() ? parsed : null;
  }, [user.birthDate]);

  useEffect(() => {
    const { firstName, lastName, middleName, description } = user;
    form.setFieldsValue({
      firstName: firstName ?? '',
      lastName: lastName ?? '',
      middleName: middleName ?? '',
      description: description ?? '',
      birthDate: birthDateValue,
    });
    setIsDirty(false);
  }, [user, birthDateValue, form]);

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
    setSaveStatus('success');
    setTimeout(() => setSaveStatus('idle'), 300);
  };

  return (
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
        <Form.Item
          label="First name"
          name="firstName"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>
        <Form.Item
          label="Last name"
          name="lastName"
          rules={[{ required: true }]}
        >
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
            icon={saveStatus === 'success' ? <CheckOutlined /> : undefined}
          >
            {saveStatus === 'success' ? 'Saved' : 'Save'}
          </Button>
        </div>
      </Form>
    </Card>
  );
}
