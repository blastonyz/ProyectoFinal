import mongoose from 'mongoose';


const TicketSchema = new mongoose.Schema({
    code: {type: String, required: true},
    purchase_datetime: {type: Date, default: Date.now},
    amount: {type: Number, required: true},
    purchaser: {type: String, required: true},
   
   
},
{timestamps: true}
)



export default  mongoose.model('Purchase',TicketSchema);