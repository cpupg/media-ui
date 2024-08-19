import { TagVo, AlbumVo } from '../entity';
import { TablePagination } from './table';

export interface ResourceParam extends TablePagination{
  /**
  * 文件名。
  */
  filename?: string

  /**
  * 文件目录。
  */
  dir?: string

  /**
  * 作者名。
  */
  authorName?: string

  /**
  * 作者唯一标识。
  */
  authorId?: string

  /**
  * 和资源关联的专辑，只在selectModal中使用。
  */
  albumId?: string

  /**
  * 标签名称。
  */
  tagNames?: string[]

  /**
  * 是否只查询资源表，默认否。
  *
  * <p>设置为true可以不进行1+n查询，用来在只需要资源表的场景中避免查询和资源表关联的其他
  * 表。</p>
  */
  resourceOnly?: boolean
}


/**
 * 资源数据。
 */
export interface ResourceData {

  /**
   * 资源标识。
   */
  id?: string;

  /**
   * 文件名。
   */
  filename?: string;

  /**
   * 资源目录。
   */
  dir?: string;

  /**
   * 目录代码。
   */
  dirCode?: number;

  /**
   * 作者id。
   */
  authorId?: string;

  /**
   * 封面文件id。
   */
  coverId?: string;

  /**
   * 批量更新条件。
   */
  condition?: any;

  /**
   * 删除的专辑。
   */
  deletedAlbums?: AlbumVo[];

  /**
   * 新增的专辑。
   */
  addedAlbums?: AlbumVo[];

  /**
   * 删除的标签。
   */
  deletedTags?: TagVo[];

  /**
   * 新增的标签。
   */
  addedTags?: TagVo[];
}
