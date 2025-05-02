import { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Switch,
  Select,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/react';

export default function Settings() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      // Aqui você pode adicionar a lógica para salvar as configurações no backend
      toast({
        title: 'Configurações salvas',
        description: 'Suas configurações foram salvas com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro ao salvar configurações',
        description: 'Não foi possível salvar suas configurações.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Heading mb={6}>Configurações</Heading>
      <VStack spacing={6} align="stretch" maxW="600px">
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="dark-mode" mb="0">
            Modo Escuro
          </FormLabel>
          <Switch
            id="dark-mode"
            isChecked={colorMode === 'dark'}
            onChange={toggleColorMode}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Idioma</FormLabel>
          <Select defaultValue="pt-BR">
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (US)</option>
            <option value="es-ES">Español (España)</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Unidade de Medida</FormLabel>
          <Select defaultValue="metric">
            <option value="metric">Métrico (g, ml)</option>
            <option value="imperial">Imperial (oz, fl oz)</option>
          </Select>
        </FormControl>

        <Button
          colorScheme="blue"
          onClick={handleSaveSettings}
          isLoading={isLoading}
        >
          Salvar Configurações
        </Button>
      </VStack>
    </Box>
  );
} 