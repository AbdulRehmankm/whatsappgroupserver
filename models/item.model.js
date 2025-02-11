import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    linkname: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function (value) {
                // Regex to validate WhatsApp group invite links
                const whatsappLinkRegex = /^https:\/\/chat\.whatsapp\.com\/[a-zA-Z0-9_-]+$/;
                return whatsappLinkRegex.test(value);
            },
            message: props => `${props.value} is not a valid WhatsApp group invite link!`
        }
    },
    popularity: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false },
   
    status: { type: String, enum: ['Pending', 'Approved', 'Canceled'], default: 'Pending' },
     image1: { type: String }, // URL for image 1
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);
export default Item;
