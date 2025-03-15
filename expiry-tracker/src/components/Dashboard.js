import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  TextField,
  Snackbar,
  Alert,
  Link,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import ShareIcon from '@mui/icons-material/Share';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';

// Animations
const countUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseWarning = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Colors
const primaryPurple = '#755dff';
const secondaryGreen = '#4aeabc';
const accentOrange = '#ff9757';
const dangerRed = '#ff5c5c';
const textPrimary = '#ffffff';
const textSecondary = 'rgba(255,255,255,0.7)';

// Add the donation service
const donationService = {
  // Mock function to get nearby food donation centers
  // In production, this would use a real API like Google Places
  async findNearbyDonationCenters(latitude, longitude, radius = 5000) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock data - in production this would come from an API
    return [
      {
        id: 'fb1',
        name: 'Community Food Bank',
        address: '123 Main Street, Downtown',
        distance: '1.2 miles',
        phone: '(555) 123-4567',
        website: 'https://communityfoodbank.org',
        hours: 'Mon-Fri: 9am-5pm, Sat: 10am-2pm',
        acceptingItems: ['Non-perishable food', 'Fresh produce', 'Dairy']
      },
      {
        id: 'fb2',
        name: 'Hope Shelter',
        address: '456 Park Avenue, Uptown',
        distance: '2.8 miles',
        phone: '(555) 987-6543',
        website: 'https://hopeshelter.org',
        hours: 'Mon-Sun: 8am-8pm',
        acceptingItems: ['All food items', 'Personal care items']
      },
      {
        id: 'fb3',
        name: 'Neighborhood Pantry',
        address: '789 Oak Street, Westside',
        distance: '3.5 miles',
        phone: '(555) 246-8101',
        website: 'https://neighborhoodpantry.org',
        hours: 'Tue, Thu: 2pm-7pm, Sat: 9am-12pm',
        acceptingItems: ['Non-perishable food', 'Canned goods']
      }
    ];
  }
};

// Sample data for demonstration
const expiringItems = [
  { id: 1, name: "Milk", expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), daysLeft: 2, category: "Dairy" },
  { id: 2, name: "Bread", expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), daysLeft: 1, category: "Bakery" },
  { id: 3, name: "Spinach", expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), daysLeft: 3, category: "Produce" },
];

const recentItems = [
  { id: 4, name: "Eggs", expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), daysLeft: 14, category: "Dairy" },
  { id: 5, name: "Chicken", expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), daysLeft: 2, category: "Meat" },
  { id: 6, name: "Apples", expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), daysLeft: 7, category: "Produce" },
];

const realDonationService = {
  async findNearbyDonationCenters(latitude, longitude, radius = 5000) {
    // Use Google Places API, Yelp, or another service
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
      `location=${latitude},${longitude}&radius=${radius}&` +
      `type=food_bank|charity|community_center&` +
      `keyword=food%20bank%20OR%20shelter%20OR%20donation&` +
      `key=YOUR_API_KEY`
    );
    const data = await response.json();
    
    // Process data and return in appropriate format
    return data.results.map(place => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      // ... other fields
    }));
  }
};

