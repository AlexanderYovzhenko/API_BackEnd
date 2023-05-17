export const mockLanguageRepository = {
  findOrCreate: jest
    .fn()
    .mockResolvedValue(
      Promise.resolve([
        { language_id: '2982ecf2-8fae-471c-8ddf-2e3cbdab360e' },
      ]),
    ),
};
