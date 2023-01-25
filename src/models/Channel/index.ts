import { Model } from '@vuex-orm/core'
import User from '@/models/User'
import ChannelMessage from '../ChannelMessage'
import ChannelMember from '../ChannelMember'
import APIService from './APIService'

export default class Channel extends Model {
  static entity = 'channels'
  static apiService = APIService
  static api: typeof APIService
  
  static primaryKey = 'id'

  static fields () {
    return {
      id: this.uid(),

      name: this.string(''),
      type: this.string(null),

      messages: this.hasMany(ChannelMessage, 'channelId'),
      members: this.belongsToMany(User, ChannelMember, 'channelId', 'userId'),
    }
  }

  id?: string | number

  name?: string
  type?: 'dm' | 'group'

  messages?: ChannelMessage[]
  members?: User[]

  async send (content: string) {
    await ChannelMessage.api.store(new ChannelMessage({
      channelId: this.id,
      channel: this,
      content,
    }))
  }

  async remove (id: string) {
    ChannelMessage.api.destroy(ChannelMessage.find(id)!)
  }
}
