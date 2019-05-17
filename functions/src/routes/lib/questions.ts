// const _ = require('lodash')
const express = require('express')
// const keystone = require('@eklogvinov/keystone')
// const utils = requireRoot('lib/utils')
// const {
//     shopService,
//     basketService,
//     securityService
// } = requireRoot('lib/services')

// const {
//     authenticate
// } = require('../lib/middleware')
import { WebError } from '../../errors';

const router = express.Router()

// function resBody(member) {
//     return {
//         data: member || {},
//         status: 'success'
//     }
// }

router.get('/',
    // authenticate({
    //     kjs: {
    //         'Basket': 'manage',
    //         'Product': 'view',
    //     },
    // }),
    async (req: any, res: any) => {
        try {
            //     const { page, size, identifier, updatedAt, friendIds } = req.query
            //     const baskets = await basketService.getBaskets({ page, size, token: req.headers.authorization })
            res.status(200).send('baskets')
        } catch (e) {
            if (e instanceof WebError) {
                console.log(e)
                res.status(e.status).send(e.message)
            } else {
                console.log(e)
                res.status(500).send(e.message)
            }
        }
    })

// router.get('/products', authenticate({
//     kjs: {
//         'Product': 'manage',
//     },
// }),
//     async (req, res) => {
//         try {
//             await shopService.getProducts()
//                 .then(product => {
//                     res.send(product)
//                 })
//                 .catch(err => {
//                     throw new WebError(err)
//                 })
//         } catch (e) {
//             if (e instanceof WebError) {
//                 console.log(e)
//                 res.status(e.status).send(e.message)
//             } else {
//                 console.log(e)
//                 res.status(500).send(e.message)
//             }
//         }
//     })

// router.get('/products-in-baskets', authenticate({
//     kjs: {
//         'Product': 'manage',
//     },
// }),
//     async (req, res) => {
//         try {
//             const {
//                 basket,
//                 product
//             } = req.query

//             let filters = {
//                 basket,
//                 product
//             }

//             filters = _.omit(filters, _.isNil)
//             console.log(filters)
//             await shopService.getProductsInBaskets()
//                 .then(productsInBaskets => {
//                     res.send(productsInBaskets)
//                 })
//                 .catch(err => {
//                     throw new WebError(err)
//                 })
//         } catch (e) {
//             if (e instanceof WebError) {
//                 console.log(e)
//                 res.status(e.status).send(e.message)
//             } else {
//                 console.log(e)
//                 res.status(500).send(e.message)
//             }
//         }
//     })

// router.get('/products-in-baskets/i/:id', authenticate({
//     kjs: {
//         'Product': 'manage',
//     },
// }),
//     async (req, res) => {
//         try {
//             const {
//                 id
//             } = req.params

//             await shopService.findOneProductInBaskets({
//                 id
//             })
//                 .then(productsInBaskets => {
//                     res.send(productsInBaskets)
//                 })
//                 .catch(err => {
//                     throw new WebError(err)
//                 })
//         } catch (e) {
//             if (e instanceof WebError) {
//                 console.log(e)
//                 res.status(e.status).send(e.message)
//             } else {
//                 console.log(e)
//                 res.status(500).send(e.message)
//             }
//         }
//     })


export default router;
