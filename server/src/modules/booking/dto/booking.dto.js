import BaseDto from '../../../common/dto/base.dto.js'
import Joi from 'joi'
class BookingDto extends BaseDto{
    static schema=Joi.object({
        id:Joi.required(),
        name:Joi.string().required(),
    })
}

export default BookingDto;