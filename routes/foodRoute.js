const express = require('express');
const router = express.Router();

const Food = require('../models/foodModel');

router.get('/getallfoods', async (req, res) => {
  try {
    const foods = await Food.find({});
    res.send(foods);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Add food routes

router.post('/addfood', async (req, res) => {
  const food = req.body.food;

  try {
    const newFood = new Food({
      name: food.name,
      image: food.image,
      varients: ['small', 'medium', 'large'],
      description: food.description,
      category: food.category,
      prices: [food.prices],
    });
    await newFood.save();
    res.send('New food added successfully');
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post('/getfoodbyid', async (req, res) => {
  const foodId = req.body.foodId;

  try {
    const food = await Food.findOne({ _id: foodId });
    res.send(food);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

// Edit food routes
router.post('/editfood', async (req, res) => {
  const editedFood = req.body.editedFood;

  try {
    const food = await Food.findOne({ _id: editedFood._id });

    food.name = editedFood.name;
    food.description = editedFood.description;
    food.category = editedFood.category;
    food.image = editedFood.image;
    food.prices = [editedFood.prices];

    await food.save();

    res.send('Food details updated successfully');
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

// Delete food routes
router.post('/deletefood', async (req, res) => {
  const foodId = await req.body.foodId;
  try {
    await Food.findOneAndDelete({ _id: foodId });
    res.send('Food deleted successfully');
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
