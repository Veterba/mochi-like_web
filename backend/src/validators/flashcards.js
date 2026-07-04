import Joi from 'joi'

export const nameSchema = Joi.object({
  name: Joi.string().min(1).max(64).required()
})

export const cardSchema = Joi.object({
  front: Joi.string().min(1).required(),
  back: Joi.string().allow('').default('')
})
