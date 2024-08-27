import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';

const OfferSection = () => {
  const [workshops, setWorkshops] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await axios.get('https://collabculture-app.azurewebsites.net/api/workshops');
        console.log('API Response:', response.data);

        if (Array.isArray(response.data)) {
          setWorkshops(response.data);
        } else if (typeof response.data === 'object' && response.data !== null) {
          const workshopsArray = response.data.workshops || Object.values(response.data);
          if (Array.isArray(workshopsArray)) {
            setWorkshops(workshopsArray);
          } else {
            throw new Error('Unable to extract workshops array from the response');
          }
        } else {
          throw new Error(`Unexpected data format: ${typeof response.data}`);
        }
      } catch (error) {
        console.error('Error fetching workshops:', error);
        setError(`Failed to fetch workshops: ${error.message}`);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://collabculture-app.azurewebsites.net/api/events');
        console.log('API Response:', response.data);

        if (Array.isArray(response.data)) {
          setEvents(response.data);
        } else if (typeof response.data === 'object' && response.data !== null) {
          const eventsArray = response.data.events || Object.values(response.data);
          if (Array.isArray(eventsArray)) {
            setEvents(eventsArray);
          } else {
            throw new Error('Unable to extract events array from the response');
          }
        } else {
          throw new Error(`Unexpected data format: ${typeof response.data}`);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(`Failed to fetch events: ${error.message}`);
      }
    };

    fetchWorkshops();
    fetchEvents();
  }, []);

  const renderItems = (items, title) => {
    if (items.length === 0) {
      return null;
    }

    return (
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          {title}
        </Typography>
        <Grid container spacing={4}>
          {items.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Card sx={{ display: 'flex', height: 350, width: 800, bgcolor: 'rgba(255, 255, 255, 0.1)', boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  sx={{ width: '50%', height: '100%', objectFit: 'cover' }}
                  image={item.imageUrl}
                  alt={item.name}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <CardContent sx={{ flex: '1 0 auto', color: 'white', padding: 2 }}>
                    <Typography component="div" variant="h5" sx={{ color: '#21CBF3', mb: 1 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                      {item.description}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      Date: {new Date(item.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      Location: {item.location}
                    </Typography>
                  </CardContent>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        {error ? (
          <Typography color="error" variant="body1">{error}</Typography>
        ) : (
          <>
            {renderItems(workshops.filter(workshop => new Date(workshop.date) >= new Date()), 'Upcoming Workshops')}
            {renderItems(workshops.filter(workshop => new Date(workshop.date) < new Date()), 'Past Workshops')}
            {renderItems(events.filter(event => new Date(event.date) >= new Date()), 'Upcoming Events')}
            {renderItems(events.filter(event => new Date(event.date) < new Date()), 'Past Events')}
          </>
        )}
      </Box>
    </Container>
  );
};

export default OfferSection;
