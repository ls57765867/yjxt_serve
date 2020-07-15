import ajax from "./index";
import {getObj, saveObj, removeObj} from '../tools/cache-tools'
import config from "../config/config";

export const isLogin = () => {
    return !!getObj(config.admin)
}

export const checkLogin = (account, password) => ajax('/api/auth/admin/login', {account, password}, 'post')

export const checkLogout = () => ajax('api/auth/admin/logout')

export const saveUser = (userObj) => {
    saveObj(config.admin, userObj)
}

export const removeUser = () => {
    removeObj(config.admin)
}

export const getUser = () => {
    return getObj(config.admin)
}

export const uploadImgIcon = (token, account_name, account_icon) => ajax('/api/auth/admin/edit', {
    token,
    account_name,
    account_icon
}, "post");

export const changeAdminPwd = (token,old_password,new_password) => ajax('/api/auth/admin/reset_password',{token,old_password,new_password},'post')

export const getUserMember = () => ajax('/api/auth/admin/getUser')