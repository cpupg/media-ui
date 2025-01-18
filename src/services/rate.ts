import request from '@/utils/request';

export async function rate(data: any) {
  return request('/api/rate/rate', {
    data: data,
    method: 'POST',
    requestType: 'form',
  });
}

export async function getRate(data: any) {
  return request('/api/rate/getRate', {
    data: data,
    method: 'POST',
    requestType: 'form',
  });
}
