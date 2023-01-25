import Transformer, { Data } from '@/utils/transform'
import { AxiosStatic } from 'axios'
import User from '.'

const fromResponse = new Transformer()
  .keysTo('camel-case')

const toRequest = new Transformer()
  .only([
    'name',
    'username',
    'email',
    'password',
  ])
  .keysTo('snake-case')

export default class APIService {
  static requester: AxiosStatic
  static model: any

  static fromResponse (data: Data) {
    return fromResponse.process(data)
  }

  static toRequest (data: Data) {
    return toRequest.process(data)
  }

  static async index (query?: any) {
    const response = await this.requester.get(`/users`, {
      params: query,
    })

    const responseData = response.data

    this.model.meta = {
      total: responseData.total,
      perPage: responseData.per_page,
    }

    return responseData.data.map(this.fromResponse)
  }

  static async update (instance: User) {
    return this.fromResponse(
      (await this.requester.post(`/users`, this.toRequest(instance))).data
    )
  }

  static async show (id: string) {
    return this.fromResponse((await this.requester.get(`/users/${id}`)).data)
  }
}
