import { Router } from 'express';
import CartController from '../../controller/carts.controller.js';
import TicketsServices from '../../services/tickets.services.js';
import UsersDTO from '../../dto/users.dto.js';
import {authRolesMiddleware } from '../../utils.js';
import CartDTO from '../../dto/cart.dto.js';
import { logger } from '../../utils/logger.js';

const router = Router();

router.post('/carts', async (req,res) => {
const { productId, quantity } = req.body;
const user = req.user;
const cartId = user.cart;
logger.info('requser',user);
try {
    const newCart = await CartController.createCart(productId, quantity,cartId);
    res.status(200).json(newCart);
} catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
}
});

router.delete('/carts/:cid/products/:pid', async (req,res) => {
    //eliminar el producto seleccionado del carrito
    const _id = req.params.cid;
    const pId = req.params.pid;
    try {
    const productDelete = await CartController.deleteProduct(_id,pId)    
    res.status(204).json({ message: 'producto quitado' ,productDelete});
    }catch (error) {
        res.status(500).json({ message: 'Error al borrar producto del carrito' });
    }
});

router.delete('/carts/:cid', async (req,res) => {
    //vaciamos carrito, borrarlo generaria conflictos con cartID
    const {cid} = req.params;
    
    try {
       const deleteCart = await CartController.deleteCart({_id: cid});
       logger.info('result',deleteCart);
        res.status(204).json(`carrito borrado ${cid}`);
    } catch (error) {
        logger.error('error al borrar carrito');
        res.status(400).json('error')
    }
});

router.put('/carts/:cid', async (req,res) => {
    //actualiza products con un array
    const _id = req.params.cid;
    const { products: newProducts } = req.body;
    
    try {
        let newCart = await CartController.updateCart(_id,newProducts);
        logger.info(newCart);
        res.status(204).json(`carrito actualizado ${newCart}`);  
    } catch (error) {
        logger.error('error actualizando carrito');
        res.status(400).json("error al actualizar carrito");
    }
});

router.put('/carts/:cid/products/:pid', async (req,res) => {
    //actualiza solo cantidad
    const _id = req.params.cid;
    const pId = req.params.pid;
    const {newQuantity} = req.body;
    try {
            let existingCart = await CartController.updateQuantity(_id,pId,newQuantity);
           
             if (!existingCart) {
             return res.status(404).json({ message: 'Carrito no encontrado' });
             } 
             res.status(204).json({ message: 'cantidad actualizada' ,existingCart});
    }catch (error) {
        logger.info('error al actualizar cantidad');
        res.status(500).json('error')
    }
   
});

router.get('/carts/:cid', authRolesMiddleware(['user']), async (req, res) => {
    try{
    const _id = req.params.cid;
    const succesResult = await TicketsServices.succesStock(_id);

    const cartDTO = new CartDTO(succesResult);

    const dataUserDTO = new UsersDTO(req.user);
    const notStockData = await cartDTO.notStock; 
   logger.info('not stock obj', notStockData);
    /*res.render('cart', {
        title: 'cart',
        cartDb: cartDTO.productsForRender,
        notStock: notStockData,
        dataUserDTO
    });*/
    res.json( {
        title: 'cart',
        cartDb: cartDTO.productsForRender,
        notStock: notStockData,
        dataUserDTO
    });
    }catch(error){
        console.error('Error:', error);
        throw error;
    }
});

router.get('/:cid/purchase', async (req, res) => {
    const cartId = req.params.cid;
    const email = req.user.email;

    try {
         
        const succesResult = await TicketsServices.succesStock(cartId);
    
        const purchase = await TicketsServices.Purchase(cartId, email);
    
        const cartDTO = new CartDTO(succesResult);
    
    
        const notStock = await cartDTO.notStock;
        logger.info({purchase});

        const purchaseRenderData= {code: purchase.code,
                                   amount: purchase.amount,
                                   purchaser: purchase.purchaser 
        }
        /*res.render('purchase', {
            title: 'Compra', 
            purchase:purchaseRenderData ,
            notStock
        });*/
        res.json({
            title: 'Compra', 
            purchase:purchaseRenderData ,
            notStock
        });

    } catch (error) {
       logger.error('Error al procesar la compra:', error);
        res.status(500).json({ message: 'Error en la compra' });
    }
});

export default router;

