import { Model } from '@vuex-orm/core'
import APIService from './APIService'
import Channel from '@/models/Channel'
import ChannelMember from '../ChannelMember'

export default class User extends Model {
  static entity = 'users'
  static apiService = APIService
  static api: typeof APIService

  static primaryKey = 'id'

  get initiatives () {
    const model = this as any as typeof User

    return model.name.split(' ').slice(0, 2).map(name => name.charAt(0)).join('')
  }

  static fields () {
    return {
      id: this.uid(),

      channels: this.belongsToMany(Channel, ChannelMember, 'userId', 'channelId'),

      avatar: this.attr(undefined),

      name: this.string(''),
      username: this.string(''),
      email: this.string(''),
      password: this.string(undefined),
    }
  }

  id?: string | number

  channels?: Channel[]

  avatar?: string

  name?: string
  username?: string
  email?: string
  password?: string
}
