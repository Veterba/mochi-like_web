import Joi from 'joi'

export const messageSchema = Joi.object({
  content: Joi.string().min(1).max(4000).required()
})

export const assessSchema = Joi.object({
  text: Joi.string().min(1).max(300).required(),
  audio: Joi.string().base64().max(4_000_000).required(),
  mimeType: Joi.string().max(60),
  lang: Joi.string().max(8),
  chatId: Joi.string().guid().allow(null),
})
