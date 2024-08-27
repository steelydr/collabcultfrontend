import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';

const YOUTUBE_CHANNEL_ID = 'UC5Izf1mIZXc0cCgJuxH-iKA'; // Replace with the correct channelId
const YOUTUBE_API_KEY = 'AIzaSyDd5Ts9To-v3O1PhM1d0cOOzONVTgOJ5E4';
const MAX_RESULTS = 3; // Number of videos to display

const OfferSection = () => {
  const [videos, setVideos] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchYouTubeVideos = async () => {
      try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
          params: {
            part: 'snippet',
            channelId: YOUTUBE_CHANNEL_ID,
            maxResults: MAX_RESULTS,
            order: 'date',
            key: YOUTUBE_API_KEY
          }
        });

        setVideos(response.data.items);
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        setError(`Failed to fetch YouTube videos: ${error.message}`);
      }
    };

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

    fetchYouTubeVideos();
    fetchWorkshops();
    fetchEvents();
  }, []);

  const renderVideos = () => (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 4 }}>
        Latest Videos
      </Typography>
      <Grid container spacing={4}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video.id.videoId}>
            <Card 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%', 
                bgcolor: '#141414', 
                boxShadow: '0 8px 16px rgba(0,0,0,0.3)', 
                borderRadius: '12px', 
                overflow: 'hidden',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            >
              <CardMedia
                component="iframe"
                sx={{ 
                  height: 240, 
                  width: '100%', 
                  border: 'none'
                }}
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                title={video.snippet.title}
              />
              <CardContent sx={{ flex: '1 0 auto', color: 'white', padding: 2 }}>
                <Typography component="div" variant="h6" sx={{ color: 'white', fontWeight: 'normal',fontSize: '0.875rem'}}>
                  {video.snippet.title}
                </Typography>
                <Typography component="div" variant="body2" sx={{ color: 'white', fontWeight: 'normal', fontSize: '0.875rem' }}>
                  {video.snippet.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderItems = (items, title) => {
    if (items.length === 0) {
      return null;
    }

    return (
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 4 }}>
          {title}
        </Typography>
        <Grid container spacing={4}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'rgba(255, 255, 255, 0.1)', boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  sx={{ height: 400, width: '100%', objectFit: 'cover' }}
                  image={item.imageUrl}
                  alt={item.name}
                />
                <CardContent sx={{ flex: '1 0 auto', color: 'white', padding: 2 }}>
                  <Typography component="div" variant="h6" sx={{ color: '#21CBF3', mb: 1 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', mb: 1 , textAlign: 'justify'  }}>
                    {item.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EventIcon sx={{ mr: 1, color: '#21CBF3' }} />
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      Date: {new Date(item.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      <LocationOnIcon sx={{ mr: 1, color: '#21CBF3', cursor: 'pointer' }} />
                    </a>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {item.location}
                    </Typography>
                  </Box>
                </CardContent>
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
            {renderVideos()}
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
