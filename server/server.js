const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Proxy endpoint for LeetCode GraphQL
app.post('/api/leetcode', async (req, res) => {
  try {
    const { query, variables } = req.body;
    
    const response = await axios.post('https://leetcode.com/graphql', {
      query,
      variables
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching LeetCode data:', error.message);
    res.status(500).json({ error: 'Failed to fetch from LeetCode API' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
