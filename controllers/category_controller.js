const connection = require('../models/db')


// get all categories 
module.exports.home = async (req, res) => {
    try {
        const [categories] = await connection.execute('SELECT * FROM categories');

        for (const category of categories) {
            const [products] = await connection.execute('SELECT * FROM products WHERE categoryId = ?', [category.id]);
            category.products = products;
        }
        console.log(categories);
        res.render('category', { categories });
    } catch (error) {
        console.error('Error fetching categories and products:', error);
        res.status(500).send('Internal Server Error');
    }
}


// create category 
module.exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        const [results] = await connection.execute('INSERT INTO categories (name) VALUES (?)', [name]);
        return res.redirect('/categories')
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// edit category 
module.exports.edit = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const [category] = await connection.execute('SELECT * FROM categories WHERE id = ?', [categoryId]);
        if (category.length === 0) {
            return res.status(404).send('Category not found');
        }
        res.render('editCategory', { category: category[0] });
    } catch (error) {
        console.error('Error fetching category details:', error);
        res.status(500).send('Internal Server Error');
    }
}


// update category 
module.exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryName } = req.body;
        await connection.execute('UPDATE categories SET name = ? WHERE id = ?', [categoryName, id]);
        return res.redirect("/categories");
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// DELETE CATEGORY 
module.exports.remove = async (req, res) => {
    try {
        const { id } = req.params;
        const [products] = await connection.execute('SELECT * FROM products WHERE categoryId = ?', [id]);
        if (products.length === 0) {
            await connection.execute('DELETE FROM categories WHERE id = ?', [id]);
            return res.status(200).json({ message: 'Category deleted successfully' });
        } else {
            return res.status(400).json({ error: 'Cannot delete category. Products associated with the category exist.' });
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// delete category by id   NORMAL
// module.exports.remove = async (req, res) => {
//     try {
//         const { id } = req.params;
//         await connection.execute('DELETE FROM categories WHERE id = ?', [id]);
//         return res.redirect("/categories");
//     } catch (error) {
//         console.error('Error deleting category:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }