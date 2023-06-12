const express = require('express');
const router = express.Router();
const Character  = require('../models/CharacterModel').default;
const List  = require('../models/ListModel').default;

/*import express from 'express';
const router = express.Router();
import Character from '../models/CharacterModel';
import List from '../models/ListModel';*/

// Create
router.post('/', async (req, res) => {
  const { charname, alterego, image, about, isHero, isMarvel } = req.body;

  if (!charname || !alterego || !image || !about || !isHero || !isMarvel) {
    res.status(422).json({ error: 'Invalid charname, alterego, image, about, isHero or isMarvel' });
    return;
  }

  const character = {
    charname,
    alterego,
    image,
    about,
    isHero,
    isMarvel
  };

  try {
    await Character.create(character);
    res.status(201).json({ message: 'Character created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add character to list
router.post('/charlist', async (req, res) => {
  
  const { characterId, listId } = req.body;

  if (!characterId || !listId) {
    res.status(422).json({ error: 'Invalid characterId or listId' });
    return;
  }

  try {
    const character = await Character.findByPk(characterId);
    if (!character) {
      res.status(404).json({ message: 'Character not found' });
      return;
    }

    const list = await List.findByPk(listId);
    if (!list) {
      res.status(404).json({ message: 'List not found' });
      return;
    }

    await character.addList(list);
    await list.addCharacter(character);

    res.status(200).json({ message: 'Character added to list successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Read
router.get('/', async (req, res) => {
  const { isMarvel, isHero } = req.query;

  let query = {};

  if (isMarvel === 'true' || isMarvel === 'false') {
    query.isMarvel = isMarvel === 'true';
  }

  if (isHero === 'true' || isHero === 'false') {
    query.isHero = isHero === 'true';
  }

  try {
    const characters = await Character.findAll({ 
      where: query,
      include: [{ model: List, as: 'Lists' }]
    }); 
    res.status(200).json(characters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read by Id
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const character = await Character.findByPk(id, { include: [{ model: List, as: 'Lists' }] });

    if (!character) {
      res.status(404).json({ message: 'Character not found' });
      return;
    }

    res.status(200).json(character);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { charname, alterego, image, about, isHero, isMarvel } = req.body;

  try {
    const character = await Character.findByPk(id);

    if (!character) {
      res.status(404).json({ message: 'Character not found' });
      return;
    }

    character.charname = charname || character.charname;
    character.alterego = alterego || character.alterego;
    character.image = image || character.image;
    character.about = about || character.about;
    character.isHero = isHero || character.isHero;
    character.isMarvel = isMarvel || character.isMarvel;

    await character.save();

    res.status(200).json(character);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete by Id
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const character = await Character.findByPk(id);

    if (!character) {
      res.status(404).json({ message: 'Character not found' });
      return;
    }

    await character.removeLists();
    await character.destroy();

    res.status(200).json({ message: 'Character deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete character from list
router.delete('/charlist/:characterId/:listId', async (req, res) => {
  const { characterId, listId } = req.params;

  try {
    const character = await Character.findByPk(characterId);
    if (!character) {
      res.status(404).json({ message: 'Character not found' });
      return;
    }

    const list = await List.findByPk(listId);
    if (!list) {
      res.status(404).json({ message: 'List not found' });
      return;
    }

    await character.removeList(list);
    await list.removeCharacter(character);

    res.status(200).json({ message: 'Character removed from list successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;