import {
  addCollect,
  cancelCollect,
  create,
  deleteCollect,
  queryCollect,
  queryResourceCollect,
  update,
} from '@/services/collect';
import { CollectVo, ResourceCollectVo } from '@/types/entity';
import { ResponseData } from '@/types/response/response';
import { TableResponse } from '@/types/response/table';
import { parseResponse, parseTableResponse } from '@/utils/utils';
import { Effect, Reducer } from 'umi';

export interface CollectModelStateType {
  collectList: TableResponse<CollectVo>;
  resourceCollectList: TableResponse<ResourceCollectVo>;
}

interface CollectModelType {
  namespace: 'collect';
  state: CollectModelStateType;
  effects: {
    addCollect: Effect;
    cancelCollect: Effect;
    create: Effect;
    deleteCollect: Effect;
    queryCollect: Effect;
    queryResourceCollect: Effect;
    update: Effect;
  };
  reducers: {
    setCollectList: Reducer<CollectModelStateType>;
    setResourceCollect: Reducer<CollectModelStateType>;
  };
}

const CollectModel: CollectModelType = {
  namespace: 'collect',
  state: {
    collectList : {},
    resourceCollectList : {},
  },
  effects: {
    *addCollect({ payload }, { call, put }) {
      const response: ResponseData<ResourceCollectVo> = yield call(addCollect, payload);
      parseResponse(response);
    },
    *cancelCollect({ payload }, { call, put }) {
      const response: ResponseData<ResourceCollectVo> = yield call(cancelCollect, payload);
      parseResponse(response);
    },
    *create({ payload }, { call, put }) {
      const response: ResponseData<CollectVo> = yield call(create, payload);
      if (parseResponse(response)) {
        yield put({
          type: 'setCollectList',
          payload: response.data,
        });
      }
    },
    *deleteCollect({ payload }, { call, put }) {
      const response: ResponseData<CollectVo> = yield call(deleteCollect, payload);
      parseResponse(response);
    },
    *queryCollect({ payload }, { call, put }) {
      const response: TableResponse<CollectVo> = yield call(queryCollect, payload);
      if (parseTableResponse(response)) {
        yield put({
          type: 'setCollectList',
          payload: response,
        });
      }
    },
    *queryResourceCollect({ payload }, { call, put }) {
      const response: TableResponse<CollectVo> = yield call(queryResourceCollect, payload);
      if (parseTableResponse(response)) {
        yield put({
          type: 'setResourceCollect',
          payload: response,
        });
      }
    },
    *update({ payload }, { call, put }) {
      const response: ResponseData<CollectVo> = yield call(update, payload);
      parseResponse(response);
    },
  },
  reducers: {
    setCollectList(state, { payload }) {
      return {
        ...state,
        collectList : payload,
      };
    },
    setResourceCollect(state, { payload }) {
      return {
        ...state,
        resourceCollectList : payload,
      };
    },
  },
};

export default CollectModel;
