export const mockQualityRepository = {
  findOrCreate: jest
    .fn()
    .mockResolvedValue(
      Promise.resolve([{ quality_id: '1982ecf2-8fae-471c-8ddf-2e3cbdab360e' }]),
    ),
};
