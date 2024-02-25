const connection = require('../models/db');

// get all products 
module.exports.home = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const perPage = 10;
        const offset = (page - 1) * perPage;

        const [products] = await connection.execute(`
            SELECT p.id AS productId, p.name AS productName, p.categoryId, c.name AS categoryName
            FROM products p
            JOIN categories c ON p.categoryId = c.id
            ORDER BY p.id ASC
            LIMIT ${perPage} OFFSET ${offset}
        `);

        const [categories] = await connection.execute('SELECT * FROM categories');

        const [[totalProducts]] = await connection.execute('SELECT COUNT(*) AS total FROM products');
        const total = totalProducts.total;

        const totalPages = Math.ceil(total / perPage);

        res.render('products', { products, categories, page, totalPages, perPage });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// create product 
module.exports.create = async (req, res) => {
    try {
        const { productName, categoryId } = req.body;
        console.log(req.body);

        if (!productName || !categoryId) {
            return res.status(400).json({ error: 'Product name and category are required' });
        }
        const [results] = await connection.execute('INSERT INTO products (name, categoryId) VALUES (?, ?)', [productName, categoryId]);
        res.redirect('/products');
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// edit .product detaisl by id  
module.exports.edit = async (req, res) => {
    try {
        const productId = req.params.id;

        const [product] = await connection.execute('SELECT * FROM products WHERE id = ?', [productId]);
        if (product.length === 0) {
            return res.status(404).send('Product not found');
        }
        const [categories] = await connection.execute('SELECT * FROM categories');

        res.render('editProduct', { product: product[0], categories });
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Update the product by id
module.exports.update = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { productName, categoryId } = req.body;
        if (!productName || !categoryId) {
            return res.status(400).send('Missing required fields: productName and categoryId');
        }
        const sql = `UPDATE products SET name = ?, categoryId = ? WHERE id = ?`;
        const values = [productName, categoryId, productId];
        await connection.execute(sql, values);
        return res.redirect('/products')
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Internal Server Error');
    }
}

// delete product by id  
module.exports.remove = async (req, res) => {
    try {
        const { id } = req.params;
        await connection.execute('DELETE FROM products WHERE id = ?', [id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}