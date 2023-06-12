const express = require('express');
const router = express.Router();
const User = require('../models/UserModel').default;
const List = require('../models/ListModel').default;

/*import express from 'express';
const router = express.Router();
import List from '../models/ListModel';
import User from '../models/UserModel';*/

// Create
router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(422).json({ error: 'Invalid username, email or password' });
    return;
  }

  try {
    const newUser = await User.create({
      username,
      email,
      password
    });

    const myList = await List.create({ listname: 'MyList', id: newUser.id });
    await newUser.addList(myList);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: List, as: 'Lists' }]
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read by Id
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByPk(id, { include: [{ model: List, as: 'Lists' }] });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { username, email, password } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.password = password || user.password;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete by Id
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Encontre todas as listas associadas ao usuário
    const lists = await List.findAll({ where: { UserId: id } });

    // Exclua cada lista individualmente
    for (const list of lists) {
      await list.destroy();
    }

    // Finalmente, exclua o usuário
    await user.destroy();

    res.status(200).json({ message: 'User and associated lists deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;