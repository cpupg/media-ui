import { getRate, rate } from '@/services/rate';
import { RateVo } from '@/types/entity';
import { ResponseData } from '@/types/response/response';
import { parseResponse } from '@/utils/utils';
import { Effect, Reducer } from 'umi';

export interface RateStateType {
  // 评分对象，resourceId -> RateVo
  rate: {};
}

interface RateModelType {
  namespace: 'rate';
  state: {};
  effects: {
    rate: Effect;
    getRate: Effect;
  };
  reducers: {
    setRate: Reducer;
  };
}

const RateModel: RateModelType = {
  namespace: 'rate',
  state: {},
  effects: {
    *rate({ payload }, { call, put }) {
      const data: ResponseData<RateVo> = yield call(rate, payload);
      parseResponse(data);
    },
    *getRate({ payload }, { call, put }) {
      const data: ResponseData<RateVo> = yield call(getRate, payload);
      if (parseResponse(data)) {
        yield put({
          type: 'setRate',
          payload: data.data,
        });
      }
    },
  },
  reducers: {
    setRate(_, { payload }) {
      return {
        rate: payload,
      };
    },
  },
};

export default RateModel;
