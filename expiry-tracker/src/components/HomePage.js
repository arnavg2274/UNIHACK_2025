import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Container,
  Grid
} from '@mui/material';
import { Link } from 'react-router-dom';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';

// Animations
const gradientShift = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`;

// Subtle pulse for notification icon (fresh food reminder)
const subtlePulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const HomePage = () => {
  // Define theme colors
  const primaryPurple = '#755dff';
  const secondaryGreen = '#4aeabc';
  const accentOrange = '#ff9757';
  
  // Animation variants - more subtle and professional
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const listItem = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
      <Box
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          position: 'relative',
          overflow: 'hidden',
          pb: 6,
          pt: 8,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          borderRadius: { xs: 0, sm: 3 },
          mb: 6
        }}
      >
          {/* Subtle gradient background */}
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            opacity: 0.05,
            background: `radial-gradient(circle at 20% 30%, ${primaryPurple}88 0%, transparent 50%),
                         radial-gradient(circle at 80% 70%, ${secondaryGreen}88 0%, transparent 50%)`,
            zIndex: 0,
          }}
        />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center" position="relative">
              <motion.div variants={fadeInUp}>
                {/* Title with improved positioning for the underline */}
                <Box sx={{ display: 'inline-block', position: 'relative' }}>
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom
              sx={{ 
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                background: `linear-gradient(90deg, ${primaryPurple}, ${secondaryGreen})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% 100%',
                animation: `${gradientShift} 4s ease infinite`,
                paddingBottom: '5px',
              }}
            >
              Never Waste Food Again
            </Typography>
                  
                  {/* Hand-drawn underline positioned precisely under "Waste" */}
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      left: { xs: '24%', sm: '26%', md: '24%' },   // Start further left
                      width: { xs: '32%', sm: '30%', md: '28%' },  // Increase width significantly
                      bottom: '18px', 
                      height: '20px',
                      pointerEvents: 'none'
                    }}
                  >
                    <motion.svg 
                      width="100%" 
                      height="100%" 
                      viewBox="0 0 100 20"
                      style={{ overflow: 'visible' }}
                    >
                      <motion.path
                        d="M0,10 C20,18 40,5 60,12 C80,18 90,8 100,10"  // Wider path that spans the entire viewBox
                        fill="transparent"
                        stroke={primaryPurple}
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.7 }}
                        transition={{ delay: 0.5, duration: 1.2, ease: "easeInOut" }}
                      />
                    </motion.svg>
                  </Box>
                </Box>
              </motion.div>
              
              <motion.div 
                variants={fadeInUp}
                transition={{ delay: 0.1 }}
              >
            <Typography 
              variant="h5" 
              component="p"
              sx={{ 
                mb: 4, 
                maxWidth: '700px', 
                mx: 'auto', 
                color: 'text.secondary',
                fontWeight: 400,
              }}
            >
              Upload your receipts and we'll track expiry dates of your groceries
            </Typography>
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                transition={{ delay: 0.2 }}
              >
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 2,
                flexWrap: 'wrap',
                    position: 'relative',
                  }}
                >
                  {/* Add the arrow outside the button but before it */}
                  <Box sx={{ 
                    position: 'absolute', 
                    top: '50%',
                    left: { xs: '75px', sm: '85px', md: '185px' }, 
                    transform: 'translateY(-70%) rotate(12deg)',
                    zIndex: 1, 
                    pointerEvents: 'none',
                    display: { xs: 'none', sm: 'block' }  // Hide on mobile
                  }}>
                    <motion.svg width="80" height="40" viewBox="0 0 80 40">
                      {/* Arrow body - curved from left */}
                      <motion.path
                        d="M5,20 C25,5 45,35 65,20"
                        fill="transparent"
                        stroke={secondaryGreen}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.8 }}
                        transition={{ delay: 2, duration: 1 }}
                      />
                      {/* Arrow tip - pointing right */}
                      <motion.path
                        d="M65,20 L58,14 L58,26"
                        fill="transparent"
                        stroke={secondaryGreen}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.8 }}
                        transition={{ delay: 3, duration: 0.5 }}
                      />
                    </motion.svg>
                  </Box>

              <Button 
                variant="contained" 
                color="primary"
                component={Link}
                to="/dashboard"
                sx={{ 
                  px: 3, 
                  py: 1,
                  fontWeight: 500,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }
                }}
              >
                Go to Dashboard
              </Button>
                  
              <Button 
                variant="outlined"
                component={Link}
                to="/upload"
                sx={{ 
                  px: 3, 
                  py: 1,
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: 'text.primary',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'rgba(255,255,255,0.2)',
                        backgroundColor: 'rgba(255,255,255,0.03)'
                      }
                }}
              >
                Upload Receipt
              </Button>
            </Box>
              </motion.div>

              {/* Stats cards with subtle animations */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 3, 
                justifyContent: 'center',
                mt: 6,
              }}
            >
                  <motion.div variants={listItem}>
              <Paper 
                sx={{ 
                  py: 2, 
                  px: 3, 
                  borderRadius: 3, 
                  minWidth: '120px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  bgcolor: 'rgba(255,255,255,0.02)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'rgba(117,93,255,0.2)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }
                }}
              >
                <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>31%</Typography>
                <Typography variant="body2" color="text.secondary">Food Waste Reduced</Typography>
              </Paper>
                  </motion.div>

                  <motion.div variants={listItem}>
              <Paper 
                sx={{ 
                  py: 2, 
                  px: 3, 
                  borderRadius: 3, 
                  minWidth: '120px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  bgcolor: 'rgba(255,255,255,0.02)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'rgba(74,234,188,0.2)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }
                }}
              >
                <Typography variant="h5" color="secondary" sx={{ fontWeight: 600 }}>1.2M</Typography>
                <Typography variant="body2" color="text.secondary">Items Tracked</Typography>
              </Paper>
                  </motion.div>

                  <motion.div variants={listItem}>
              <Paper 
                sx={{ 
                  py: 2, 
                  px: 3, 
                  borderRadius: 3, 
                  minWidth: '120px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  bgcolor: 'rgba(255,255,255,0.02)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'rgba(255,151,87,0.2)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }
                }}
              >
                <Typography variant="h5" color="warning" sx={{ fontWeight: 600 }}>$580</Typography>
                <Typography variant="body2" color="text.secondary">Avg. Savings/Year</Typography>
              </Paper>
                  </motion.div>
                </Box>
              </motion.div>
          </Box>
        </Container>
      </Box>
      </motion.div>
      
      {/* Features Section with more professional animations */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Box sx={{ width: '100%', height: '40px', my: 3, position: 'relative', pointerEvents: 'none' }}>
          <motion.svg width="100%" height="100%" viewBox="0 0 1000 40">
            <motion.path
              d="M0,20 C100,10 200,30 300,15 C400,0 500,40 600,20 C700,0 800,30 900,15 C950,7 975,15 1000,20"
              fill="transparent"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2 }}
            />
            
            {/* Apple doodle with improved stem and completed body */}
            <g transform="translate(485, 5)">
              {/* Apple body - more complete and natural shape */}
              <motion.path
                d="M15,20 C15,10 25,5 30,15 C35,5 45,10 45,20 C45,35 30,55 30,55 C30,55 15,35 15,20 Z"
                fill="transparent"
                stroke={secondaryGreen}
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 2, duration: 1.2 }}
              />
              
              {/* Bite mark - better positioned */}
              <motion.path
                d="M38,15 C44,22 42,32 36,38"
                fill="transparent"
                stroke={secondaryGreen}
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 3.2, duration: 0.6 }}
              />
              
              {/* Fixed apple stem - shorter and more natural */}
              <motion.path
                d="M29,12 C29.5,8 32,6 34,5"
                fill="transparent"
                stroke={secondaryGreen}
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 3.8, duration: 0.4 }}
              />
              
              {/* Enhanced leaf with better shape */}
              <motion.path
                d="M34,5 C38,3 42,7 38,10"
                fill="transparent"
                stroke={secondaryGreen}
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 4.2, duration: 0.5 }}
              />
            </g>
          </motion.svg>
        </Box>
      <Box sx={{ mb: 8 }}>
          <motion.div variants={fadeInUp}>
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            mb: 4.5, 
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          How It Works
        </Typography>
          </motion.div>
        
          <motion.div
            variants={staggerContainer}
          >
        <Grid 
          container 
          spacing={4}
        >
          <Grid item xs={12} md={4}>
                <motion.div variants={listItem}>
            <Paper 
              sx={{ 
                p: 3, 
                bgcolor: 'background.paper',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: `rgba(117,93,255,0.2)`,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      }
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                      {/* Icon with subtle transition */}
                <Box 
                  sx={{ 
                    bgcolor: 'rgba(117,93,255,0.1)',
                    borderRadius: '50%',
                    width: 42,
                    height: 42,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                          transition: 'background-color 0.3s ease'
                  }}
                >
                  <ReceiptLongIcon sx={{ color: primaryPurple, fontSize: 22 }} />
                </Box>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ mb: 0, fontWeight: 500 }}
                >
                  1. Upload Receipt
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Take a photo of your grocery receipts or upload existing images. Our system accepts all major receipt formats.
              </Typography>
            </Paper>
                </motion.div>
          </Grid>
          
          <Grid item xs={12} md={4}>
                <motion.div variants={listItem}>
            <Paper 
              sx={{ 
                p: 3, 
                bgcolor: 'background.paper',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 3,
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: `rgba(74,234,188,0.2)`,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      }
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                      {/* Icon with professional appearance */}
                <Box 
                  sx={{ 
                    bgcolor: 'rgba(74,234,188,0.1)',
                    borderRadius: '50%',
                    width: 42,
                    height: 42,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                          transition: 'background-color 0.3s ease'
                  }}
                >
                  <TrendingUpIcon sx={{ color: secondaryGreen, fontSize: 22 }} />
                </Box>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ mb: 0, fontWeight: 500 }}
                >
                  2. Smart Scanning
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Our system automatically identifies products and looks up typical expiry dates based on purchase date.
              </Typography>
            </Paper>
                </motion.div>
          </Grid>
          
          <Grid item xs={12} md={4}>
                <motion.div variants={listItem}>
            <Paper 
              sx={{ 
                p: 3, 
                bgcolor: 'background.paper',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 3,
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: `rgba(255,151,87,0.2)`,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      }
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                      {/* Notification icon with subtle pulse - reinforces expiry reminder theme */}
                <Box 
                  sx={{ 
                    bgcolor: 'rgba(255,151,87,0.1)',
                    borderRadius: '50%',
                    width: 42,
                    height: 42,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                          transition: 'background-color 0.3s ease'
                        }}
                      >
                        <NotificationsIcon 
                          sx={{ 
                            color: accentOrange, 
                            fontSize: 22,
                            animation: `${subtlePulse} 2s ease-in-out infinite`
                          }} 
                        />
                </Box>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ mb: 0, fontWeight: 500 }}
                >
                  3. Get Notified
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Receive timely reminders when your food is about to expire so you can use it before it's too late.
              </Typography>
            </Paper>
                </motion.div>
          </Grid>
        </Grid>
          </motion.div>
      </Box>
      </motion.div>
    </Box>
  );
};

export default HomePage;