import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Heading,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  expirationDate: string;
}

interface IngredientFormData {
  name: string;
  quantity: number;
  unit: string;
  expirationDate: string;
}

export default function Ingredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { register, handleSubmit, reset } = useForm<IngredientFormData>();

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await api.get('/ingredients');
      console.log('Dados recebidos:', response.data);
      setIngredients(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erro ao buscar ingredientes:', error);
      toast({
        title: 'Erro ao carregar ingredientes',
        description: 'Não foi possível carregar a lista de ingredientes.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: IngredientFormData) => {
    try {
      console.log('Dados do formulário:', data);
      
      // Converter a data para o formato ISO
      const formattedData = {
        ...data,
        expirationDate: new Date(data.expirationDate).toISOString().split('T')[0]
      };
      
      console.log('Dados formatados:', formattedData);
      
      const response = await api.post('/ingredients', formattedData);
      console.log('Resposta da API:', response.data);
      
      toast({
        title: 'Ingrediente adicionado',
        description: 'O ingrediente foi adicionado com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
      reset();
      fetchIngredients();
    } catch (error: any) {
      console.error('Erro detalhado ao adicionar ingrediente:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
          data: error.config?.data,
          headers: error.config?.headers
        }
      });
      toast({
        title: 'Erro ao adicionar ingrediente',
        description: error.response?.data?.error || 'Não foi possível adicionar o ingrediente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/ingredients/${id}`);
      toast({
        title: 'Ingrediente removido',
        description: 'O ingrediente foi removido com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      fetchIngredients();
    } catch (error) {
      console.error('Erro ao remover ingrediente:', error);
      toast({
        title: 'Erro ao remover ingrediente',
        description: 'Não foi possível remover o ingrediente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return <Box>Carregando...</Box>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={6}>
        <Heading as="h1" size="lg">Ingredientes</Heading>
        <Button colorScheme="blue" onClick={onOpen}>
          Adicionar Ingrediente
        </Button>
      </Box>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Quantidade</Th>
            <Th>Unidade</Th>
            <Th>Data de Validade</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {ingredients && ingredients.map((ingredient) => (
            <Tr key={ingredient.id}>
              <Td>{ingredient.name}</Td>
              <Td>{ingredient.quantity}</Td>
              <Td>{ingredient.unit}</Td>
              <Td>{new Date(ingredient.expirationDate).toLocaleDateString()}</Td>
              <Td>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDelete(ingredient.id)}
                >
                  Remover
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adicionar Ingrediente</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl mb={4}>
                <FormLabel>Nome</FormLabel>
                <Input {...register('name', { required: true })} />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Quantidade</FormLabel>
                <Input type="number" {...register('quantity', { required: true })} />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Unidade</FormLabel>
                <Select {...register('unit', { required: true })}>
                  <option value="g">Gramas (g)</option>
                  <option value="kg">Quilogramas (kg)</option>
                  <option value="ml">Mililitros (ml)</option>
                  <option value="l">Litros (l)</option>
                  <option value="un">Unidades</option>
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Data de Validade</FormLabel>
                <Input type="date" {...register('expirationDate', { required: true })} />
              </FormControl>
              <Button type="submit" colorScheme="blue" mr={3}>
                Salvar
              </Button>
              <Button onClick={onClose}>Cancelar</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
} 