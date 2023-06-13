const express = require('express');
const router = express.Router();
const User = require('../models/UserModel').default;
const List = require('../models/ListModel').default;
const Character = require('../models/CharacterModel').default;

// Create
router.post('/', async (req, res) => {

  const { listname, userId, characterId } = req.body;

  if (!listname || !userId) {
    res.status(422).json({ error: 'Invalid listname or userId'});
    return;
  }

  try {
    const newList = await List.create({ listname, UserId: userId });
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (characterId) {
      const character = await Character.findByPk(characterId);

      if (!character) {
        res.status(404).json({ message: 'Character not found' });
        return;
      }

      await newList.addCharacter(character); // Adiciona o personagem à lista
    }

    await user.addList(newList);

    res.status(201).json({ message: 'List created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read
router.get('/', async (req, res) => {
  try {
    const lists = await List.findAll({
      include: [{ model: Character, as: 'Characters' }]
    });
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read por ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const lists = await User.findByPk(id, { include: [{ model: Character, as: 'Characters' }]
  });

    if (!lists) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { listname, characterId } = req.body;

  try {
    const list = await List.findByPk(id);

    if (!list) {
      res.status(404).json({ message: 'List not found' });
      return;
    }

    list.listname = listname || list.listname;

    if (characterId) {
      const character = await Character.findByPk(characterId);

      if (!character) {
        res.status(404).json({ message: 'Character not found' });
        return;
      }

      await list.addCharacter(character); // Adiciona o personagem à lista
    }

    await list.save();

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete by Id
router.delete('/:id', async (req, res) => {
  
  const id = req.params.id;

  try {
    
    const list = await List.findByPk(id);

    if (!list) {
      res.status(404).json({ message: 'List not found' });
      return;
    }

    await list.destroy();

    res.status(200).json({ message: 'List deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;