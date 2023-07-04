const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { method, body } = req;

    if (method === 'GET') {
        const response = await fetch('https://api.github.com/gists/GIST_ID', {
            headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`
            }
        });
        const data = await response.json();
        res.status(200).json(data);
    }

    if (method === 'POST') {
        const response = await fetch('https://api.github.com/gists/GIST_ID', {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    'channels.json': {
                        content: body
                    }
                }
            })
        });
        const data = await response.json();
        res.status(200).json(data);
    }

    res.status(405).send('Method Not Allowed');
};
