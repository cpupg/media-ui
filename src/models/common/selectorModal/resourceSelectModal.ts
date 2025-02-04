import { queryList } from '@/services/resource/resource';
import { ResourceVo } from '@/types/entity';
import { TableResponse } from '@/types/response/table';
import { parseTableResponse } from '@/utils/utils';
import { Effect, Reducer } from 'umi';

export interface ResourceSelectModalStateType {
  response?: TableResponse<ResourceVo>;
}

export interface ResourceSelectModalModelType {
  namespace: 'selectModal/resource';
  state: ResourceSelectModalStateType;
  effects: {
    queryList: Effect;
  };
  reducers: {
    setResponse: Reducer<TableResponse<ResourceVo>>;
  };
}

const model: ResourceSelectModalModelType = {
  namespace: 'selectModal/resource',
  state: {},
  effects: {
    *queryList({ payload }, { put, call }) {
      const data: TableResponse<ResourceVo> = yield call(queryList, payload);
      if (parseTableResponse(data)) {
        yield put({
          type: 'setResponse',
          payload: data,
        });
      }
    },
  },
  reducers: {
    setResponse(state: ResourceSelectModalStateType, { payload }: { payload: any }) {
      return {
        ...state,
        response: payload,
      };
    },
  },
};

export default model;
