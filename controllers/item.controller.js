import Item from '../models/item.model.js'; // Adjust the path according to your project structure
import Category from '../models/category.model.js';
import { uploadMultipleToCloudinary } from '../utils/cloudinary.js'; // Ensure the correct import for your upload functions

export const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate('category'); // Adjust as necessary
    res.status(200).json({ items });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Server error, could not fetch items.' });
  }
};


export const getItem = async (req, res) => {
  try {
    const { lname } = req.params;
    const item = await Item.findOne({ linkname: { $regex: lname, $options: 'i' } });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.popularity= item.popularity + 1;
    await item.save();
    res.status(200).json({ item });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Server error, could not fetch item.' });
  }
};


    


export const getItemsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params; // Get the category name from the request

    // Find the category by name
    const category = await Category.findOne({ name: categoryName });

    // If no category found, return a 404
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find items that belong to the found category's ObjectId
    const items = await Item.find({ category: category._id });

    // If no items found, return an appropriate message
    if (items.length === 0) {
      return res.status(404).json({ message: 'No items found for this category' });
    }

    res.status(200).json({ message: 'Items fetched successfully', items });
  } catch (error) {
    console.error('Error fetching items by category name:', error);
    res.status(500).json({ message: 'Server error, could not fetch items' });
  }
};

export const getItemsBySearch = async (req, res) => {
  try {
    const { query } = req.params; // Get the search query from the request params

    const items = await Item.find({ name: { $regex: query, $options: 'i' } });


    // If no items found, return an appropriate message
    if (items.length === 0) {
      return res.status(200).json({ message: 'No items found by search', items });
    }

    // Return the found items
    res.status(200).json({ message: 'Items Search successfully', items });
  } catch (error) {
    console.error('Error fetching items by search query:', error);
    res.status(500).json({ message: 'Server error, could not fetch items' });
  }
};


export const addItem = async (req, res) => {
  try {
    // // Find the category by name
    // const categoryDoc = await Category.findOne({ name: req.body.category });
    // if (!categoryDoc) {
    //   return res.status(400).json({ message: 'Category not found' });
    // }
    // Handle image uploads
    const imageUrls = await uploadMultipleToCloudinary(req.files.map(file => file.path));

    const newItem = new Item({
      name: req.body.name,
      linkname: req.body.lname,
      // category: categoryDoc._id, // Use the ObjectId of the found category
      image1: imageUrls[0], // Store first image URL
    });

    await newItem.save();
    res.status(201).json({ message: 'Item created successfully', item: newItem });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Server error, could not add item.' });
  }
};


export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Server error, could not delete item.' });
  }
};
