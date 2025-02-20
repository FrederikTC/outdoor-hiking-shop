const { runQuery } = require('../utils/neo4j'); // Ensure the path is correct
module.exports = { runQuery };

const express = require('express');
const router = express.Router();
const { createNode, readNode, updateNode, deleteNode, createRelationship } = require('../utils/neo4j');

// Step 1: Create Node Route
router.post('/create-node', async (req, res) => {
  const { label, properties } = req.body;
  try {
    const result = await createNode(label, properties);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Step 2: Read Node Route
router.get('/read-node/:label/:key/:value', async (req, res) => {
  const { label, key, value } = req.params;
  try {
    const result = await readNode(label, key, value);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Step 3: Update Node Route
router.put('/update-node', async (req, res) => {
  const { label, key, value, updates } = req.body;
  try {
    const result = await updateNode(label, key, value, updates);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Step 4: Delete Node Route
router.delete('/delete-node/:label/:key/:value', async (req, res) => {
  const { label, key, value } = req.params;
  try {
    const result = await deleteNode(label, key, value);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Step 5: Create Relationship Route
router.post('/create-relationship', async (req, res) => {
  const { label1, key1, value1, label2, key2, value2, relType } = req.body;
  try {
    const result = await createRelationship(label1, key1, value1, label2, key2, value2, relType);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;