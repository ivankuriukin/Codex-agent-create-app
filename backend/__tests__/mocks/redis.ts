const store = new Map<string, string>();

const redisClient = {
  isOpen: true,
  on: jest.fn(),
  connect: jest.fn(async () => undefined),
  quit: jest.fn(async () => undefined),
  set: jest.fn(async (key: string, value: string) => {
    store.set(key, value);
    return "OK";
  }),
  get: jest.fn(async (key: string) => store.get(key) ?? null),
  del: jest.fn(async (key: string) => {
    const existed = store.delete(key);
    return existed ? 1 : 0;
  }),
};

export function resetRedisMock() {
  store.clear();
  redisClient.set.mockClear();
  redisClient.get.mockClear();
  redisClient.del.mockClear();
}

export async function connectRedis() {
  await redisClient.connect();
}

export async function disconnectRedis() {
  await redisClient.quit();
}

export { redisClient };
