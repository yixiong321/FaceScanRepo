// const mockAxios = {
//   create: jest.fn(() => mockAxios),
//   get: jest.fn(() => Promise.resolve({ data: {} })),
//   post: jest.fn(() => Promise.resolve({ data: {} })),
// };

const mockAxios = {
  create: jest.fn(() => mockAxios),
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() },
  },
}

export default mockAxios;