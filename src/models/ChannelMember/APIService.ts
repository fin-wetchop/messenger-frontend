import Transformer, { Data } from '@/utils/transform'
import { AxiosStatic } from 'axios'
import ChannelMember from '.'

const fromResponse = new Transformer()
  .only('pivot')
  .move('pivot')
  .keysTo('camel-case')

const toRequest = new Transformer()
  .only([
    'type',
    'members'
  ])
  .keysTo('snake-case')

export default class APIService {
  static requester: AxiosStatic
  static model: any

  static fromResponse (data: Data) {
    return fromResponse.process(data)
  }

  static toRequest (data: Data | ChannelMember) {
    return toRequest.process(data)
  }

  static async index (channelId: string | number) {
    const response = await this.requester.get(`/channels/${channelId}/members`)

    const responseData = response.data

    return responseData.map(this.fromResponse)
  }
}
