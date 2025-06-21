import axios, { AxiosResponse } from "axios";
import camelcaseKeys from "camelcase-keys";

const BASE_URL = "/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 允许跨域请求携带 cookie
  validateStatus: () => true, // 将所有响应状态码视为有效
});

type PayloadType<T> = Promise<ApiResponse<T>>;

async function recentlyRecords(): PayloadType<ServerData.Record[]> {
  return strictify(await api.get(`/records/recently`));
}

async function getRecord(siteId: string): PayloadType<ServerData.Record> {
  return strictify(await api.get(`/records/${siteId}`));
}

async function searchRecord(keyword: string): PayloadType<ServerData.Record> {
  return strictify(await api.get(`/records/search?keyword=${keyword}`));
}

export async function getSubmitUnverifiedPrepare(): PayloadType<ServerData.RandomCode> {
  return strictify(await api.get("/submit/unverified/prepare"));
}

export async function submitUnverified(
  { siteId, email, captchaCode }: { siteId: string; email: string; captchaCode: string },
): PayloadType<ServerData.SubmittedUnverified> {
  return strictify(await api.post("/submit/unverified", { site_id: siteId, email, captcha_code: captchaCode }));
}

export async function submit(
  { name, domain, home, owner, info, captchaCode }: {
    name: string;
    domain: string;
    home: string;
    owner: string;
    info: string;
    captchaCode: string;
  },
): PayloadType<ServerData.Submitted> {
  return strictify(await api.post("/submit", { name, domain, home, owner, info, captcha_code: captchaCode }));
}

export async function getSubmitPrepare(): PayloadType<ServerData.SubmitPrepare> {
  return strictify(await api.get("/submit/prepare"));
}

async function strictify<T extends Record<string, unknown> | readonly Record<string, unknown>[]>(
  resp: AxiosResponse<T>,
) {
  return camelcaseKeys(resp.data, { deep: true });
}

export { getRecord, recentlyRecords, searchRecord };
