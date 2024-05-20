import axios from 'axios';

const handler = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query Required' });
    }

    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${query}&key=${process.env.API_KEY}`);
        if (response.data.status !== 'OK') {
            return res.status(500).json({ error: 'Failed to fetch location data', details: response.data });
        }

        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching location data', details: error.message });
    }
};

export default handler;
