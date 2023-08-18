({
  async signin({ login, password }: { login: string; password: string }) {
    console.log({ method: 'auth.signin', login, password });
    return { status: 'ok', token: '--no-token-provided--' };
  },

  async signout() {
    console.log({ method: 'auth.signout' });
    return { status: 'ok' };
  },

  async restore({ token }: { token: string }) {
    console.log({ method: 'auth.restore', token });
    return { status: 'ok' };
  },
});
