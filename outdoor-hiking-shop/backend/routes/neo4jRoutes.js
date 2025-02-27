// backend/routes/neo4jRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL Connection
const { createNode, createRelationship } = require('../utils/neo4j');

// Import Data and Create Nodes and Relationships
router.post('/import-data', async (req, res) => {
    try {
        // 1. Users
        const [users] = await db.promise().query('SELECT * FROM users');
        for (const user of users) {
            await createNode('User', user);
        }
        console.log('Users imported into Neo4j.');

        // 2. Products
        const [products] = await db.promise().query('SELECT * FROM products');
        for (const product of products) {
            await createNode('Product', product);
        }
        console.log('Products imported into Neo4j.');

        // 3. Categories + Relationships to Products
        const [categories] = await db.promise().query('SELECT * FROM categories');
        for (const category of categories) {
            await createNode('Category', category);
        }
        for (const product of products) {
            if (product.category_id) { // Check if category_id exists
                await createRelationship(
                    'Product',
                    { key: 'product_id', value: product.id },
                    'Category',
                    { key: 'category_id', value: product.category_id },
                    'BELONGS_TO'
                );
            }
        }
        console.log('Categories and Product relationships created.');

        // 4. Orders + User Relationships
        const [orders] = await db.promise().query('SELECT * FROM orders');
        for (const order of orders) {
            await createNode('Order', order);
            if (order.user_id) {
                await createRelationship(
                    'User',
                    { key: 'user_id', value: order.user_id },
                    'Order',
                    { key: 'order_id', value: order.id },
                    'ORDERED'
                );
            }
        }
        console.log('Orders and User relationships created.');

        // 5. Order Items + Product Relationships
        const [orderItems] = await db.promise().query('SELECT * FROM order_items');
        for (const item of orderItems) {
            await createNode('OrderItem', item);
            await createRelationship(
                'Order',
                { key: 'order_id', value: item.order_id },
                'OrderItem',
                { key: 'order_item_id', value: item.id },
                'CONTAINS'
            );
            await createRelationship(
                'OrderItem',
                { key: 'order_item_id', value: item.id },
                'Product',
                { key: 'product_id', value: item.product_id },
                'CONTAINS_PRODUCT'
            );
        }
        console.log('Order Items and relationships created.');

        // 6. Payments + Order Relationships
        const [payments] = await db.promise().query('SELECT * FROM payments');
        for (const payment of payments) {
            await createNode('Payment', payment);
            await createRelationship(
                'Order',
                { key: 'order_id', value: payment.order_id },
                'Payment',
                { key: 'payment_id', value: payment.id },
                'PAID_BY'
            );
        }
        console.log('Payments and relationships created.');

        // 7. Coupons + Order Relationships
        const [coupons] = await db.promise().query('SELECT * FROM coupons');
        for (const coupon of coupons) {
            await createNode('Coupon', coupon);
        }
        for (const order of orders) {
            if (order.coupon_id) {
                await createRelationship(
                    'Order',
                    { key: 'order_id', value: order.id },
                    'Coupon',
                    { key: 'coupon_id', value: order.coupon_id },
                    'DISCOUNTED_BY'
                );
            }
        }
        console.log('Coupons and Order relationships created.');

        // 8. Inventory Logs + Product Relationships
        const [inventoryLogs] = await db.promise().query('SELECT * FROM inventory_logs');
        for (const log of inventoryLogs) {
            await createNode('InventoryLog', log);
            await createRelationship(
                'Product',
                { key: 'product_id', value: log.product_id },
                'InventoryLog',
                { key: 'inventory_log_id', value: log.id },
                'HAS_LOG'
            );
        }
        console.log('Inventory Logs and Product relationships created.');

        // 9. Reviews + User & Product Relationships
        const [reviews] = await db.promise().query('SELECT * FROM reviews');
        for (const review of reviews) {
            await createNode('Review', review);
            await createRelationship(
                'User',
                { key: 'user_id', value: review.user_id },
                'Review',
                { key: 'review_id', value: review.id },
                'WROTE'
            );
            await createRelationship(
                'Review',
                { key: 'review_id', value: review.id },
                'Product',
                { key: 'product_id', value: review.product_id },
                'REVIEWS_PRODUCT'
            );
        }
        console.log('Reviews and relationships created.');

        // 10. Shipping Methods + Order Relationships
        const [shippingMethods] = await db.promise().query('SELECT * FROM shipping_methods');
        for (const method of shippingMethods) {
            await createNode('ShippingMethod', method);
        }
        for (const order of orders) {
            await createRelationship(
                'Order',
                { key: 'order_id', value: order.id },
                'ShippingMethod',
                { key: 'shipping_method_id', value: order.shipping_method_id },
                'SHIPPED_BY'
            );
        }
        console.log('Shipping Methods and Order relationships created.');

        // 11. Addresses + User Relationships
        const [addresses] = await db.promise().query('SELECT * FROM addresses');
        for (const address of addresses) {
            await createNode('Address', address);
            await createRelationship(
                'User',
                { key: 'user_id', value: address.user_id },
                'Address',
                { key: 'address_id', value: address.id },
                'HAS_ADDRESS'
            );
        }
        console.log('Addresses and User relationships created.');

        // 12. Carts + User and Product Relationships
        const [carts] = await db.promise().query('SELECT * FROM cart_items');
        for (const cart of carts) {
            await createNode('Cart', cart);
            await createRelationship(
                'User',
                { key: 'user_id', value: cart.user_id },
                'Cart',
                { key: 'cart_id', value: cart.id },
                'HAS_CART'
            );
            await createRelationship(
                'Cart',
                { key: 'cart_id', value: cart.id },
                'Product',
                { key: 'product_id', value: cart.product_id },
                'HAS_ITEM'
            );
        }
        console.log('Carts and relationships created.');

        res.json({ message: 'Data imported and relationships created!' });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).send('Error importing data');
    }
});

module.exports = router;
