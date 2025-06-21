import { failure } from "../../helpers";

export function checkFields(fields: {
  domain: string;
  home: string;
  info?: string;
  owner: string;
}): Api.Error | false {
  // 检查域名格式
  if (!/^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,63})+$/.test(fields.domain)) {
    return failure("域名格式不正确", { reason: "DOMAIN_INVALID" });
  }
  // 检查主页地址是否超过 255 字符
  if (fields.home.length > 255) {
    return failure("主页地址过长", { reason: "HOME_INVALID" });
  }
  // 检查主页地址是否是链接
  if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(fields.home)) {
    return failure("主页格式不正确，请确保它是合格的 URL", { reason: "HOME_INVALID" });
  }
  // 检查主页地址中是否包含域名
  if (!fields.home.includes(fields.domain)) {
    return failure("主页和域名不匹配，您不能使用非备案域名的地址", { reason: "HOME_INVALID" });
  }
  // 检查信息是否超过 15 个字符
  if (fields.info && fields.info.length > 15) {
    return failure("介绍信息过长，最多 15 个字符", { reason: "INFO_INVALID" });
  }
  // 检查所有者是否超过 15 个字符
  if (fields.owner.length > 15) {
    return failure("所有者名称过长，最多 15 个字符", { reason: "OWNER_INVALID" });
  }

  return false;
}
