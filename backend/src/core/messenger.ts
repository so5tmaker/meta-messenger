({
  async method({ arg }: { arg: string }) {
    console.log({ method: 'messenger.method', arg });
    return { status: 'ok' };
  },
});
