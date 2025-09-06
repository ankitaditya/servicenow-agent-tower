import axios, { AxiosInstance } from "axios";
import { config } from "../config";

export class ServiceNowClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `https://${config.servicNow.instance}.service-now.com/api/now`,
      auth: {
        username: config.servicNow.username,
        password: config.servicNow.password,
      },
      headers: { "Content-Type": "application/json" },
    });
  }

  async createIncident(data: any) {
    const resp = await this.client.post("/incident", data);
    return resp.data.result;
  }

  async updateIncident(id: string, data: any) {
    const resp = await this.client.patch(`/incident/${id}`, data);
    return resp.data.result;
  }

  async getIncident(id: string) {
    const resp = await this.client.get(`/incident/${id}`);
    return resp.data.result;
  }
}