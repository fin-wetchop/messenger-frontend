import { Model } from '@vuex-orm/core'
import User from '@/models/User'
import Channel from '@/models/Channel'
import APIService from './APIService'

export default class ChannelMember extends Model {
  static entity = 'channels_members'
  static apiService = APIService
  static api: typeof APIService

  static primaryKey = 'id'

  static fields () {
    return {
      userId: this.attr(''),
      author: this.belongsTo(User, 'userId'),

      channelId: this.attr(''),
      channel: this.belongsTo(Channel, 'channelId'),
    }
  }

  userId?: string
  author?: User

  channelId?: string
  channel?: Channel
}
