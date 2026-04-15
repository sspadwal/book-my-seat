import BaseDto from '../../../common/dto/base.dto.js'
import Joi from 'joi'
class ResetPassDto extends BaseDto{
    static schema=Joi.object({
        password:Joi.string().required()
    })
}

export default ResetPassDto;