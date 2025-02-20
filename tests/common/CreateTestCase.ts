export class CreateTestCase {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private requestData: Record<string, any>,
    // eslint-disable-next-line no-unused-vars
    private responseData: Record<string, any>,
  ) {}

  create(key: string, status: number = 400) {
    return {
      status,
      request: this.requestData[key],
      response: this.responseData[key],
    };
  }
}
