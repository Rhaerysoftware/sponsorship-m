import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject('CACHE_MANAGER') private cacheManager: Cache) {}

  public set(key: string, data: any, ttl: number | undefined) {
    this.cacheManager.set(key, data, ttl);
  }

  public get(key: string) {
    return this.cacheManager.get(key);
  }
}
