import { Model } from '@vuex-orm/core'
import User from '@/models/User'
import Channel from '@/models/Channel'
import APIService from './APIService'

export default class ChannelMessage extends Model {
  static entity = 'channel_messages'
  static apiService = APIService
  static api: typeof APIService

  static primaryKey = 'id'

  static fields () {
    return {
      id: this.uid(),

      authorId: this.attr(null).nullable(),
      author: this.belongsTo(User, 'authorId'),

      channelId: this.attr(null).nullable(),
      channel: this.belongsTo(Channel, 'channelId'),

      content: this.string(''),

      createdAt: this.attr(() => new Date().toISOString()),
    }
  }

  id?: string | number

  authorId?: string
  author?: User

  channelId?: string
  channel?: Channel

  content?: string

  createdAt?: string
}
