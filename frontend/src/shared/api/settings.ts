import { apiBaseUrl } from '@shared/config/env';

export type ThemeMode = 'light' | 'dark';

export type UserSettings = {
  theme: ThemeMode;
};

export async function fetchUserSettings(): Promise<UserSettings | null> {
  const response = await fetch(`${apiBaseUrl}/settings`, {
    credentials: 'include',
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to load user settings.');
  }

  const data = (await response.json()) as { settings?: { theme?: ThemeMode } };
  return { theme: data.settings?.theme ?? 'light' };
}

export async function updateUserSettings(
  payload: UserSettings,
): Promise<UserSettings> {
  const response = await fetch(`${apiBaseUrl}/settings`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 401) {
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    throw new Error('Failed to update user settings.');
  }

  const data = (await response.json()) as { settings?: { theme?: ThemeMode } };
  return { theme: data.settings?.theme ?? payload.theme };
}
