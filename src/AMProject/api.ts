export const mockApi = {
  login: async (email: string, password: string): Promise<{ success: boolean }> => {
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        resolve({ success: email === "mika@mail.ru" && password === "123456" });
      }, 1000);
    });
  },

  verifyCode: async (code: string): Promise<{ success: boolean }> => {
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        resolve({ success: code === "123456" });
      }, 1000);
    });
  },

  requestNewCode: async (): Promise<{ success: boolean }> => {
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  },
};

