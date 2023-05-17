import { countryStub } from '../stubs/country.stub';

export const mockCountryRepository = {
  findOrCreate: jest
    .fn()
    .mockResolvedValue(
      Promise.resolve([{ country_id: countryStub().country_id }]),
    ),
  findAll: jest.fn().mockResolvedValue(Promise.resolve([countryStub()])),
};
