import ajax from './index'

// 1. 获取所属分类
export const  getResourceCategory = ()=>ajax('/api/auth/resource/r_category');

// 2. 获取所属班级
export const  getResourceClasses = ()=>ajax('/api/auth/resource/r_classes');

// 3. 获取所属区域
export const  getResourceArea = ()=>ajax('/api/auth/resource/r_area');

// 4. 获取所属格式
export const  getResourceFormat = ()=>ajax('/api/auth/resource/r_format');

// 5. 获取所属分类
export const  getResourceMeta = ()=>ajax('/api/auth/resource/r_meta');

// 6. 添加
export const addResource = (token, resource_name, resource_author, resource_publish_time, resource_content, resource_category_id, resource_classes_id, resource_area_id, resource_meta_id, resource_format_id, resource_img, resource_price,  focus_img)=>ajax('/api/auth/resource/add', {token, resource_name, resource_author, resource_publish_time, resource_content, resource_category_id, resource_classes_id, resource_area_id, resource_meta_id, resource_format_id, resource_img, resource_price,  focus_img}, 'post');

// 7. 获取资源列表
export const getResourceList = (page_num, page_size)=>ajax('/api/auth/resource/list', {page_num, page_size});

// 8. 设置是否轮播图
export const setFocusResource = (id, is_focus)=>ajax('/api/auth/resource/set_focus_resource', {id, is_focus});

// 9. 删除一个资源
export const deleteResource = (id)=>ajax('/api/auth/resource/delete_resource', {id});

// 10. 修改一条活动
export const editResource = (token, resource_id, resource_name, resource_author, resource_publish_time, resource_content, resource_category_id, resource_classes_id, resource_area_id, resource_meta_id, resource_format_id, resource_img, resource_price,  focus_img, resource_content_tag)=>ajax('/api/auth/resource/edit', {token, resource_id, resource_name, resource_author, resource_publish_time, resource_content, resource_category_id, resource_classes_id, resource_area_id, resource_meta_id, resource_format_id, resource_img, resource_price,  focus_img, resource_content_tag}, 'post');

// 11. 获取上传的文件
export const getFileList = (tag)=>ajax('/api/auth/resource/file_list', {tag});
