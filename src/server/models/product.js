const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new Schema(
  {
    description: { type: String, required: true },
    price: { type: Number, required: true },
    name: { type: String, required: true, trim: true },
    vendor_code: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    image: { type: Schema.Types.ObjectId, ref: 'Image' },
  },
  {
    timestamps: true
  }
)

ProductSchema.pre('save', async function(next) {
  const currentDate = new Date()
  this.updatedAt = currentDate
  
  const currentCount = await ProductModel.countDocuments()
  const vendor_code = increment_vendor_code(currentCount)
  this.vendor_code = vendor_code
  next()
})

function increment_vendor_code(count) {
  let code = String(count+1)
  while(code.length < 5) {
    code = "0" + code;
  }
  return code
}

const ProductModel = mongoose.model('Product', ProductSchema)
exports.ProductModel = ProductModel