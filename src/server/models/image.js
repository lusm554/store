const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ImageSchema = new Schema(
  {
    name: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    img: {
      data: Buffer
    },
  },
)

const ImageModel = mongoose.model('Image', ImageSchema)
exports.ImageModel = ImageModel