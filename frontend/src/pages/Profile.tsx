import { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';

interface ProfileFormData {
  name: string;
  dietaryPreferences: string;
  budget: number;
}

const dietaryOptions = [
  { value: 'vegetarian', label: 'Vegetariano' },
  { value: 'vegan', label: 'Vegano' },
  { value: 'pescatarian', label: 'Pescetariano' },
  { value: 'gluten-free', label: 'Sem glúten' },
  { value: 'lactose-free', label: 'Sem lactose' },
  { value: 'balanced', label: 'Equilibrado' },
];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      dietaryPreferences: user?.dietaryPreferences || '',
      budget: user?.budget || 0,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      await updateProfile(data);
      toast({
        title: 'Perfil atualizado',
        description: 'Seu perfil foi atualizado com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro ao atualizar perfil',
        description: 'Não foi possível atualizar seu perfil.',
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
      <Heading mb={6}>Perfil</Heading>
      <VStack spacing={6} align="stretch" maxW="600px">
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Nome</FormLabel>
              <Input
                {...register('name', {
                  required: 'Nome é obrigatório',
                  minLength: {
                    value: 3,
                    message: 'O nome deve ter pelo menos 3 caracteres',
                  },
                })}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.dietaryPreferences}>
              <FormLabel>Preferências Alimentares</FormLabel>
              <Select
                placeholder="Selecione uma opção"
                {...register('dietaryPreferences', {
                  required: 'Preferências alimentares são obrigatórias',
                })}
              >
                {dietaryOptions.map((option) => (
                  <Box as="option" key={option.value} value={option.value}>
                    {option.label}
                  </Box>
                ))}
              </Select>
            </FormControl>

            <FormControl isInvalid={!!errors.budget}>
              <FormLabel>Orçamento Semanal (R$)</FormLabel>
              <Input
                type="number"
                {...register('budget', {
                  required: 'Orçamento é obrigatório',
                  min: {
                    value: 0,
                    message: 'O orçamento deve ser maior que zero',
                  },
                })}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isLoading}
            >
              Salvar Alterações
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
} 