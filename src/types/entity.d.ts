/**
 * 占位符，用来标记实体类型。
 */
export interface E {}

export interface AuthorVo extends E {
  /**
   * ID
   */
  id: string;

  /**
   * 用户在站点注册时的id
   */
  userId?: string;

  /**
   * 用户名
   */
  username: string;

  /**
   * 注册站点
   */
  site: SiteVo;

  /**
   * 主页
   */
  homepage?: string;

  /**
   * 创建时间
   */
  createTime: Date;

  /**
   * 更新时间
   */
  updateTime?: Date;
}

export interface ResourceAlbumVo extends E {
  /**
   * ID
   */
  id: string;

  /**
   * 创建时间
   */
  createTime: Date;

  /**
   * 更新时间
   */
  updateTime: Date;

  /**
   * 资源ID
   */
  resourceVo: ResourceVo;

  /**
   * 专辑ID
   */
  albumVo: AlbumVo;
}

export interface ResourceVo extends E {
  /**
   * ID
   */
  id: string;

  /**
   * 文件名
   */
  filename: string;

  /**
   * 资源目录
   */
  dir: string;

  /**
   * 作者。
   */
  authorVo: AuthorVo;

  /**
   * 专辑。
   */
  albumVo?: AlbumVo;

  /**
   * 创建时间
   */
  createTime: Date;

  /**
   * 更新时间
   */
  updateTime: Date;
  /**
   * 标签。
   */
  tagReferenceVoList: TagReferenceVo[];
  /**
   * 标签数量。
   */
  tagCount: number;
  /**
   * 收藏状态。
   */
  favorite: boolean;
  /**
   * 评分。
   */
  rate: number;
  /**
   * 封面标识。
   */
  coverId: string;
  /**
   * 和资源关联的专辑id，只在ResourceSelectModal中使用。
   */
  albumId: string;
}

export interface ResourceTypeMapVo extends E {
  /**
   * 主键
   */
  id: string;

  /**
   * 父类型
   */
  parentResourceTypeMapVo?: ResourceTypeMapVo;

  /**
   * 名称
   */
  name: string;

  /**
   * 创建时间
   */
  createTime: Date;

  /**
   * 更新时间
   */
  updateTime: Date;
}

export interface ResourceTypeVo extends E {
  /**
   * ID
   */
  id: string;

  /**
   * 资源id
   */
  resourceVo: ResourceVo;

  /**
   * 类型id
   */
  resourceTypeMapVo: ResourceTypeMapVo;

  /**
   * 创建时间
   */
  createTime: Date;

  /**
   * 更新时间
   */
  updateTime: Date;
}

export interface SiteVo extends E {
  /**
   * ID
   */
  id: string;

  /**
   * 网站名称
   */
  siteName: string;

  /**
   * 网站地址
   */
  url: string;

  /**
   * 创建时间
   */
  createTime: Date;

  /**
   * 更细时间
   */
  updateTime: Date;
}

export interface Directory extends E {
  /**
   * 主键id。
   */
  id: string;
  /**
   * 目录代码，每个目录都有一个全局唯一的目录代码。
   */
  dirCode: string;
  /**
   * 父目录代码，从0开始。0表示根目录。根目录只能修改，不能删除。
   */
  parentCode: string;
  /**
   * 目录名
   */
  name: string;
  /**
   * 全路径对应的目录代码清单。
   *
   * <p>假如现在有一个目录e有五个层级，全路径是 /a/b/c/d/e，对应的目录吗分别是1,2,3,4,5。若
   * a是根目录，则a的目录代码是0，否则不能为0。此时，e的目录代码清单是1.2.3.4.5。若a是根目录，
   * 则目录代码清单是0.2.3.4.5</p>
   */
  codeList: string;
  /**
   * 目录层级。
   *
   * <p>目录代码清单按小数点分隔后得到的数字个数就是目录层级。</p>
   */
  level: number;
  /**
   * 子目录。
   */
  children: Directory[];
}

export interface TagVo extends E {
  /**
   * 主键
   */
  id: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 创建时间
   */
  createTime: any;
}

export default interface TagReferenceVo extends E {
  serialVersionUID?: number;

  /**
   * 主键
   */
  id: string;

  /**
   * 资源id
   */
  resourceId: string;

  /**
   * 标签id
   */
  tagVo: TagVo;

  /**
   * 引用类型1:资源
   */
  referenceType: number;

  /**
   * 引用时间。
   */
  referTime: any;
}

export interface AlbumVo {
  /**
   * 主键
   */
  id?: string;

  /**
   * 专辑名称
   */
  name?: string;

  /**
   * 删除状态
   */
  deleteStatus?: number;

  /**
   * 创建时间
   */
  createTime?: string;

  /**
   * 更新时间
   */
  updateTime?: string;

  /**
   * 删除时间
   */
  deleteTime?: string;
  /**
   * 封面标识。
   */
  coverId?: string;
  /**
   * 和专辑关联的资源id。
   *
   * 此字段是为了在选择专辑时高亮已选专辑，其他时候不用。
   */
  resourceId: string;
}

export interface AlbumResourceVo {
  id?: string;

  albumId?: string;

  albumName?: string;

  resourceId?: string;

  resourceName?: string;

  resourceDir?: string;
}

export interface FileInfo {
  /**
   * 主键标识。
   */
  id?: string;

  /**
   * 业务代码，用来关联业务。
   */
  businessCode?: string;

  /**
   * 业务类型。
   */
  businessType?: number;

  /**
   * 原始文件名。
   */
  originalFilename?: string;

  /**
   * 实际文件名。
   */
  filename?: string;
}

/**
 * 评分。
 */
export interface RateVo {
  serialVersionUID?: number

  /**
  * 评分主键标识。
  */
  rateId?: string

  /**
  * 资源标识
  */
  resourceId?: string

  /**
  * 评分
  */
  rate?: number

  /**
  * 删除状态
  */
  deleteStatus?: number

  /**
  * 创建时间
  */
  createTime?: any

  /**
  * 更新时间
  */
  updateTime?: any
}
