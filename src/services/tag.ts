import type { TagReferenceParam } from '@/types/request/tag';
import type { TableRequest } from '@/types/request/table';
import request from '@/utils/request';

export async function queryList(data: { name: string }) {
  return request('/api/tag/queryList', {
    method: 'POST',
    data: data,
  });
}

export async function queryTagReferenceList(data: TableRequest<any, TagReferenceParam, any>) {
  return request('/api/tag/queryTagReferenceList', {
    method: 'POST',
    data: data,
  });
}

export async function addTag(params: { resourceId: string; tagId: string }) {
  return request('/api/tag/addTag', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

export async function queryResourceList(resourceId: string) {
  return request('/api/tag/queryResourceList', {
    method: 'POST',
    data: resourceId,
    requestType: 'form',
  });
}

export async function removeTagFromResource(payload: { referenceId: string; resourceId: string }) {
  return request('/api/tag/removeTagFromResource', {
    method: 'POST',
    data: payload,
    requestType: 'form',
  });
}

export async function addTagToResource(payload: { referenceId: string; resourceId: string }) {
  return request('/api/tag/addTagToResource', {
    method: 'POST',
    data: payload,
  });
}
