import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Link,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      console.log('Tentando registrar usuário com dados:', { ...data, password: '***' });
      await registerUser(data.name, data.email, data.password);
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Você será redirecionado para a página inicial.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (error: any) {
      console.error('Erro no registro:', error);
      toast({
        title: 'Erro ao criar conta',
        description: error.message || 'Ocorreu um erro ao criar sua conta. Tente novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box
        p={8}
        maxWidth="400px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg="white"
      >
        <VStack spacing={4} align="stretch">
          <Heading textAlign="center">Criar Conta</Heading>
          <Text textAlign="center" color="gray.600">
            Preencha os dados para criar sua conta
          </Text>

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

              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido',
                    },
                  })}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel>Senha</FormLabel>
                <Input
                  type="password"
                  {...register('password', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'A senha deve ter pelo menos 6 caracteres',
                    },
                  })}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel>Confirmar Senha</FormLabel>
                <Input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Confirmação de senha é obrigatória',
                    validate: value =>
                      value === password || 'As senhas não coincidem',
                  })}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isLoading}
              >
                Criar Conta
              </Button>
            </VStack>
          </Box>

          <Text textAlign="center">
            Já tem uma conta?{' '}
            <Link as={RouterLink} to="/login" color="blue.500">
              Faça login
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
} 