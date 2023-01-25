import Transformer, { Data } from '@/utils/transform'
import { AxiosStatic } from 'axios'
import Channel from '.'

const fromResponse = new Transformer()
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
    console.log(data)
    return fromResponse.process(data)
  }

  static toRequest (data: Data | Channel) {
    if (data instanceof Channel) {
      const channel = data
      
      data = toRequest.process(channel)

      data.members = (
        channel.$query()
          .withAllRecursive()
          .first() as Channel
      ).members
        ?.map(user => user.id) ?? [ ]

      return data
    }

    return toRequest.process(data)
  }

  static async index () {
    const response = await this.requester.get(`/channels`)

    const responseData = response.data

    return responseData.map(this.fromResponse)
  }

  static async store (instance: Channel) {
    return this.fromResponse(
      (await this.requester.post(`/channels`, this.toRequest(instance))).data
    )
  }

  static async show (id: string) {
    return this.fromResponse((await this.requester.get(`/channels/${id}`)).data)
  }

  static async destroy (instance: Channel) {
    await this.requester.delete(`/channels/${instance.id}`)
  }
}
