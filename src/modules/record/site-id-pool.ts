import log from "../../log";
import { cache } from "../../utils";
import { getRecordBy } from ".";

class SiteIdPool {
  private pool: Set<string> = new Set();
  private maxSize: number = 50; // 最大容量

  initialize(initialSize: number = this.maxSize) {
    this.generateIds(initialSize); // 初始化池子
    log.info(`Site ID pool has been created with initial size: ${this.pool.size}`);
  }

  // 取出一个 siteId
  getSiteId(): string {
    const iterator = this.pool.values();
    const result = iterator.next();

    if (result.done) {
      this.extend(); // 如果池子为空，扩容
      return this.getSiteId(); // 递归调用，直到获取到一个 siteId
    }

    const id = result.value;
    this.pool.delete(id);

    return id; // 返回取出的 siteId
  }

  getStatus(): { size: number } {
    return {
      size: this.pool.size,
    };
  }

  // 扩容，填满池子
  extend() {
    this.generateIds(this.maxSize);
    // 站点 id 池已完成扩容
    log.debug(`Site ID pool has been extended: ${this.pool.size}`);
  }

  private generateIds(count: number) {
    const maxAttempts = this.maxSize * 3; // 最大尝试次数，避免可用值不足时无限循环
    let attempts = 0;
    let generated = 0;

    while (generated < count && attempts < maxAttempts) {
      attempts++;

      // 检查是否超过最大容量
      if (this.pool.size >= this.maxSize) {
        break; // 如果池子已满，停止生成
      }

      const siteId = gen();
      // 检查 siteId 是否在池中
      if (this.pool.has(siteId)) {
        log.warn(`Site ID ${siteId} already exists in the pool, skipping...`);
        continue; // 如果已存在，跳过
      }
      // 检查 siteId 是否在外部存在
      if (checkExists(siteId)) {
        log.warn(`Site ID ${siteId} already exists in the database, skipping...`);
        continue; // 如果已存在，跳过
      }
      // 添加到池中
      this.pool.add(siteId);
      generated++;
    }
  }
}

function gen() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000).toString();
  const currentYear = new Date().getFullYear().toString();
  return currentYear + randomNumber;
}

function checkExists(siteId: string) {
  // 查找是否存在此 siteId 的 record
  if (getRecordBy({ siteId })) {
    return true; // 存在
  }

  return false; // 不存在
}

export default new SiteIdPool();
