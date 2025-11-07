const baseUrl = "https://vera-assignment-api.vercel.app";

export class ApiService {
  constructor(private readonly baseUrl: string) {}

  async get(url: string) {
    const response = await fetch(`${this.baseUrl}${url}`);
    return response.json();
  }
}
