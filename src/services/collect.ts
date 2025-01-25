import { CollectVo, ResourceCollectVo } from '@/types/entity';
import { TableRequest } from '@/types/request/table';
import request from '@/utils/request';

export async function addCollect(data: ResourceCollectVo) {
  return request('/api/collect/addCollect', {
    method: 'POST',
    data: data,
  });
}

export async function cancelCollect(data: ResourceCollectVo) {
  return request('/api/collect/cancelCollect', {
    method: 'POST',
    data: data,
  });
}

export async function create(data: CollectVo) {
  return request('/api/collect/create', {
    method: 'POST',
    data: data,
  });
}

export async function deleteCollect(data: CollectVo) {
  return request('/api/collect/delete', {
    method: 'POST',
    data: data,
  });
}

export async function queryCollect(data: TableRequest<any, CollectVo, any>) {
  return request('/api/collect/queryCollect', {
    method: 'POST',
    data: data,
  });
}

export async function queryResourceCollect(data: TableRequest<any, ResourceCollectVo, any>) {
  return request('/api/collect/queryResourceCollect', {
    method: 'POST',
    data: data,
  });
}

export async function update(data: CollectVo) {
  return request('/api/collect/update', {
    method: 'POST',
    data: data,
  });
}
