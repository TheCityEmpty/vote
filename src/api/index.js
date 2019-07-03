import http from '@/libs/axios'

// 查看所有活动
// export const getAllActivity = (params) => {
//   return getHttp('/queryActivityList', params, 'get')
// }

// 查看投票情况
export const queryVoteList = (params) => {
  return getHttp('/queryVoteList', params, 'post')
}

// 按条件查询报名人
export const getSignUpUse = (params) => {
  return getHttp('/selectSignUpUserCase', params, 'post')
}

// 获取单个报名人
export const getOneSignUpUser = (params) => {
  return getHttp('/querySignUpUser', params, 'get')
}

// 修改报名人
export const updateSignUpUser = (params) => {
  return getHttp('/updateSignUpUser', params, 'post')
}

// 删除报名人
export const deleteSignUpUser = (params) => {
  return getHttp('/deleteSignUpUser', params, 'get')
}

// 按条件查询活动
export const getAllActivity = (params) => {
  return getHttp('/selectActivityCase', params, 'post')
}

// 查询单个活动
export const queryActivity = (params) => {
  return getHttp('/queryActivity', params, 'get')
}

// 发布活动（新建活动）
export const createActivity = (params) => {
  return getHttp('/createActivity', params, 'post')
}
// 删除活动
export const deleteActivity = (params) => {
  return getHttp('/deleteActivity', params, 'get')
}

// 登陆
export const login = (params) => {
  return getHttp('/login', params, 'post')
}

// 修改活动
export const updateActivity = (params) => {
  return getHttp('/updateActivity', params, 'post')
}

// 添加报名人
export const addSignUpUser = (params) => {
  return getHttp('/createSignUpUser', params, 'post')
}

function getHttp (url, data, type) {
  let token = localStorage.getItem('token')
  let p = {}
  if (type === 'get') {
    p = {
      params: {
        ...data,
        token: token
      }
    }
  }
  if (type === 'post') {
    p = {
      data: {
        ...data,
        token: token
      }
    }
  }
  if (url === '/login') {
    p = {
      data: {
        ...data
      }
    }
  }
  return http.request({
    url: url,
    method: type,
    ...p
  })
}
