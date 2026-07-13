import Joi from 'joi'

export const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  login: Joi.string().min(3).max(32).required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    .messages({ 'string.pattern.base': 'Password must include at least 8 characters, one uppercase letter, one lowercase letter and one digit' })
    .required(),
  verify: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match'
  })
})

export const loginSchema = Joi.object({
  identifier: Joi.string().required(),
  password: Joi.string().required()
})
