import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Fade,
  Zoom,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Stack
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WarningIcon from '@mui/icons-material/Warning';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import ocrService from '../services/ocr';

// Custom animations
const pulseAnimation = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(117, 93, 255, 0.4); }
  70% { transform: scale(1.03); box-shadow: 0 0 0 10px rgba(117, 93, 255, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(117, 93, 255, 0); }
`;

const scanLine = keyframes`
  0% { top: 0%; }
  100% { top: 100%; }
`;

const glowEffect = keyframes`
  0% { box-shadow: 0 0 5px rgba(117, 93, 255, 0.4); }
  50% { box-shadow: 0 0 20px rgba(117, 93, 255, 0.7); }
  100% { box-shadow: 0 0 5px rgba(117, 93, 255, 0.4); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [dragActive, setDragActive] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [processedResults, setProcessedResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const cameraInputRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Colors
  const darkBg = '#1e2233';
  const cardBg = '#0f1424';
  const primaryPurple = '#755dff';
  const secondaryGreen = '#4aeabc';
  const accentOrange = '#ff9757';
  const textPrimary = '#ffffff';
  const textSecondary = 'rgba(255, 255, 255, 0.6)';

  // Food category options for dropdown
  const categoryOptions = [
    'Dairy', 
    'Meat', 
    'Produce', 
    'Bakery', 
    'Eggs', 
    'Seafood', 
    'Frozen', 
    'Packaged',
    'Pantry',
    'Other'
  ];

  // Reset success state after 5 seconds
  useEffect(() => {
    let timer;
    if (uploadComplete) {
      timer = setTimeout(() => setUploadComplete(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [uploadComplete]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadComplete(false);
      setMessage({ type: '', text: '' });
      
      // Create a preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
        setMessage({ type: 'error', text: 'Please select an image file.' });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a receipt image first!' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    setProcessedResults(null); // Clear previous results

    try {
      // Use the OCR service to process the receipt
      const result = await ocrService.processReceipt(file);
      
      console.log('OCR result:', result);
      
      if (result && result.items && result.items.length > 0) {
        setMessage({ 
          type: 'success', 
          text: `Receipt processed! ${result.items.length} items identified.` 
        });
        setUploadComplete(true);
        setProcessedResults(result);
        setShowResults(true); // Automatically show results
      } else {
        setMessage({ 
          type: 'warning', 
          text: 'Receipt processed but no items were detected. Try a clearer image.' 
        });
      }
    } catch (error) {
      console.error('Error processing receipt:', error);
      setMessage({ 
        type: 'error', 
        text: 'Error processing receipt: ' + (error.message || 'Unknown error') 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setUploadComplete(false);
      setMessage({ type: '', text: '' });
      
      if (droppedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(droppedFile);
      } else {
        setPreview(null);
        setMessage({ type: 'error', text: 'Please upload an image file.' });
      }
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    setMessage({ type: '', text: '' });
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Use the same code you already have for processing uploaded files
      setFile(file);
      setPreview(URL.createObjectURL(file));
      setUploadComplete(false);
      setMessage({ type: '', text: '' });
    }
  };

  // Function to open camera
  const openCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera
      });
      
      // Store stream for cleanup
      streamRef.current = stream;
      
      // Connect stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setMessage({ type: 'error', text: 'Camera access failed. Please try uploading a file instead.' });
      setIsCameraOpen(false);
      
      // Fallback to file input if camera fails
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      }
    }
  };

  // Function to capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to file
      canvas.toBlob((blob) => {
        const file = new File([blob], "receipt-photo.jpg", { type: "image/jpeg" });
        
        // Use existing file handling code
        setFile(file);
        setPreview(URL.createObjectURL(file));
        setUploadComplete(false);
        setMessage({ type: '', text: '' });
        
        // Close camera
        closeCamera();
      }, 'image/jpeg', 0.95);
    }
  };

  // Function to close camera
  const closeCamera = () => {
    setIsCameraOpen(false);
    
    // Stop all tracks in the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Function to handle view results button click
  const toggleResults = () => {
    if (processedResults) {
      setShowResults(prev => !prev);
    } else if (uploadComplete) {
      setMessage({ 
        type: 'error', 
        text: 'No results available. Please process the receipt again.' 
      });
    }
  };

  // Add this utility function inside your component
  const getExpiryColor = (expiryDays) => {
    if (!expiryDays && expiryDays !== 0) return textSecondary;
    const daysNum = parseInt(expiryDays, 10);
    if (isNaN(daysNum)) return textSecondary;
    
    if (daysNum <= 3) return '#ff5656'; // Red for soon expiring
    if (daysNum <= 7) return accentOrange; // Orange for medium term
    return secondaryGreen; // Green for long shelf life
  };

  const getExpiryText = (expiryDays, expiryDate) => {
    if ((!expiryDays && expiryDays !== 0) || !expiryDate) return 'Unknown expiry';
    const daysNum = parseInt(expiryDays, 10);
    if (isNaN(daysNum)) return 'Unknown expiry';
    
    let text = `${daysNum} days`;
    if (expiryDate) {
      const formattedDate = new Date(expiryDate).toLocaleDateString();
      text += ` (${formattedDate})`;
    }
    
    if (daysNum <= 0) {
      return `Expired: ${text}`;
    } else if (daysNum <= 3) {
      return `Expires soon: ${text}`;
    } else if (daysNum <= 7) {
      return `Use within: ${text}`;
    } else {
      return `Expires in: ${text}`;
    }
  };

  // New function to start editing an item
  const startEditing = (index) => {
    setEditingItem(index);
    // Copy the current values to edit
    setEditedValues({...processedResults.items[index]});
  };

  // New function to save edited item
  const saveEditedItem = (index) => {
    if (processedResults && processedResults.items) {
      // Create a deep copy of processedResults
      const updatedResults = {
        ...processedResults,
        items: [...processedResults.items]
      };
      
      // Replace the item with edited values
      updatedResults.items[index] = {...editedValues};
      
      // Update the results
      setProcessedResults(updatedResults);
      setEditingItem(null);
      setEditedValues({});
      
      setMessage({
        type: 'success',
        text: 'Item updated successfully!'
      });
    }
  };

  // New function to cancel editing
  const cancelEditing = () => {
    setEditingItem(null);
    setEditedValues({});
  };

  // Handle changes to edited values
  const handleEditChange = (field, value) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate expiry date when expiryDays changes
  useEffect(() => {
    if (editingItem !== null && editedValues.expiryDays !== undefined) {
      // Calculate new expiry date based on expiryDays
      const purchaseDate = processedResults.date ? new Date(processedResults.date) : new Date();
      const expiryDate = new Date(purchaseDate);
      expiryDate.setDate(expiryDate.getDate() + parseInt(editedValues.expiryDays, 10));
      
      setEditedValues(prev => ({
        ...prev,
        expiryDate: expiryDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
      }));
    }
  }, [editedValues.expiryDays, editingItem, processedResults?.date]);

  // Replace the handleExpiryDateChange function with a simpler version that works with regular inputs
  const handleExpiryDateChange = (event) => {
    if (editingItem !== null && event.target.value && processedResults.date) {
      const newExpiryDate = new Date(event.target.value);
      const purchaseDate = new Date(processedResults.date);
      
      // Calculate days between purchase date and new expiry date
      const diffTime = Math.abs(newExpiryDate - purchaseDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setEditedValues(prev => ({
        ...prev,
        expiryDays: diffDays,
        expiryDate: event.target.value // Format already in YYYY-MM-DD
      }));
    }
  };

  // Add an item manually
  const addManualItem = () => {
    if (!processedResults) {
      setProcessedResults({
        store: "Manual Entry",
        date: new Date(),
        items: []
      });
    }
    
    const newItem = {
      name: "New Item",
      category: "Other",
      quantity: null,
      price: null,
      expiryDays: 7,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    const updatedResults = {
      ...processedResults,
      items: [...(processedResults.items || []), newItem]
    };
    
    setProcessedResults(updatedResults);
    startEditing(updatedResults.items.length - 1);
  };

  // Delete an item
  const deleteItem = (index) => {
    if (processedResults && processedResults.items) {
      const updatedResults = {
        ...processedResults,
        items: processedResults.items.filter((_, i) => i !== index)
      };
      
      setProcessedResults(updatedResults);
      setMessage({
        type: 'info',
        text: 'Item removed'
      });
    }
  };

  // Add this function to recalculate expiry dates when purchase date changes
  const recalculateExpiryDates = (newPurchaseDate) => {
    if (!processedResults || !processedResults.items) return;
    
    const updatedResults = {
      ...processedResults,
      date: newPurchaseDate,
      items: processedResults.items.map(item => {
        if (item.expiryDays) {
          const newExpiryDate = new Date(newPurchaseDate);
          newExpiryDate.setDate(newExpiryDate.getDate() + parseInt(item.expiryDays, 10));
          return {
            ...item,
            expiryDate: newExpiryDate.toISOString().split('T')[0]
          };
        }
        return item;
      })
    };
    
    setProcessedResults(updatedResults);
    setMessage({
      type: 'info',
      text: 'Purchase date updated. All expiry dates recalculated.'
    });
  };

  return (
    <Box 
      sx={{ 
        width: '100%', 
        maxWidth: '600px',
        mx: 'auto', 
        p: 2, 
        bgcolor: darkBg,
        borderRadius: 4,
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
      }}
    >
      {/* Header - with fixed spacing and alignment */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        px: 1 // Add some horizontal padding
      }}>
        <Typography 
          variant="h5" 
          component="h2"
          sx={{ 
            color: textPrimary, 
            fontWeight: 500,
            fontSize: '1.3rem'
          }}
        >
          Scan Receipt
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            bgcolor: 'rgba(255,255,255,0.05)',
            borderRadius: 2,
            px: 1.5,
            py: 0.7 // Increase vertical padding slightly
          }}
        >
          <Box 
            sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              bgcolor: secondaryGreen 
            }}
          />
          <Typography 
            variant="body2" 
            sx={{ 
              color: textSecondary,
              fontSize: '0.75rem',
              fontWeight: 500 // Add some weight to make it more legible
            }}
          >
            Ready to scan
          </Typography>
        </Box>
      </Box>
      
      {/* Main upload area */}
      <Paper
        elevation={0}
        component="label"
        htmlFor="receipt-upload"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 3,
          p: 3,
          mb: 2,
          minHeight: '220px',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: cardBg,
          border: `1px solid ${dragActive ? primaryPurple : 'rgba(255,255,255,0.1)'}`,
          transition: 'all 0.3s ease',
          ...(dragActive && {
            animation: `${glowEffect} 1.5s infinite`
          })
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Loading scan line effect */}
        {loading && (
          <Box 
            sx={{
              position: 'absolute',
              height: '2px',
              width: '100%',
              background: `linear-gradient(90deg, ${cardBg}, ${primaryPurple}, ${cardBg})`,
              backgroundSize: '200% 100%',
              animation: `${scanLine} 1.5s infinite ease-in-out`,
              zIndex: 2
            }}
          />
        )}
        
        {preview ? (
          <Fade in={true}>
            <Box 
              component={motion.div}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              sx={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {/* Close button to clear selection */}
              <IconButton
                size="small"
                onClick={clearFile}
                sx={{
                  position: 'absolute',
                  top: -12,
                  right: -12,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  zIndex: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
              
              {/* Receipt preview with enhanced animations */}
              <Box 
                component="img"
                src={preview}
                alt="Receipt preview"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain',
                  borderRadius: 2,
                  filter: loading 
                    ? 'brightness(0.7) contrast(1.1)' 
                    : 'brightness(0.85)',
                  transition: 'all 0.5s ease',
                  animation: `${fadeInUp} 0.5s ease-out`,
                  ...(loading && {
                    boxShadow: '0 0 8px rgba(117,93,255,0.5)'
                  })
                }}
              />
              
              {/* Success overlay with enhanced animations */}
              {uploadComplete && (
                <Zoom in={uploadComplete}>
                  <Box 
                    component={motion.div}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      bgcolor: 'rgba(0,0,0,0.7)',
                      borderRadius: '50%',
                      p: 1.5,
                      animation: `${pulseAnimation} 2s infinite`,
                    }}
                  >
                    <CheckCircleIcon 
                      sx={{ 
                        fontSize: 50,
                        color: secondaryGreen
                      }}
                    />
                  </Box>
                </Zoom>
              )}
            </Box>
          </Fade>
        ) : (
          <Box
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              animation: `${fadeInUp} 0.5s ease-out`
            }}
          >
            <Box 
              sx={{ 
                p: 2.5, 
                borderRadius: '50%', 
                bgcolor: 'rgba(117,93,255,0.1)',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ReceiptLongIcon 
                sx={{ 
                  fontSize: 40, 
                  color: primaryPurple
                }} 
              />
            </Box>
            
            <Typography 
              variant="body1" 
              align="center" 
              sx={{ 
                color: textPrimary,
                fontWeight: 500,
                mb: 1
              }}
            >
              {dragActive ? 'Drop to Upload' : 'Upload Receipt'}
            </Typography>
            
            <Typography 
              variant="body2" 
              align="center"
              sx={{ 
                color: textSecondary,
                fontSize: '0.75rem',
                maxWidth: '80%'
              }}
            >
              Drag & drop or click to browse
            </Typography>
          </Box>
        )}
        
        <input
          id="receipt-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </Paper>
      
      {/* Mobile upload options */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          mb: 3
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          startIcon={<CameraAltIcon />}
          onClick={() => {
            // Try advanced camera first, fallback to simple input
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
              openCamera();
            } else if (cameraInputRef.current) {
              cameraInputRef.current.click();
            }
          }}
          component={motion.button}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          sx={{
            width: '40%',
            bgcolor: secondaryGreen,
            color: cardBg,
            fontWeight: 500,
            textTransform: 'none',
            borderRadius: 2,
            py: 1,
            boxShadow: '0 2px 8px rgba(74,234,188,0.2)',
            '&:hover': {
              bgcolor: '#5ff1ce',
              boxShadow: '0 4px 12px rgba(74,234,188,0.3)',
            }
          }}
        >
          Take Photo
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading || (!file && !uploadComplete)}
          onClick={uploadComplete ? toggleResults : handleUpload}
          component={motion.button}
          whileHover={!loading && (file || uploadComplete) ? { scale: 1.03 } : {}}
          whileTap={!loading && (file || uploadComplete) ? { scale: 0.97 } : {}}
          sx={{
            width: '60%',
            bgcolor: primaryPurple,
            color: textPrimary,
            textTransform: 'none',
            borderRadius: 2,
            py: 1,
            fontWeight: 500,
            '&:hover': {
              bgcolor: '#8672ff'
            },
            '&:disabled': {
              bgcolor: 'rgba(117,93,255,0.2)',
              color: 'rgba(255,255,255,0.3)'
            },
            ...(loading && {
              background: `linear-gradient(90deg, ${primaryPurple}, #8672ff, ${primaryPurple})`,
              backgroundSize: '200% 100%',
              animation: `${shimmer} 1.5s infinite linear`
            })
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={16} sx={{ color: 'white', mr: 1 }} />
              Scanning...
            </Box>
          ) : uploadComplete ? (
            showResults ? 'Hide Results' : 'View Results'
          ) : (
            'Process Receipt'
          )}
        </Button>
      </Box>
      
      {/* Status card */}
      <Box
        sx={{
          bgcolor: cardBg,
          borderRadius: 3,
          p: 2,
          mb: 2
        }}
      >
        <Typography 
          variant="body2"
          sx={{ 
            color: textSecondary,
            fontSize: '0.75rem',
            mb: 1
          }}
        >
          STATUS
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              bgcolor: loading 
                ? primaryPurple 
                : uploadComplete 
                  ? secondaryGreen 
                  : file 
                    ? accentOrange 
                    : 'rgba(255,255,255,0.3)',
              mr: 1.5
            }}
          />
          <Typography 
            variant="body1"
            sx={{ 
              color: textPrimary,
              fontWeight: 500
            }}
          >
            {loading 
              ? 'Processing Receipt...' 
              : uploadComplete 
                ? 'Ready to Track' 
                : file 
                  ? 'Ready to Process' 
                  : 'Waiting for Receipt'}
          </Typography>
        </Box>
      </Box>
      
      {/* Message alert */}
      {message.text && (
        <Fade in={!!message.text}>
          <Alert 
            severity={message.type} 
            icon={false}
            sx={{ 
              mb: 2, 
              borderRadius: 2,
              bgcolor: message.type === 'success' 
                ? 'rgba(74, 234, 188, 0.1)' 
                : message.type === 'warning' 
                  ? 'rgba(255, 255, 0, 0.1)' 
                  : 'rgba(255, 86, 86, 0.1)',
              color: message.type === 'success' 
                ? secondaryGreen 
                : message.type === 'warning' 
                  ? accentOrange 
                  : '#ff5656',
              border: '1px solid',
              borderColor: message.type === 'success' 
                ? 'rgba(74, 234, 188, 0.2)' 
                : message.type === 'warning' 
                  ? 'rgba(255, 255, 0, 0.2)' 
                  : 'rgba(255, 86, 86, 0.2)',
            }}
          >
            {message.text}
          </Alert>
        </Fade>
      )}
      
      {/* Feature hints */}
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
        <Box 
          sx={{ 
            textAlign: 'center',
            opacity: 0.7,
            transition: 'opacity 0.2s',
            '&:hover': { opacity: 1 }
          }}
        >
          <Box 
            sx={{ 
              mb: 0.5, 
              width: 36, 
              height: 36, 
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto'
            }}
          >
            <Typography sx={{ color: primaryPurple, fontWeight: 'bold' }}>1</Typography>
          </Box>
          <Typography 
            variant="caption" 
            sx={{ 
              color: textSecondary,
              fontSize: '0.7rem'
            }}
          >
            Upload
          </Typography>
        </Box>
        
        <Box 
          sx={{ 
            textAlign: 'center',
            opacity: file ? 0.7 : 0.4,
            transition: 'opacity 0.2s',
            '&:hover': { opacity: file ? 1 : 0.4 }
          }}
        >
          <Box 
            sx={{ 
              mb: 0.5, 
              width: 36, 
              height: 36, 
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto'
            }}
          >
            <Typography sx={{ color: primaryPurple, fontWeight: 'bold' }}>2</Typography>
          </Box>
          <Typography 
            variant="caption" 
            sx={{ 
              color: textSecondary,
              fontSize: '0.7rem'
            }}
          >
            Process
          </Typography>
        </Box>
        
        <Box 
          sx={{ 
            textAlign: 'center',
            opacity: uploadComplete ? 0.7 : 0.4,
            transition: 'opacity 0.2s',
            '&:hover': { opacity: uploadComplete ? 1 : 0.4 }
          }}
        >
          <Box 
            sx={{ 
              mb: 0.5, 
              width: 36, 
              height: 36, 
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto'
            }}
          >
            <Typography sx={{ color: primaryPurple, fontWeight: 'bold' }}>3</Typography>
          </Box>
          <Typography 
            variant="caption" 
            sx={{ 
              color: textSecondary,
              fontSize: '0.7rem'
            }}
          >
            Track
          </Typography>
        </Box>
      </Box>
      
      {/* Camera capture fallback for mobile */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        id="camera-capture"
        style={{ display: 'none' }}
        onChange={handleCameraCapture}
        ref={cameraInputRef}
      />
      
      {/* Camera UI */}
      {isCameraOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'background.paper',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 2
          }}
        >
          <Box sx={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 8 }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="error"
              onClick={closeCamera}
              sx={{ flex: 1, maxWidth: 150 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={capturePhoto}
              sx={{ flex: 1, maxWidth: 150 }}
            >
              Capture
            </Button>
          </Box>
          
          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </Box>
      )}
      
      {/* RESULTS DISPLAY SECTION */}
      {showResults && processedResults && (
        <Box 
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          sx={{ 
            mt: 3, 
            p: 2, 
            bgcolor: cardBg,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            maxHeight: '500px',
            overflow: 'auto'
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: textPrimary, 
              fontSize: '1rem', 
              mb: 2, 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ReceiptLongIcon sx={{ mr: 1, fontSize: '1.2rem', color: primaryPurple }} />
              <span>Processing Results</span>
            </Box>
            <Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddShoppingCartIcon />}
                onClick={addManualItem}
                sx={{ 
                  mr: 1,
                  borderColor: secondaryGreen,
                  color: secondaryGreen,
                  textTransform: 'none',
                  fontSize: '0.7rem'
                }}
              >
                Add Item
              </Button>
              <IconButton 
                size="small" 
                onClick={() => setShowResults(false)}
                sx={{ color: textSecondary }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Typography>
          
          {/* Receipt Information with Edit Options */}
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ color: primaryPurple, mb: 1 }}
            >
              Receipt Information:
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 1 }}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AddShoppingCartIcon sx={{ fontSize: '0.9rem', mr: 0.5, color: textSecondary }} />
                  <Typography variant="body2" sx={{ color: textSecondary }}>
                    Store: {processedResults.store || 'Unknown Store'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarTodayIcon sx={{ fontSize: '0.9rem', mr: 0.5, color: textSecondary }} />
                    <Typography variant="body2" sx={{ color: textSecondary, mr: 1 }}>
                      Purchase Date:
                    </Typography>
                  </Box>
                  
                  {/* Editable purchase date */}
                  <TextField
                    type="date"
                    size="small"
                    value={processedResults.date ? new Date(processedResults.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      // Update the purchase date
                      const newDate = new Date(e.target.value);
                      const updatedResults = {
                        ...processedResults,
                        date: newDate
                      };
                      
                      // Recalculate all expiry dates based on new purchase date
                      if (updatedResults.items && updatedResults.items.length > 0) {
                        updatedResults.items = updatedResults.items.map(item => {
                          if (item.expiryDays) {
                            const newExpiryDate = new Date(newDate);
                            newExpiryDate.setDate(newExpiryDate.getDate() + parseInt(item.expiryDays, 10));
                            return {
                              ...item,
                              expiryDate: newExpiryDate.toISOString().split('T')[0]
                            };
                          }
                          return item;
                        });
                      }
                      
                      setProcessedResults(updatedResults);
                      setMessage({
                        type: 'info',
                        text: 'Purchase date updated. All expiry dates recalculated.'
                      });
                    }}
                    InputProps={{
                      sx: { 
                        color: textPrimary,
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: primaryPurple },
                        fontSize: '0.8rem',
                      }
                    }}
                    sx={{ maxWidth: '150px' }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
          
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 1.5 }} />
          
          <Typography 
            variant="subtitle2" 
            sx={{ color: primaryPurple, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>Items with Expiry Estimates:</span>
          </Typography>
          
          {processedResults.items && processedResults.items.length > 0 ? (
            <List sx={{ p: 0 }}>
              {processedResults.items.map((item, index) => (
                <React.Fragment key={index}>
                  {editingItem === index ? (
                    // Editing mode
                    <ListItem
                      sx={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        px: 2,
                        py: 2,
                        bgcolor: 'rgba(0,0,0,0.2)',
                        borderRadius: 2,
                        mb: 2,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ color: primaryPurple, mb: 2 }}>
                        Edit Item
                      </Typography>
                      
                      <Grid container spacing={2} sx={{ width: '100%' }}>
                        <Grid item xs={12}>
                          <TextField
                            label="Item Name"
                            value={editedValues.name || ''}
                            onChange={(e) => handleEditChange('name', e.target.value)}
                            fullWidth
                            size="small"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: textPrimary,
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                '&:hover fieldset': { borderColor: primaryPurple },
                              },
                              '& .MuiInputLabel-root': { color: textSecondary },
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={6}>
                          <FormControl fullWidth size="small">
                            <InputLabel sx={{ color: textSecondary }}>Item Type</InputLabel>
                            <Select
                              value={editedValues.isPerishable === false ? "non-perishable" : "perishable"}
                              onChange={(e) => {
                                if (e.target.value === "non-perishable") {
                                  setEditedValues(prev => ({
                                    ...prev,
                                    isPerishable: false,
                                    expiryDays: null,
                                    expiryDate: null
                                  }));
                                } else {
                                  // If changing from non-perishable to perishable, setup default expiry
                                  const purchaseDate = processedResults.date ? new Date(processedResults.date) : new Date();
                                  const expiryDate = new Date(purchaseDate);
                                  expiryDate.setDate(expiryDate.getDate() + 7); // Default 7 days
                                  
                                  setEditedValues(prev => ({
                                    ...prev,
                                    isPerishable: true,
                                    expiryDays: 7,
                                    expiryDate: expiryDate.toISOString().split('T')[0]
                                  }));
                                }
                              }}
                              sx={{
                                color: textPrimary,
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: primaryPurple },
                              }}
                            >
                              <MenuItem value="perishable">Perishable</MenuItem>
                              <MenuItem value="non-perishable">Non-perishable</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        
                        <Grid item xs={6}>
                          <TextField
                            label="Quantity"
                            value={editedValues.quantity || ''}
                            onChange={(e) => handleEditChange('quantity', e.target.value)}
                            fullWidth
                            size="small"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: textPrimary,
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                '&:hover fieldset': { borderColor: primaryPurple },
                              },
                              '& .MuiInputLabel-root': { color: textSecondary },
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={6}>
                          <TextField
                            label="Price"
                            value={editedValues.price || ''}
                            onChange={(e) => handleEditChange('price', e.target.value)}
                            fullWidth
                            size="small"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: textPrimary,
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                '&:hover fieldset': { borderColor: primaryPurple },
                              },
                              '& .MuiInputLabel-root': { color: textSecondary },
                            }}
                          />
                        </Grid>
                        
                        {/* Only show expiry inputs for perishable items */}
                        {editedValues.isPerishable !== false && (
                          <>
                            <Grid item xs={6}>
                              <TextField
                                label="Expiry Days"
                                type="number"
                                value={editedValues.expiryDays || ''}
                                onChange={(e) => handleEditChange('expiryDays', e.target.value)}
                                fullWidth
                                size="small"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    color: textPrimary,
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                    '&:hover fieldset': { borderColor: primaryPurple },
                                  },
                                  '& .MuiInputLabel-root': { color: textSecondary },
                                }}
                              />
                            </Grid>
                            
                            <Grid item xs={12}>
                              <TextField
                                label="Expiry Date"
                                type="date"
                                value={editedValues.expiryDate || ''}
                                onChange={handleExpiryDateChange}
                                fullWidth
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    color: textPrimary,
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                    '&:hover fieldset': { borderColor: primaryPurple },
                                  },
                                  '& .MuiInputLabel-root': { color: textSecondary },
                                }}
                              />
                            </Grid>
                          </>
                        )}
                      </Grid>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 2 }}>
                        <Button
                          size="small"
                          onClick={cancelEditing}
                          sx={{ color: textSecondary, mr: 1 }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={<SaveIcon />}
                          onClick={() => saveEditedItem(index)}
                          sx={{ bgcolor: primaryPurple }}
                        >
                          Save
                        </Button>
                      </Box>
                    </ListItem>
                  ) : (
                    // Display mode
                    <ListItem 
                      sx={{ 
                        flexDirection: 'column', 
                        alignItems: 'flex-start',
                        px: 1,
                        py: 1.5,
                        borderBottom: index < processedResults.items.length - 1 ? 
                          '1px solid rgba(255,255,255,0.05)' : 'none',
                        position: 'relative'
                      }}
                    >
                      <Box sx={{ 
                        position: 'absolute', 
                        right: 0, 
                        top: 0,
                        display: 'flex'
                      }}>
                        <IconButton 
                          size="small" 
                          onClick={() => startEditing(index)}
                          sx={{ color: secondaryGreen }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => deleteItem(index)}
                          sx={{ color: '#ff5656' }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: textPrimary, 
                          fontWeight: 500,
                          mb: 0.5,
                          pr: 6 // Make room for edit buttons
                        }}
                      >
                        {item.name}
                        {item.category && (
                          <Typography 
                            component="span" 
                            sx={{ 
                              ml: 1,
                              color: primaryPurple,
                              fontSize: '0.7rem',
                              bgcolor: 'rgba(117,93,255,0.1)',
                              px: 1,
                              py: 0.2,
                              borderRadius: 1
                            }}
                          >
                            {item.category}
                          </Typography>
                        )}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {item.quantity && item.quantity !== 'null' && (
                          <Typography 
                            variant="caption" 
                            sx={{ color: secondaryGreen }}
                          >
                            Quantity: {item.quantity}
                          </Typography>
                        )}
                        
                        {item.price && item.price !== 'null' && (
                          <Typography 
                            variant="caption" 
                            sx={{ color: accentOrange }}
                          >
                            Price: ${item.price}
                          </Typography>
                        )}
                      </Box>
                      
                      {/* Expiry information - if present display it, if not show a button to add it */}
                      {item.isPerishable === false ? (
                        <Box 
                          sx={{ 
                            mt: 1,
                            display: 'flex',
                            alignItems: 'center',
                            px: 1.5,
                            py: 0.75,
                            borderRadius: 1.5,
                            bgcolor: 'rgba(0,0,0,0.2)',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}
                        >
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: textSecondary,
                              fontStyle: 'italic'
                            }}
                          >
                            Non-perishable item
                          </Typography>
                        </Box>
                      ) : item.expiryDays ? (
                        <Box 
                          sx={{ 
                            mt: 1,
                            display: 'flex',
                            alignItems: 'center',
                            px: 1.5,
                            py: 0.75,
                            borderRadius: 1.5,
                            bgcolor: 'rgba(0,0,0,0.2)',
                            border: '1px solid',
                            borderColor: getExpiryColor(item.expiryDays, 'rgba(255,255,255,0.1)')
                          }}
                        >
                          {parseInt(item.expiryDays, 10) <= 3 && (
                            <WarningIcon 
                              sx={{ 
                                fontSize: '0.9rem', 
                                mr: 0.5, 
                                color: '#ff5656' 
                              }} 
                            />
                          )}
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: getExpiryColor(item.expiryDays),
                              fontWeight: parseInt(item.expiryDays, 10) <= 3 ? 'bold' : 'normal'
                            }}
                          >
                            {getExpiryText(item.expiryDays, item.expiryDate)}
                          </Typography>
                        </Box>
                      ) : (
                        <Button
                          variant="text"
                          size="small"
                          startIcon={<CalendarTodayIcon fontSize="small" />}
                          onClick={() => {
                            // Add default expiry info and then edit
                            const updatedResults = {
                              ...processedResults,
                              items: [...processedResults.items]
                            };
                            
                            // First check if it might be non-perishable based on category
                            const nonPerishableCategories = ['toiletries', 'household', 'cleaning', 'paper', 'non-food'];
                            const isLikelyNonPerishable = item.category && 
                              nonPerishableCategories.some(cat => 
                                item.category.toLowerCase().includes(cat));
                            
                            if (isLikelyNonPerishable) {
                              // Mark as non-perishable
                              updatedResults.items[index] = {
                                ...item,
                                isPerishable: false
                              };
                              
                              setProcessedResults(updatedResults);
                              setMessage({
                                type: 'info',
                                text: 'Item marked as non-perishable'
                              });
                            } else {
                              // Add default expiry based on category (if present)
                              let defaultExpiryDays = 7; // Default for unknown
                              if (item.category) {
                                switch(item.category.toLowerCase()) {
                                  case 'dairy': defaultExpiryDays = 7; break;
                                  case 'meat': defaultExpiryDays = 3; break;
                                  case 'produce': defaultExpiryDays = 5; break;
                                  case 'bakery': defaultExpiryDays = 4; break;
                                  case 'eggs': defaultExpiryDays = 21; break;
                                  case 'seafood': defaultExpiryDays = 2; break;
                                  case 'frozen': defaultExpiryDays = 90; break;
                                  case 'packaged': defaultExpiryDays = 180; break;
                                  case 'pantry': defaultExpiryDays = 365; break;
                                  default: defaultExpiryDays = 7;
                                }
                              }
                              
                              // Calculate expiry date based on purchase date
                              const purchaseDate = processedResults.date ? new Date(processedResults.date) : new Date();
                              const expiryDate = new Date(purchaseDate);
                              expiryDate.setDate(expiryDate.getDate() + defaultExpiryDays);
                              
                              // Update the item with expiry info
                              updatedResults.items[index] = {
                                ...item,
                                isPerishable: true,
                                expiryDays: defaultExpiryDays,
                                expiryDate: expiryDate.toISOString().split('T')[0]
                              };
                              
                              setProcessedResults(updatedResults);
                              startEditing(index); // Open in edit mode
                            }
                          }}
                          sx={{
                            mt: 1,
                            color: primaryPurple,
                            textTransform: 'none',
                            fontSize: '0.7rem',
                            p: 0,
                            '&:hover': {
                              backgroundColor: 'transparent',
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          {item.category && (item.category.toLowerCase().includes('toilet') || 
                           item.category.toLowerCase().includes('paper') || 
                           item.category.toLowerCase().includes('cleaning')) ? 
                            'Mark as non-perishable' : 'Add expiry information'}
                        </Button>
                      )}
                    </ListItem>
                  )}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography 
              variant="body2" 
              sx={{ color: textSecondary, fontStyle: 'italic', mt: 1 }}
            >
              No food items were detected in the receipt.
            </Typography>
          )}
          
          {/* Summary stats for expiry tracking */}
          {processedResults.items && processedResults.items.length > 0 && (
            <Box sx={{ mt: 2, p: 1.5, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ color: primaryPurple, mb: 1 }}>
                Expiry Summary:
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Typography variant="caption" sx={{ color: '#ff5656', mr: 1 }}>
                  Soon (≤ 3 days): {
                    processedResults.items.filter(
                      item => item.expiryDays && parseInt(item.expiryDays, 10) <= 3
                    ).length
                  }
                </Typography>
                
                <Typography variant="caption" sx={{ color: accentOrange, mr: 1 }}>
                  Medium (4-7 days): {
                    processedResults.items.filter(
                      item => item.expiryDays && 
                      parseInt(item.expiryDays, 10) > 3 && 
                      parseInt(item.expiryDays, 10) <= 7
                    ).length
                  }
                </Typography>
                <Typography variant="caption" sx={{ color: secondaryGreen, mr: 1 }}>
                  Long (&gt;7 days): {
                    processedResults.items.filter(
                      item => item.expiryDays && parseInt(item.expiryDays, 10) > 7
                    ).length
                  }
                </Typography>
                
                <Typography variant="caption" sx={{ color: textSecondary }}>
                  Non-perishable: {
                    processedResults.items.filter(
                      item => item.isPerishable === false
                    ).length
                  }
                </Typography>
              </Box>
            </Box>
          )}
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                console.log('OCR Results:', processedResults);
                setMessage({
                  type: 'info',
                  text: 'Full OCR results logged to console. Press F12 to view.'
                });
              }}
              sx={{ 
                borderColor: 'rgba(255,255,255,0.2)', 
                color: textSecondary,
                textTransform: 'none',
                fontSize: '0.7rem'
              }}
            >
              Log Full Results to Console
            </Button>
            
            <Button
              variant="contained"
              size="small"
              color="secondary"
              sx={{ 
                textTransform: 'none',
                fontSize: '0.7rem',
                bgcolor: secondaryGreen,
                color: cardBg,
              }}
            >
              Save to Dashboard
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;