import {
  formatDurationToStr,
  formatDateTime
} from '../utils/dateTimeUtil'
const db = wx.cloud.database()

export default class HomeModel {
  static getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: res => {
                resolve(res)
              }
            })
          } else {
            reject(res)
          }
        },
        fail: err => {
          reject(err)
        }
      })
    })
  }

  static getOpenIdAndUserId() {
    return wx.cloud.callFunction({
      name: 'login',
      data: {}
    })
  }

  static addUserId() {
    return db.collection('users').add({
      data: {}
    })
  }

  static getGoalList(userId) {
    return wx.cloud.callFunction({
      name: 'getGoalList',
      data: {
        userId
      }
    })
  }

  static addGoal(userId, title) {
    return wx.cloud.callFunction({
      name: 'createGoal',
      data: {
        userId,
        title
      }
    })
  }

  static formatGoalList(list) {
    let wholeTime = 0
    list.forEach(goal => {
      goal.lastUpdate = formatDateTime(goal.lastUpdate)
      wholeTime += goal.time
      goal.duration = formatDurationToStr(goal.time)
      goal.time = (goal.time / (60 * 60)).toFixed(2)
    })
    return { list, wholeTime: formatDurationToStr(wholeTime) }
  }

  static serializeForChart(list) {
    let chartData = []
    list.forEach(goal => {
      let data = { value: goal.time, name: goal.title }
      chartData.push(data)
    })
    return chartData
  }
}