const Dashboard = () => {
  const [animateStats, setAnimateStats] = useState(false);
  const [statValues, setStatValues] = useState({ total: 0, categories: 0, saved: 0 });
  
  // New state for donation functionality
  const [donationDialogOpen, setDonationDialogOpen] = useState(false);
  const [donationCenters, setDonationCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasNearbyResults, setHasNearbyResults] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [zipCode, setZipCode] = useState('');
  const [locationError, setLocationError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  
  // Function to detect user's location
  const detectUserLocation = () => {
    setLoading(true);
    setLocationError('');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
          fetchDonationCenters(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError('Unable to detect your location automatically. Please enter your zip code.');
          setLoading(false);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser. Please enter your zip code.');
      setLoading(false);
    }
  };
  
  // Function to search by zip code
  const searchByZipCode = () => {
    if (!zipCode.trim()) {
      setLocationError('Please enter a valid zip code');
      return;
    }
    
    setLoading(true);
    setLocationError('');
    
    // In a real application, you would use a geocoding API to convert zip code to coordinates
    // For this example, we'll use mock coordinates
    setTimeout(() => {
      const mockCoordinates = {
        lat: 37.7749, // Example coordinates (San Francisco)
        lng: -122.4194
      };
      setUserLocation(mockCoordinates);
      fetchDonationCenters(mockCoordinates.lat, mockCoordinates.lng);
    }, 1000);
  };
  
  // Function to fetch donation centers
  const fetchDonationCenters = async (latitude, longitude) => {
    try {
      const centers = await donationService.findNearbyDonationCenters(latitude, longitude);
      setDonationCenters(centers);
      setHasNearbyResults(centers.length > 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching donation centers:", error);
      setLocationError('Error finding donation centers. Please try again later.');
      setHasNearbyResults(false);
      setLoading(false);
    }
  };
  
  // Function to open donation dialog with selected item
  const openDonationOptions = (item) => {
    setSelectedItem(item);
    setDonationDialogOpen(true);
    
    // If we already have the user's location, fetch immediately
    if (userLocation) {
      fetchDonationCenters(userLocation.lat, userLocation.lng);
    }
  };
  
  // Handle notification close
  const handleNotificationClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };
  
  useEffect(() => {
    // Start animation after component mounts
    setAnimateStats(true);
    
    // Animate stats counting up
    const timer = setTimeout(() => {
      const intervalTotal = setInterval(() => {
        setStatValues(prev => {
          if (prev.total >= 18) clearInterval(intervalTotal);
          return { ...prev, total: Math.min(prev.total + 1, 18) };
        });
      }, 100);
      
      const intervalCategories = setInterval(() => {
        setStatValues(prev => {
          if (prev.categories >= 5) clearInterval(intervalCategories);
          return { ...prev, categories: Math.min(prev.categories + 1, 5) };
        });
      }, 200);
      
      const intervalSaved = setInterval(() => {
        setStatValues(prev => {
          if (prev.saved >= 8) clearInterval(intervalSaved);
          return { ...prev, saved: Math.min(prev.saved + 1, 8) };
        });
      }, 150);
      
      return () => {
        clearInterval(intervalTotal);
        clearInterval(intervalCategories);
        clearInterval(intervalSaved);
      };
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const getExpiryStatusColor = (daysLeft) => {
    if (daysLeft <= 1) return dangerRed;
    if (daysLeft <= 3) return accentOrange;
    return secondaryGreen;
  };

  const getExpiryStatusIcon = (daysLeft) => {
    if (daysLeft <= 1) return <WarningIcon sx={{ color: dangerRed, fontSize: 18 }} />;
    if (daysLeft <= 3) return <TimerIcon sx={{ color: accentOrange, fontSize: 18 }} />;
    return <CheckCircleIcon sx={{ color: secondaryGreen, fontSize: 18 }} />;
  };
  
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 15
      }
    }
  };

  // When searching by ZIP code
  const geocodeZipCode = async (zipCode) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?` +
      `address=${zipCode}&key=YOUR_API_KEY`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    }
    
    throw new Error('Unable to find location for this ZIP code');
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      {/* Dashboard Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            Dashboard
          </Typography>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="contained" 
              color="primary" 
              component={RouterLink} 
              to="/upload"
              sx={{ 
                borderRadius: 2,
                px: 3
              }}
            >
              Upload Receipt
            </Button>
          </motion.div>
        </Box>
      </motion.div>
      
      {/* Summary Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Paper 
                sx={{ 
                  p: 3, 
                  bgcolor: 'background.paper', 
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.05)',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2, 
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        bgcolor: 'rgba(117,93,255,0.1)',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 1.5
                      }}
                    >
                      <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>{expiringItems.length}</Typography>
                    </Box>
                    Expiring Soon
                  </Box>
                  
                  {/* New donation hint button */}
                  <Chip
                    icon={<VolunteerActivismIcon fontSize="small" />}
                    label="Donate"
                    size="small" 
                    color="primary"
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                    onClick={() => setDonationDialogOpen(true)}
                  />
                </Typography>
                
                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 2 }} />
                
                {expiringItems.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {expiringItems.map((item, index) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={item.id}
                      >
                        <ListItem 
                          sx={{ 
                            px: 0, 
                            py: 1, 
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            '&:last-of-type': { border: 'none' },
                            transition: 'background-color 0.3s',
                            '&:hover': { 
                              bgcolor: 'rgba(255,255,255,0.03)',
                              borderRadius: 1
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Box sx={{ 
                              animation: item.daysLeft <= 1 ? `${pulseWarning} 2s infinite` : 'none'
                            }}>
                              {getExpiryStatusIcon(item.daysLeft)}
                            </Box>
                          </ListItemIcon>
                          <ListItemText 
                            primary={item.name} 
                            secondary={`Expires in ${item.daysLeft} day${item.daysLeft !== 1 ? 's' : ''}`}
                            primaryTypographyProps={{ color: 'text.primary' }}
                            secondaryTypographyProps={{ 
                              color: getExpiryStatusColor(item.daysLeft), 
                              fontSize: '0.75rem' 
                            }}
                          />
                          <Box>
                            <Chip 
                              label={item.category} 
                              size="small"
                              sx={{ 
                                bgcolor: 'rgba(255,255,255,0.05)', 
                                color: 'text.secondary',
                                fontSize: '0.7rem',
                                mb: 0.5,
                                transition: 'all 0.3s',
                                '&:hover': {
                                  bgcolor: 'rgba(255,255,255,0.1)'
                                }
                              }}
                            />
                            
                            {/* New Donation Button */}
                            {item.daysLeft <= 3 && (
                              <Button
                                size="small"
                                startIcon={<VolunteerActivismIcon sx={{ fontSize: '0.8rem' }} />}
                                onClick={() => openDonationOptions(item)}
                                sx={{ 
                                  display: 'block',
                                  fontSize: '0.7rem',
                                  color: accentOrange,
                                  p: 0,
                                  minWidth: 'auto',
                                  textTransform: 'none',
                                  '&:hover': {
                                    bgcolor: 'transparent',
                                    textDecoration: 'underline'
                                  }
                                }}
                              >
                                Donate
                              </Button>
                            )}
                          </Box>
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">No items expiring soon.</Typography>
                )}
              </Paper>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Paper 
                sx={{ 
                  p: 3, 
                  bgcolor: 'background.paper', 
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.05)',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2, 
                    color: secondaryGreen,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Box 
                    sx={{ 
                      bgcolor: 'rgba(74,234,188,0.1)',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 1.5
                    }}
                  >
                    <Typography sx={{ color: secondaryGreen, fontWeight: 'bold' }}>{recentItems.length}</Typography>
                  </Box>
                  Recently Added
                </Typography>
                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 2 }} />
                {recentItems.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {recentItems.map((item) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        key={item.id}
                      >
                        <ListItem 
                          sx={{ 
                            px: 0, 
                            py: 1, 
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            '&:last-of-type': { border: 'none' },
                            transition: 'background-color 0.3s',
                            '&:hover': { 
                              bgcolor: 'rgba(255,255,255,0.03)',
                              borderRadius: 1
                            }
                          }}
                        >
                          <ListItemText 
                            primary={item.name} 
                            secondary={`${item.daysLeft} days until expiry`}
                            primaryTypographyProps={{ color: 'text.primary' }}
                            secondaryTypographyProps={{ color: 'text.secondary', fontSize: '0.75rem' }}
                          />
                          <Chip 
                            label={item.category} 
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(255,255,255,0.05)', 
                              color: 'text.secondary',
                              fontSize: '0.7rem',
                              transition: 'all 0.3s',
                              '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.1)'
                              }
                            }}
                          />
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">No recent items.</Typography>
                )}
              </Paper>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Paper 
                sx={{ 
                  p: 3, 
                  bgcolor: 'background.paper', 
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.05)',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2, 
                    color: 'text.primary',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Box 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.05)',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 1.5
                    }}
                  >
                    <Typography sx={{ color: 'text.primary', fontWeight: 'bold' }}>12</Typography>
                  </Box>
                  Statistics
                </Typography>
                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 2 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Items
                  </Typography>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Typography variant="h5" color="text.primary" sx={{ 
                      animation: animateStats ? `${countUp} 0.5s ease forwards` : 'none'
                    }}>
                      {statValues.total}
                    </Typography>
                  </motion.div>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Categories
                  </Typography>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Typography variant="h5" color="text.primary" sx={{ 
                      animation: animateStats ? `${countUp} 0.5s ease forwards` : 'none'
                    }}>
                      {statValues.categories}
                    </Typography>
                  </motion.div>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Saved from waste
                  </Typography>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Typography variant="h5" color="primary" sx={{ 
                      animation: animateStats ? `${countUp} 0.5s ease forwards` : 'none'
                    }}>
                      {statValues.saved} items
                    </Typography>
                  </motion.div>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
      
      {/* Donation Dialog */}
      <Dialog 
        open={donationDialogOpen} 
        onClose={() => setDonationDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 3,
            bgcolor: 'background.paper',
            backgroundImage: 'none'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VolunteerActivismIcon sx={{ color: accentOrange }} />
          Food Donation Options
          {selectedItem && (
            <Chip 
              label={`${selectedItem.name} (${selectedItem.daysLeft} days left)`}
              size="small"
              sx={{ ml: 2, bgcolor: 'rgba(255,255,255,0.05)' }}
            />
          )}
        </DialogTitle>
        
        <DialogContent>
          {!userLocation && !loading && (
            <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)' }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                We need your location to find food banks and shelters near you.
              </Typography>
              
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<MyLocationIcon />}
                    onClick={detectUserLocation}
                    sx={{ 
                      borderColor: 'rgba(255,255,255,0.1)',
                      color: textPrimary,
                      '&:hover': { borderColor: primaryPurple }
                    }}
                  >
                    Use My Current Location
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      placeholder="Enter ZIP Code"
                      variant="outlined"
                      size="small"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      sx={{ 
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={searchByZipCode}
                    >
                      Search
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              
              {locationError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {locationError}
                </Alert>
              )}
            </Box>
          )}
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress color="primary" />
            </Box>
          )}
          
          {userLocation && !loading && (
            <>
              <Typography variant="body2" sx={{ mb: 2, color: textSecondary }}>
                Here are food banks and shelters near you that accept food donations. Call ahead to confirm they can accept your specific items.
              </Typography>
              
              {hasNearbyResults ? (
                <Grid container spacing={2}>
                  {donationCenters.map((center) => (
                    <Grid item xs={12} md={6} key={center.id}>
                      <Card 
                        variant="outlined"
                        sx={{ 
                          bgcolor: 'rgba(0,0,0,0.2)', 
                          borderColor: 'rgba(255,255,255,0.1)',
                          '&:hover': { borderColor: primaryPurple }
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 1 }}>
                            {center.name}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                            <LocationOnIcon fontSize="small" sx={{ color: accentOrange, opacity: 0.7 }} />
                            <Typography variant="body2" color="text.secondary">
                              {center.address} ({center.distance})
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Hours:</strong> {center.hours}
                          </Typography>
                          
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Phone:</strong> {center.phone}
                          </Typography>
                          
                          <Typography variant="caption" color="text.secondary">
                            <strong>Accepting:</strong> {center.acceptingItems.join(', ')}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                          <Button 
                            size="small" 
                            startIcon={<LocationOnIcon />}
                            href={`https://maps.google.com/?q=${encodeURIComponent(center.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ color: primaryPurple }}
                          >
                            Directions
                          </Button>
                          
                          <Button 
                            size="small"
                            startIcon={<ShareIcon />}
                            onClick={() => {
                              // In a real app, implement share functionality
                              setNotification({
                                open: true,
                                message: `Sharing details for ${center.name}`,
                                severity: 'success'
                              });
                            }}
                            sx={{ color: secondaryGreen }}
                          >
                            Share
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  No food donation centers found in your area. Try expanding your search radius or contact your local government for information about food donation programs.
                </Alert>
              )}
              
              <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: secondaryGreen }}>
                  Food Donation Tips:
                </Typography>
                <List dense>
                  <ListItem sx={{ px: 1, py: 0.5 }}>
                    <ListItemText 
                      primary="Call ahead to confirm they can accept your specific items." 
                      primaryTypographyProps={{ fontSize: '0.85rem' }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 1, py: 0.5 }}>
                    <ListItemText 
                      primary="Check that perishable items haven't started to spoil." 
                      primaryTypographyProps={{ fontSize: '0.85rem' }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 1, py: 0.5 }}>
                    <ListItemText 
                      primary="Ensure items are properly sealed and packaged." 
                      primaryTypographyProps={{ fontSize: '0.85rem' }}
                    />
                  </ListItem>
                </List>
              </Box>
            </>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={() => setDonationDialogOpen(false)}
            sx={{ color: textSecondary }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      
      {/* All Items Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Paper 
          sx={{ 
            p: 3, 
            bgcolor: 'background.paper', 
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.05)',
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'translateY(-3px)'
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" color="text.primary">
              All Tracked Items
            </Typography>
            <Button 
              variant="outlined" 
              size="small"
              sx={{
                borderColor: 'rgba(255,255,255,0.1)',
                color: textPrimary,
                '&:hover': { borderColor: primaryPurple, bgcolor: 'rgba(117,93,255,0.05)' }
              }}
            >
              View All
            </Button>
          </Box>
          
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <Typography color="text.secondary" align="center">
              This is a placeholder for all tracked items. In the full application, this would show a paginated list or grid of all food items being tracked, with filtering and sorting options.
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Dashboard;
