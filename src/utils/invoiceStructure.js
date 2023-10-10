import userModel from '../../DB/models/user.model.js';
import { createInvoice } from './crateInvoice.js';
export async function invoiceStructure(order) {
    const user = await userModel.findById(order.userId)
    const invoice = {
        shipping: {
            name: user.name,
            address: order.address,
            city: "San Francisco",
            state: "CA",
            country: "US",
            postal_code: 94111
        },
        items: order.products.map((iteration) => {
            return {
                item: "TC 100",
                description: "Toner Cartridge",
                quantity: 2,
                amount: 6000
            }
        }),
        subtotal: 8000,
        paid: 0,
        invoice_nr: 1234
    };

    createInvoice(invoice, "invoice.pdf");
}
