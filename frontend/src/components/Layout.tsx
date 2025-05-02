import { Box, Flex, VStack, useColorModeValue } from '@chakra-ui/react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Flex h="100vh" bg={bgColor}>
      <Sidebar onLogout={handleLogout} />
      <VStack flex={1} spacing={0} align="stretch">
        <Header user={user} />
        <Box flex={1} p={6} overflowY="auto">
          <Outlet />
        </Box>
      </VStack>
    </Flex>
  );
} 