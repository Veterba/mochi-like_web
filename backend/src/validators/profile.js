import Joi from 'joi'

export const profileSchema = Joi.object({
  nickname: Joi.string().min(1).max(32),
  avatar: Joi.string().allow(null)
}).min(1)
