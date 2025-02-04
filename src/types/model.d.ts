import { AlbumModelState } from '@/models/album';
import { AuthorStateType } from '@/models/author';
import { CollectModelStateType } from '@/models/collect';
import { DirectoryModelStateType } from '@/models/common/select/directory';
import { AlbumSelectModalStateType } from '@/models/common/selectorModal/albumSelectModal';
import { ResourceSelectModalStateType } from '@/models/common/selectorModal/resourceSelectModal';
import { SelectAuthorStateType } from '@/models/common/selectorModal/selectAuthor';
import { ImageUploadStateType } from '@/models/common/upload/imageUpload';
import { RateStateType } from '@/models/rate';
import { ResourceStateType } from '@/models/resource/resource';
import { SiteStateType } from '@/models/site';
import { TagStateType } from '@/models/tag';

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
  collect: CollectModelStateType;
}
