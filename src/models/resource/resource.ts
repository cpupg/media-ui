import {
  addResource,
  addTag,
  batchDelete,
  deleteResource,
  deleteTag,
  fetchResourceList,
  queryAlbumList,
  queryTags,
  setAlbum,
  unsetAlbum,
} from '@/services/resource/resource';
import type { ResponseData } from '@/types/response/response';
import { TableResponse } from '@/types/response/table';
import { parseResponse, parseTableResponse } from '@/utils/utils';
import { message } from 'antd';
import type { Effect, Reducer } from 'umi';
import type TagReferenceVo from '../../types/entity';
import type { AlbumResourceVo, AlbumVo, ResourceVo } from '../../types/entity';

export interface ResourceStateType {
  resourceList: ResourceVo[];
  /**
   * 指定资源拥有的标签。
   */
  tagList: TagReferenceVo[];
  /**
   * 资源关联的专辑。
   */
  albumTableResponse: TableResponse<AlbumVo>;
}

export interface ResourceModelType {
  namespace: 'resource';
  state: {
    resourceList: ResourceVo[];
    tagList: TagReferenceVo[];
    albumTableResponse: TableResponse<AlbumVo>;
  };
  effects: {
    fetchResourceList: Effect;
    addResource: Effect;
    deleteResource: Effect;
    deleteTag: Effect;
    addTag: Effect;
    fetchTagList: Effect;
    setAlbum: Effect;
    unsetAlbum: Effect;
    queryAlbumList: Effect;
    batchDelete: Effect;
  };
  reducers: {
    setResourceList: Reducer;
    setTagList: Reducer;
    setAlbumList: Reducer;
  };
}

const ResourceMode: ResourceModelType = {
  namespace: 'resource',
  state: {
    resourceList: [],
    tagList: [],
    albumTableResponse: {
      data: [],
      total: 0,
      message: '',
      success: true,
    },
  },
  effects: {
    *fetchResourceList(_, { call, put }) {
      const data: ResponseData<any> = yield call(fetchResourceList);
      yield put({
        type: 'resource/setResourceList',
        payload: data,
      });
    },
    *addResource({ payload }, { call }) {
      const data: ResponseData<any> = yield call(addResource, payload);
      if (parseResponse(data)) {
        message.success('添加成功, 请刷新页面后查看');
      }
    },
    *deleteResource({ payload }, { call }) {
      const data: ResponseData<any> = yield call(deleteResource, payload);
      if (parseResponse(data)) {
        message.success('删除成功');
      }
    },
    *fetchTagList({ payload }, { call, put }) {
      const data: ResponseData<any> = yield call(queryTags, payload);
      if (parseResponse(data)) {
        yield put({
          type: 'setTagList',
          payload: data.data,
        });
      }
    },
    *deleteTag({ payload }, { call }) {
      const data: ResponseData<any> = yield call(deleteTag, payload);
      if (parseResponse(data)) {
        message.success('删除成功');
      }
    },
    *addTag({ payload }, { call, put }) {
      const data: ResponseData<any> = yield call(addTag, payload);
      parseResponse(data);
      yield put({
        type: 'fetchTagList',
        payload: {
          ...payload,
        },
      });
    },
    *setAlbum({ payload }, { put, call }) {
      const data: ResponseData<AlbumResourceVo> = yield call(setAlbum, payload);
      if (parseResponse(data)) {
        message.success(data.message);
        yield put({
          type: 'queryAlbumList',
          payload: {
            params: {
              resourceId: payload.resourceId,
            },
          },
        });
      }
    },
    *unsetAlbum({ payload }, { call, put }) {
      const data: ResponseData<AlbumResourceVo> = yield call(unsetAlbum, payload);
      if (parseResponse(data)) {
        message.success(data.message);
        yield put({
          type: 'resource/queryAlbumList',
          payload: {
            params: {
              resourceId: payload.resourceId,
              albumId: payload?.albumId,
            },
          },
        });
      }
    },
    *queryAlbumList({ payload }, { put, call }) {
      const data: TableResponse<AlbumVo> = yield call(queryAlbumList, payload);
      if (parseTableResponse(data)) {
        yield put({
          type: 'setAlbumList',
          payload: data,
        });
      }
    },
    *batchDelete({ payload }, { put, call }) {
      const data: ResponseData<any> = yield call(batchDelete, payload);
      parseResponse(data);
    },
  },
  reducers: {
    setResourceList(state, { payload }) {
      return {
        ...state,
        resourceList: payload,
      };
    },
    setTagList(state, { payload }) {
      return {
        ...state,
        tagList: payload,
      };
    },
    setAlbumList(state, { payload }) {
      return {
        ...state,
        albumTableResponse: payload,
      };
    },
  },
};

export default ResourceMode;
