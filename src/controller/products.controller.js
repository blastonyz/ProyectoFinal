import ProductManagerMdb from "../dao/ProductManagerMdb.js";
import ProductsRepository from "../repository/products.repository.js";

const productsRepository = new ProductsRepository(ProductManagerMdb);

export default class ProductController {
    static get(){
        return productsRepository.get();
    }

    static getPaginated(criterials,options){
        return productsRepository.getPaginated(criterials, options)
    }

    static getById(sid){
      
        return productsRepository.getById(sid);
    }

    static create(data){
        
        return productsRepository.create(data);
    }
    static updateById(sid,data){
       return productsRepository.updateById( sid,  data );
    }
    static deleteById(sid){
        return productsRepository.deleteById({_id: sid});
    }
    static findAndUpdate(sid,data){
        return productsRepository.findAndUpdate({_id: sid},data);
    }
    static getPopulate(sid){
        return productsRepository.getPopulate(sid);
    }
}

