import { Box, Flex, Text, Avatar, Menu, MenuButton, MenuList, MenuItem, useColorModeValue } from '@chakra-ui/react';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  user: {
    name: string;
    email: string;
  } | null;
}

export default function Header({ user }: HeaderProps) {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      as="header"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={6}
      py={4}
    >
      <Flex justify="flex-end" align="center">
        <Menu>
          <MenuButton>
            <Flex align="center" cursor="pointer">
              <Avatar size="sm" name={user?.name} />
              <Text ml={3} fontWeight="medium">
                {user?.name}
              </Text>
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem icon={<FiUser />} onClick={() => navigate('/profile')}>
              Perfil
            </MenuItem>
            <MenuItem icon={<FiSettings />} onClick={() => navigate('/settings')}>
              Configurações
            </MenuItem>
            <MenuItem icon={<FiLogOut />} onClick={() => navigate('/logout')}>
              Sair
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
} 