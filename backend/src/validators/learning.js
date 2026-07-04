import Joi from 'joi'

export const learningSchema = Joi.object({
  status: Joi.string().valid('learning', 'completed').required()
})
