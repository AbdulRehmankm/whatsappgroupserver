import express from 'express';
import {
  getItems,
  addItem,
  deleteItem,
  getItem,
  getItemsByCategory,
  getItemsBySearch,
} from '../controllers/item.controller.js'; // Adjust the path as necessary
import { upload, handleMulterError } from '../middlewares/multer.middleware.js'; // Adjust the path as necessary

const router = express.Router();

// Route to fetch all items
router.get('/', getItems);

router.get('/category/:categoryName', getItemsByCategory);

router.get('/search/:query', getItemsBySearch);


// Route to fetch a single item by ID
router.get('/:lname', getItem);

// Route to add a new item with image uploads
router.post('/add', upload, handleMulterError, addItem);

// Route to delete an item by ID
router.delete('/:id', deleteItem);

export default router;