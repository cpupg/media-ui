import { ResourceSelectModalStateType } from '@/models/common/selectorModal/resourceSelectModal';
import type {
  AlbumModelState,
  AlbumSelectModalStateType,
  AuthorStateType,
  DirectoryModelStateType,
  ImageUploadStateType,
  ResourceStateType,
  SelectAuthorStateType,
  SiteStateType,
  TagStateType,
  RateStateType
} from 'umi';

/**
 * 此类型用于connect使用，避免mapStateToProps报错。
 */
export interface DefaultStateType {
  working: boolean;
}

export interface ModelType {
  'modal/selectAuthor': SelectAuthorStateType;
  'select/directory': DirectoryModelStateType;
  'selectModal/albumSelectModal': AlbumSelectModalStateType;
  'selectModal/resource': ResourceSelectModalStateType;
  'upload/imageUpload': ImageUploadStateType;
  resource: ResourceStateType;
  author: AuthorStateType;
  site: SiteStateType;
  tag: TagStateType;
  album: AlbumModelState;
  rate: RateStateType;
}
