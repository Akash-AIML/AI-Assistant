"use client";
import React, { useState, useRef, useEffect } from "react";
// Material UI imports
import { 
  TextField, Button, Paper, Avatar, Card, CardHeader, 
  CardContent, Typography, Chip, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Box,
  AppBar, Toolbar, Container, Grid, IconButton, Divider,
  Zoom, Fade, useMediaQuery, useTheme as useMuiTheme
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Enhanced theme with more customization
const theme = createTheme({
  palette: {
    primary: {
      lightest: '#f0f1fe', // Very light indigo for hover effects
      light: '#818cf8',
      main: '#6366f1', // Base indigo color
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#c084fc',
      main: '#a855f7', // Purple color
      dark: '#9333ea',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    success: {
      main: '#10b981',
    },
    error: {
      main: '#ef4444',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      700: '#374151',
      900: '#111827',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
    },
    subtitle1: {
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '9999px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 18px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px 0 rgba(99, 102, 241, 0.25)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
          '&:hover': {
            background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '9999px',
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#6366f1',
              borderWidth: '2px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#818cf8',
            },
          },
          '& .MuiInputBase-input': {
            padding: '12px 16px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          borderRadius: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        },
        elevation1: {
          boxShadow: '0 2px 5px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.07)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
        outlinedPrimary: {
          borderColor: '#d1d5ff',
          color: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.04)',
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8fafc',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#4b5563',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: '8px 0',
        },
      },
    },
  },
});

const ChatBox = () => {
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState(true);
    const [typedText, setTypedText] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const greetingMessage = "👋 Hello! I'm your BitBot Grouping Point assistant. How can I help you today?";
    const suggestions = [
      {text: "List All Students By Departments", icon: <SchoolIcon fontSize="small" />},
      {text: "Show the Group of this roll no.", icon: <PersonIcon fontSize="small" />},
      {text: "List the Students By Group", icon: <CheckCircleOutlineIcon fontSize="small" />},
      {text: "Fetch By Name", icon: <CodeIcon fontSize="small" />}
    ];

    // Typing effect for greeting message
    useEffect(() => {
        if (typing && typedText.length < greetingMessage.length) {
            const timeout = setTimeout(() => {
                setTypedText(greetingMessage.slice(0, typedText.length + 1));
            }, 40);
            return () => clearTimeout(timeout);
        } else if (typing && typedText.length === greetingMessage.length) {
            setTyping(false);
            setMessages([{ text: greetingMessage, sender: "ai" }]);
        }
    }, [typedText, typing]);

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSuggestionClick = (text) => {
        setMessage(text);
        inputRef.current?.focus();
    };

    const handleSendMessage = async () => {
        if (message.trim() === "") return;

        // Add user message with animation
        setMessages(prev => [...prev, { text: message, sender: "user", isNew: true }]);
        setMessage("");

        try {
            // Show typing indicator for AI with animation
            setTimeout(() => {
                setMessages(prev => [...prev.map(m => ({...m, isNew: false})), { text: "...", sender: "ai", isTyping: true, isNew: true }]);
            }, 300);
            
            const response = await fetch("/api", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) throw new Error("Server error");

            const data = await response.json();
            
            // Remove typing indicator
            setTimeout(() => {
                setMessages(prev => {
                    const withoutTyping = prev.filter(msg => !msg.isTyping);
                    
                    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                        // Add table data with animation
                        return [...withoutTyping.map(m => ({...m, isNew: false})), { 
                            sender: "ai", 
                            isTable: true, 
                            tableData: data.data,
                            isNew: true
                        }];
                    } else if (data.message) {
                        return [...withoutTyping.map(m => ({...m, isNew: false})), { text: data.message, sender: "ai", isNew: true }];
                    } else {
                        return [...withoutTyping.map(m => ({...m, isNew: false})), { text: "No results found.", sender: "ai", isNew: true }];
                    }
                });
            }, 1000);
        } catch (error) {
            // Remove typing indicator in case of error
            setTimeout(() => {
                setMessages(prev => {
                    const withoutTyping = prev.filter(msg => !msg.isTyping);
                    return [...withoutTyping.map(m => ({...m, isNew: false})), { text: "Failed to fetch data.", sender: "ai", isNew: true }];
                });
            }, 300);
            
            console.error("Error sending message:", error);
        }
    };

    // Clear "isNew" flag after animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setMessages(prev => prev.map(m => ({...m, isNew: false})));
        }, 500);
        return () => clearTimeout(timer);
    }, [messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ 
                maxHeight: '100vh', 
                height: '100vh',
                display: 'flex', 
                flexDirection: 'column', 
                bgcolor: '#f8fafc', 
                overflow: 'hidden',
                position: 'relative'
            }}>
                {/* MUI AppBar for header */}
                <AppBar position="static" sx={{ 
                    backgroundImage: 'linear-gradient(135deg, #6366f1, #8b5cf6, #9333ea)',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)',
                    borderRadius: {xs: 0, sm: '0 0 20px 20px'},
                    mx: {xs: 0, sm: 3, md: 5},
                    position: 'relative',
                    zIndex: 10,
                }}>
                    <Toolbar>
                        <Container maxWidth="lg" sx={{ py: 1 }}>
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'row', 
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ 
                                        bgcolor: 'white', 
                                        mr: 2,
                                        width: 48, 
                                        height: 48,
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        border: '2px solid rgba(255,255,255,0.8)'
                                    }}>
                                        <SmartToyIcon color="primary" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h5" component="h1" sx={{ 
                                            fontWeight: 'bold',
                                            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                            letterSpacing: '-0.5px'
                                        }}>
                                            Bit Bot
                                        </Typography>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                Grouping Assistant
                                            </Typography>
                                            <Box 
                                                sx={{ 
                                                    display: 'inline-flex', 
                                                    ml: 1,
                                                    alignItems: 'center',
                                                    bgcolor: 'rgba(255,255,255,0.2)', 
                                                    borderRadius: 10, 
                                                    px: 1, 
                                                    py: 0.3
                                                }}
                                            >
                                                <Box 
                                                    sx={{ 
                                                        width: 6, 
                                                        height: 6, 
                                                        borderRadius: '50%', 
                                                        bgcolor: '#10b981',
                                                        mr: 0.5,
                                                        boxShadow: '0 0 5px rgba(16, 185, 129, 0.7)'
                                                    }} 
                                                />
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ color: 'white', fontWeight: 'medium' }}
                                                >
                                                    Online
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                                
                                <IconButton 
                                    sx={{ 
                                        color: 'white', 
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.2)'
                                        }
                                    }}
                                    onClick={toggleMenu}
                                >
                                    {menuOpen ? <CloseIcon /> : <MenuIcon />}
                                </IconButton>
                            </Box>
                        </Container>
                    </Toolbar>
                    
                    {/* Slide down menu */}
                    <Box 
                        sx={{ 
                            height: menuOpen ? 'auto' : 0,
                            overflow: 'hidden',
                            transition: 'height 0.3s ease-in-out',
                            pb: menuOpen ? 2 : 0
                        }}
                    >
                        <Container maxWidth="lg">
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                                Ask me anything about Your Grouping Point Data.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Chip
                                    icon={<CodeIcon sx={{ color: 'white !important' }} />}
                                    label="Learning Path"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.2)'
                                        }
                                    }}
                                    onClick={() => handleSuggestionClick("Show learning path")}
                                />
                                <Chip
                                    icon={<SchoolIcon sx={{ color: 'white !important' }} />}
                                    label="Course List"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.2)'
                                        }
                                    }}
                                    onClick={() => handleSuggestionClick("List all courses")}
                                />
                            </Box>
                        </Container>
                    </Box>
                </AppBar>
                
                {/* Background pattern */}
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100%',
                    background: 'radial-gradient(circle at 30% 10%, rgba(99, 102, 241, 0.05) 0%, rgba(0,0,0,0) 60%), radial-gradient(circle at 80% 30%, rgba(139, 92, 246, 0.05) 0%, rgba(0,0,0,0) 50%)',
                    zIndex: 0,
                    pointerEvents: 'none'
                }} />
                
                {/* Chat messages area - scrollable */}
                <Box
                    sx={{
                        flexGrow: 1,
                        overflow: 'auto',
                        py: 3,
                        px: {xs: 1, sm: 2},
                        position: 'relative',
                        zIndex: 1,
                        bgcolor: 'transparent',
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23e5e7eb\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
                        backgroundAttachment: 'fixed'
                    }}
                >
                    <Container maxWidth="lg">
                        {/* Date separator */}
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            mb: 3
                        }}>
                            <Divider sx={{ flex: 1, borderColor: 'rgba(0,0,0,0.07)' }} />
                            <Chip
                                label="Today"
                                size="small"
                                sx={{ 
                                    mx: 2, 
                                    fontSize: '0.75rem', 
                                    px: 1,
                                    bgcolor: 'rgba(0,0,0,0.03)',
                                    borderColor: 'rgba(0,0,0,0.05)'
                                }}
                                variant="outlined"
                            />
                            <Divider sx={{ flex: 1, borderColor: 'rgba(0,0,0,0.07)' }} />
                        </Box>
                        
                        {/* Typing animation for initial greeting */}
                        {typing && (
                            <Box sx={{ display: 'flex', mb: 2 }}>
                                <Avatar sx={{ 
                                    bgcolor: 'primary.main', 
                                    width: 40, 
                                    height: 40,
                                    boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)'
                                }}>
                                    <SmartToyIcon fontSize="small" />
                                </Avatar>
                                <Paper 
                                    elevation={1} 
                                    sx={{ 
                                        ml: 1, 
                                        p: 2, 
                                        maxWidth: {xs: '85%', sm: '70%'}, 
                                        borderRadius: 3, 
                                        borderTopLeftRadius: 0,
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)'
                                    }}
                                >
                                    <Typography>
                                        {typedText}
                                        <Box 
                                            component="span" 
                                            sx={{ 
                                                display: 'inline-block', 
                                                ml: 0.5, 
                                                width: 2, 
                                                height: 16, 
                                                bgcolor: 'primary.main',
                                                animation: 'pulse 1s infinite'
                                            }} 
                                        />
                                    </Typography>
                                </Paper>
                            </Box>
                        )}
                        
                       {/* Message bubbles and tables */}
{messages.map((msg, index) => (
    <Zoom 
        in={true} 
        style={{ 
            transitionDelay: msg.isNew ? '100ms' : '0ms',
            transformOrigin: msg.sender === 'user' ? 'right' : 'left'
        }}
        key={index}
    >
        <Box 
            sx={{ 
                display: 'flex', 
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 2.5,
                maxWidth: '100%',
                ...(msg.isTable && { flexDirection: 'column' }),
                opacity: msg.isNew ? 0.9 : 1,
                transform: msg.isNew ? (msg.sender === 'user' ? 'translateX(10px)' : 'translateX(-10px)') : 'translateX(0)',
                transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
            }}
        >
            {/* For table messages, display the table in a card */}
            {msg.isTable ? (
                <Box sx={{ width: '100%', mt: 1, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <Avatar sx={{ 
                            bgcolor: 'primary.main', 
                            width: 40, 
                            height: 40,
                            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.2)'
                        }}>
                            <SmartToyIcon fontSize="small" />
                        </Avatar>
                        <Paper 
                            elevation={1} 
                            sx={{ 
                                ml: 1, 
                                p: 2, 
                                maxWidth: '80%', 
                                bgcolor: 'background.paper', 
                                color: 'text.primary',
                                borderRadius: 3,
                                borderTopLeftRadius: 0,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.02)'
                            }}
                        >
                            <Typography>Here are the results:</Typography>
                        </Paper>
                    </Box>
                    <Card sx={{ 
                        ml: 5, 
                        overflow: 'hidden',
                        borderRadius: 2,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.03)'
                    }}>
                        <CardHeader 
                            title="Results" 
                            titleTypographyProps={{ 
                                variant: 'subtitle1',
                                sx: { fontSize: '0.95rem' }
                            }}
                            avatar={
                                <Avatar 
                                    sx={{ 
                                        width: 28, 
                                        height: 28, 
                                        bgcolor: 'primary.main'
                                    }}
                                >
                                    <LightbulbIcon sx={{ fontSize: 16 }} />
                                </Avatar>
                            }
                            sx={{ 
                                bgcolor: 'primary.lightest', 
                                color: 'text.primary',
                                py: 1,
                                borderBottom: '1px solid',
                                borderColor: 'rgba(99, 102, 241, 0.1)'
                            }}
                        />
                        <TableContainer sx={{ maxHeight: 400 }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        {Object.keys(msg.tableData[0]).map((key) => (
                                            <TableCell 
                                                key={key}
                                                sx={{
                                                    bgcolor: 'background.paper',
                                                    position: 'sticky',
                                                    top: 0,
                                                    zIndex: 10,
                                                    borderBottom: '2px solid rgba(99, 102, 241, 0.2)'
                                                }}
                                            >
                                                <Typography variant="subtitle2">{key}</Typography>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {msg.tableData.map((item, idx) => (
                                        <TableRow 
                                            key={idx}
                                            sx={{ 
                                                '&:nth-of-type(odd)': { bgcolor: 'rgba(99, 102, 241, 0.02)' },
                                                '&:hover': { bgcolor: 'primary.lightest' },
                                                transition: 'background-color 0.2s ease'
                                            }}
                                        >
                                            {Object.values(item).map((value, valueIndex) => (
                                                <TableCell 
                                                    key={valueIndex}
                                                    sx={{
                                                        borderColor: 'rgba(0,0,0,0.05)'
                                                    }}
                                                >
                                                    <Typography variant="body2">{String(value)}</Typography>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Box>
            ) : (
                // Regular text message bubbles
                <>
                    {msg.sender === 'ai' && (
                        <Avatar sx={{ 
                            bgcolor: 'primary.main', 
                            width: 40, 
                            height: 40,
                            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)'
                        }}>
                            <SmartToyIcon fontSize="small" />
                        </Avatar>
                    )}
                    
                    <Paper 
                        elevation={msg.sender === 'user' ? 0 : 1}
                        sx={{ 
                            mx: 1, 
                            p: 2, 
                            maxWidth: {xs: '80%', sm: '70%'}, 
                            bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper', 
                            color: msg.sender === 'user' ? 'white' : 'text.primary',
                            borderRadius: 3,
                            borderTopLeftRadius: msg.sender === 'ai' ? 0 : 3,
                            borderTopRightRadius: msg.sender === 'user' ? 0 : 3,
                            boxShadow: msg.sender === 'user' 
                                ? '0 4px 16px rgba(99, 102, 241, 0.25), 0 2px 4px rgba(99, 102, 241, 0.2)' 
                                : '0 2px 10px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                            position: 'relative',
                            // Add gradient to user messages
                            backgroundImage: msg.sender === 'user' 
                                ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' 
                                : 'none',
                        }}
                    >
                        {/* Time indicator for messages */}
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                position: 'absolute', 
                                bottom: -18, 
                                [msg.sender === 'user' ? 'right' : 'left']: 8,
                                color: 'text.secondary',
                                fontSize: '0.7rem',
                                opacity: 0.7
                            }}
                        >
                            Just now
                        </Typography>
                        
                        {/* Message content - either typing indicator or text */}
                        {msg.isTyping ? (
                            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', px: 1 }}>
                                <Box className="typing-dot" sx={{ 
                                    width: 8, 
                                    height: 8, 
                                    borderRadius: '50%', 
                                    bgcolor: 'grey.400',
                                    animation: 'pulse 1s infinite',
                                    animationDelay: '0s'
                                }} />
                                <Box className="typing-dot" sx={{ 
                                    width: 8, 
                                    height: 8, 
                                    borderRadius: '50%', 
                                    bgcolor: 'grey.400',
                                    animation: 'pulse 1s infinite',
                                    animationDelay: '0.2s'
                                }} />
                                <Box className="typing-dot" sx={{ 
                                    width: 8, 
                                    height: 8, 
                                    borderRadius: '50%', 
                                    bgcolor: 'grey.400',
                                    animation: 'pulse 1s infinite',
                                    animationDelay: '0.4s'
                                }} />
                            </Box>
                        ) : (
                            <Typography>{msg.text}</Typography>
                        )}
                    </Paper>
                                            
                                            {msg.sender === 'user' && (
                                                <Avatar sx={{ 
                                                    bgcolor: 'grey.100', 
                                                    color: 'grey.700',
                                                    width: 40, 
                                                    height: 40,
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                }}>
                                                    <PersonIcon fontSize="small" />
                                                </Avatar>
                                            )}
                                        </>
                                    )}
                                </Box>
                            </Zoom>
                        ))}
                        <div ref={messagesEndRef} />
                        
                        {/* Only show suggestions if there are no messages yet */}
                        {messages.length <= 1 && (
                            <Fade in={true}>
                                <Box sx={{ mt: 4, mb: 2 }}>
                                    <Typography 
                                        variant="subtitle2" 
                                        sx={{ 
                                            mb: 2, 
                                            textAlign: 'center', 
                                            color: 'grey.500',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        Try asking one of these
                                    </Typography>
                                    <Grid container spacing={2} justifyContent="center">
                                        {suggestions.map((suggestion, index) => (
                                            <Grid item key={index}>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    size="medium"
                                                    onClick={() => handleSuggestionClick(suggestion.text)}
                                                    startIcon={suggestion.icon}
                                                    sx={{ 
                                                        borderColor: 'primary.light',
                                                        color: 'primary.dark',
                                                        backgroundColor: 'rgba(99, 102, 241, 0.03)',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                                            borderColor: 'primary.main',
                                                        }
                                                    }}
                                                >
                                                    {suggestion.text}
                                                </Button>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </Fade>
                        )}
                    </Container>
                </Box>
                
                {/* Input area */}
                <Container maxWidth="lg" sx={{ py: 2, zIndex: 1, position: 'relative' }}>
                    <Paper 
                        elevation={4} 
                        sx={{ 
                            p: 1.5, 
                            px: 2,
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
                            border: '1px solid',
                            borderColor: 'rgba(99, 102, 241, 0.2)',
                            '&:hover': {
                                boxShadow: '0 6px 24px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05)',
                                borderColor: 'rgba(99, 102, 241, 0.3)'
                            }
                        }}
                    >
                        <TextField
                            inputRef={inputRef}
                            fullWidth
                            placeholder="Type your message here..."
                            value={message}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                                sx: { 
                                    fontSize: '1rem',
                                    py: 0.5,
                                }
                            }}
                            sx={{ 
                                mr: 1,
                                '& .MuiInputBase-root': {
                                    borderRadius: 0,
                                    bgcolor: 'transparent'
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSendMessage}
                            disabled={message.trim() === ""}
                            endIcon={<SendIcon />}
                            sx={{ 
                                minWidth: 0, 
                                borderRadius: '9999px',
                                px: isMobile ? 2 : 3,
                                py: 1,
                                transition: 'all 0.2s ease',
                                '&.Mui-disabled': {
                                    bgcolor: 'grey.100',
                                    color: 'grey.400'
                                }
                            }}
                        >
                            {isMobile ? "" : "Send"}
                        </Button>
                    </Paper>
                    
                    {/* Footer credit */}
                    <Typography 
                        variant="caption" 
                        component="div" 
                        sx={{ 
                            textAlign: 'center', 
                            mt: 2, 
                            color: 'text.secondary',
                            opacity: 0.6,
                            fontSize: '0.7rem'
                        }}
                    >
                        © 2025 BitBot • Educational Assistant v1.0.0
                    </Typography>
                </Container>
                
                {/* Global styles for animations */}
                <style jsx global>{`
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                `}</style>
            </Box>
        </ThemeProvider>
    );
};

export default ChatBox;
                                            