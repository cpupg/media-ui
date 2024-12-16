import {
  addTag,
  queryResourceList,
  queryTagList,
  queryTagReferenceList,
  removeTagFromResource,
} from '@/services/tag';
import { parseResponse, parseTableResponse } from '@/utils/utils';
import type { Effect, Reducer } from 'umi';
import type TagReferenceVo from '../types/entity';
import type { TagVo } from '../types/entity';
import type { TableResponse } from '../types/response/table';
import { deleteTag } from '@/services/resource/resource';
import { message } from 'antd';
import type { ResponseData } from '../types/response/response';
import { StatusCode } from '../types/response/enum';

export interface TagStateType {
  /**
   * tag表查到的标签。
   */
  tagList: TagVo[];
  /**
   * 评分标签。
   */
  rateTagList: TagVo[];
  /**
   * 用来标记收藏行为的标签。
   */
  favoriteTagList: TagVo[];
  /**
   * 当前资源的评分。
   */
  currentRate: TagReferenceVo | null;
  /**
   * 当前资源的收藏。
   */
  currentFavorite: TagReferenceVo | null;
}

export interface TagModelType {
  namespace: 'tag';
  state: TagStateType;
  effects: {
    /**
     * 查询标签列表，tag表。
     */
    queryTagList: Effect;
    /**
     * 查询用来打分的标签列表，tag表里name=0-10。
     */
    queryRateTagList: Effect;
    /**
     * 查询用来收藏的标签，tag表里name=收藏。
     */
    queryFavoriteTag: Effect;
    /**
     * 查询当前资源评分，tag_reference表resource_id=当前资源和name=0-10
     */
    queryCurrentRate: Effect;
    /**
     * 添加评分。
     */
    addRate: Effect;
    /**
     * 添加收藏。
     */
    toggleFavorite: Effect;
    /**
     * 查询当前资源是否被收藏，tag_reference表resource_id=当前资源且name=收藏。
     */
    queryCurrentFavorite: Effect;
    /**
     * 根据资源标识查询资源的标签.
     */
    queryResourceList: Effect;
    /**
     * 删除资源拥有的标签。
     */
    removeTagFromResource: Effect;
  };
  reducers: {
    setTagList: Reducer<TagStateType>;
    setRateTagList: Reducer<TagStateType>;
    setFavoriteTagList: Reducer<TagStateType>;
    setCurrentRate: Reducer<TagReferenceVo>;
    setCurrentFavorite: Reducer<TagReferenceVo>;
  };
}

const model: TagModelType = {
  namespace: 'tag',
  state: {
    favoriteTagList: [],
    tagList: [],
    rateTagList: [],
    currentRate: null,
    currentFavorite: null,
  },
  effects: {
    *queryTagList({ payload }, { call, put }) {
      const data: TableResponse<TagVo> = yield call(queryTagList, payload);
      if (parseTableResponse(data)) {
        yield put({
          type: 'setTagList',
          payload: data.data,
        });
      }
    },
    *queryRateTagList({ payload }, { call, put }) {
      const data: TableResponse<TagVo> = yield call(queryTagList, payload);
      if (parseTableResponse(data)) {
        yield put({
          type: 'setRateTagList',
          payload: data.data,
        });
      }
    },
    *queryFavoriteTag({ payload }, { call, put }) {
      const data: TableResponse<TagVo> = yield call(queryTagList, payload);
      if (parseTableResponse(data)) {
        yield put({
          type: 'setFavoriteTagList',
          payload: data.data,
        });
      }
    },
    *queryCurrentRate({ payload }, { call, put }) {
      const data: TableResponse<TagReferenceVo> = yield call(queryTagReferenceList, payload);
      if (parseTableResponse(data)) {
        yield put({
          type: 'setCurrentRate',
          payload: data.data[0],
        });
      }
    },
    *addRate({ payload }, { call, put }) {
      const data: TableResponse<TagReferenceVo> = yield call(addTag, payload);
      if (parseResponse(data)) {
        yield put({
          type: 'resource/fetchTagList',
          payload: {
            resourceId: payload.resourceId,
          },
        });
        yield put({
          type: 'setCurrentRate',
          payload: data.data,
        });
      }
    },
    *toggleFavorite({ payload }, { call, put }) {
      if (payload.tagReferenceId) {
        const data = yield call(deleteTag, {
          resourceId: payload.resourceId,
          referenceId: payload.tagReferenceId,
        });
        if (data.statusCode != StatusCode.success) {
          message.error('取消收藏失败');
        }
      } else {
        const data: ResponseData<TagReferenceVo> = yield call(addTag, payload);
        if (data.statusCode !== StatusCode.success) {
          message.error('收藏失败');
        }
      }
      yield put({
        type: 'resource/fetchTagList',
        payload: {
          resourceId: payload.resourceId,
        },
      });
      yield put({
        type: 'queryCurrentFavorite',
        payload: {
          params: {
            resourceId: payload.resourceId,
            favorite: true,
            pageSize: 10,
            current: 1,
          },
        },
      });
    },
    *queryCurrentFavorite({ payload }, { call, put }) {
      const data: TableResponse<TagReferenceVo> = yield call(queryTagReferenceList, payload);
      if (parseTableResponse(data)) {
        yield put({
          type: 'setCurrentFavorite',
          payload: data.data.length === 1 ? data.data[0] : null,
        });
      }
    },
    *queryResourceList({ payload }, { call, put }) {
      const data: ResponseData<TagReferenceVo> = yield call(queryResourceList, payload);
      if (parseResponse(data)) {
        yield put({
          type: 'setTagList',
          payload: data.data,
        });
      }
    },
    *removeTagFromResource({ payload }, { call, put }) {
      const data: ResponseData<TagReferenceVo> = yield call(removeTagFromResource, payload);
      if (parseResponse(data)) {
        message.success('删除成功');
      }
    },
  },
  reducers: {
    setTagList(state, { payload }) {
      return {
        ...state,
        tagList: payload,
      };
    },
    setRateTagList(state: TagStateType, { payload }) {
      return {
        ...state,
        rateTagList: payload,
      };
    },
    setFavoriteTagList(state: TagStateType, { payload }) {
      return {
        ...state,
        favoriteTagList: payload,
      };
    },
    setCurrentRate(state, { payload }) {
      return {
        ...state,
        currentRate: payload,
      };
    },
    setCurrentFavorite(state, { payload }) {
      return {
        ...state,
        currentFavorite: payload,
      };
    },
  },
};

export default model;
