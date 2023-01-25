import Transformer, { Data } from '@/utils/transform'
import { AxiosStatic } from 'axios'
import ChannelMember from '.'
import ChannelMessage from '.'

const fromResponse = new Transformer()
  .keysTo('camel-case')

const toRequest = new Transformer()
  .only([
    'content',
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
    const response = await this.requester.get(`/channels/${channelId}/messages`)

    const responseData = response.data

    this.model.meta = {
      total: responseData.total,
      perPage: responseData.per_page,
    }

    return responseData.data.map(this.fromResponse)
  }

  static async store (channelMessage: ChannelMessage) {
    return this.fromResponse(
      (await this.requester.post(`/channels/${channelMessage.channelId}/messages`, this.toRequest(channelMessage))).data
    )
  }

  static async destroy (channelMessage: ChannelMessage) {
    await this.requester.delete(`/channels/${channelMessage.channelId}/messages/${channelMessage.id}`)
  }
}
