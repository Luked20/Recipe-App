import { Box, VStack, IconButton, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { FiHome, FiPackage, FiBookOpen, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/' },
    { icon: FiPackage, label: 'Ingredientes', path: '/ingredients' },
    { icon: FiBookOpen, label: 'Receitas', path: '/recipes' },
    { icon: FiUser, label: 'Perfil', path: '/profile' },
    { icon: FiSettings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <Box
      as="nav"
      w="64px"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      py={4}
    >
      <VStack spacing={4}>
        {menuItems.map((item) => (
          <Tooltip key={item.path} label={item.label} placement="right">
            <IconButton
              aria-label={item.label}
              icon={<item.icon />}
              variant={location.pathname === item.path ? 'solid' : 'ghost'}
              colorScheme={location.pathname === item.path ? 'blue' : 'gray'}
              onClick={() => navigate(item.path)}
            />
          </Tooltip>
        ))}
        <Box flex={1} />
        <Tooltip label="Sair" placement="right">
          <IconButton
            aria-label="Sair"
            icon={<FiLogOut />}
            variant="ghost"
            colorScheme="red"
            onClick={onLogout}
          />
        </Tooltip>
      </VStack>
    </Box>
  );
} 