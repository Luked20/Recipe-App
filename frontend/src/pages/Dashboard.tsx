import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useToast,
  Card,
  CardBody,
  SimpleGrid,
  Progress,
  Icon,
  Flex,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { FiPackage, FiClock, FiBook, FiTrendingUp } from 'react-icons/fi';
import api from '../services/api';

interface DashboardStats {
  totalIngredients: number;
  expiringIngredients: number;
  savedRecipes: number;
  suggestedRecipes: number;
  ingredientsTrend: number[];
  recipesTrend: number[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalIngredients: 0,
    expiringIngredients: 0,
    savedRecipes: 0,
    suggestedRecipes: 0,
    ingredientsTrend: [],
    recipesTrend: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ingredientsResponse, recipesResponse] = await Promise.all([
          api.get('/ingredients'),
          api.get('/recipes'),
        ]);

        const expiringIngredients = ingredientsResponse.data.filter(
          (ingredient: any) => {
            const expirationDate = new Date(ingredient.expirationDate);
            const today = new Date();
            const diffTime = expirationDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7 && diffDays >= 0;
          }
        ).length;

        // Simular dados de tendência (em um sistema real, isso viria do backend)
        const ingredientsTrend = Array.from({ length: 7 }, () => 
          Math.floor(Math.random() * 10) + ingredientsResponse.data.length
        );
        const recipesTrend = Array.from({ length: 7 }, () => 
          Math.floor(Math.random() * 5) + recipesResponse.data.length
        );

        setStats({
          totalIngredients: ingredientsResponse.data.length,
          expiringIngredients,
          savedRecipes: recipesResponse.data.length,
          suggestedRecipes: recipesResponse.data.filter(
            (recipe: any) => recipe.isSuggested
          ).length,
          ingredientsTrend,
          recipesTrend,
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        toast({
          title: 'Erro ao carregar estatísticas',
          description: 'Não foi possível carregar as informações do dashboard.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  const calculatePercentage = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'green.500';
    if (value < 0) return 'red.500';
    return 'gray.500';
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return 'increase';
    if (value < 0) return 'decrease';
    return undefined;
  };

  return (
    <Box p={6}>
      <Heading mb={6} fontSize="2xl" fontWeight="bold">
        Dashboard
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card>
          <CardBody>
            <Flex justify="space-between" align="center">
              <Stat>
                <StatLabel fontSize="sm" color="gray.600">
                  Total de Ingredientes
                </StatLabel>
                <StatNumber fontSize="2xl">{stats.totalIngredients}</StatNumber>
                <StatHelpText>
                  <StatArrow type={getTrendIcon(calculatePercentage(stats.totalIngredients, stats.ingredientsTrend[0]))} />
                  {Math.abs(calculatePercentage(stats.totalIngredients, stats.ingredientsTrend[0])).toFixed(1)}%
                </StatHelpText>
              </Stat>
              <Icon as={FiPackage} w={8} h={8} color="blue.500" />
            </Flex>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Flex justify="space-between" align="center">
              <Stat>
                <StatLabel fontSize="sm" color="gray.600">
                  Próximos ao Vencimento
                </StatLabel>
                <StatNumber fontSize="2xl">{stats.expiringIngredients}</StatNumber>
                <StatHelpText color={getTrendColor(stats.expiringIngredients)}>
                  {stats.expiringIngredients > 0 ? 'Atenção!' : 'Tudo em dia'}
                </StatHelpText>
              </Stat>
              <Icon as={FiClock} w={8} h={8} color="orange.500" />
            </Flex>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Flex justify="space-between" align="center">
              <Stat>
                <StatLabel fontSize="sm" color="gray.600">
                  Receitas Salvas
                </StatLabel>
                <StatNumber fontSize="2xl">{stats.savedRecipes}</StatNumber>
                <StatHelpText>
                  <StatArrow type={getTrendIcon(calculatePercentage(stats.savedRecipes, stats.recipesTrend[0]))} />
                  {Math.abs(calculatePercentage(stats.savedRecipes, stats.recipesTrend[0])).toFixed(1)}%
                </StatHelpText>
              </Stat>
              <Icon as={FiBook} w={8} h={8} color="purple.500" />
            </Flex>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Flex justify="space-between" align="center">
              <Stat>
                <StatLabel fontSize="sm" color="gray.600">
                  Receitas Sugeridas
                </StatLabel>
                <StatNumber fontSize="2xl">{stats.suggestedRecipes}</StatNumber>
                <StatHelpText>
                  <StatArrow type={getTrendIcon(calculatePercentage(stats.suggestedRecipes, stats.recipesTrend[0]))} />
                  {Math.abs(calculatePercentage(stats.suggestedRecipes, stats.recipesTrend[0])).toFixed(1)}%
                </StatHelpText>
              </Stat>
              <Icon as={FiTrendingUp} w={8} h={8} color="green.500" />
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Tendência de Ingredientes</Heading>
            <Box h="200px">
              {stats.ingredientsTrend.map((value, index) => (
                <Box key={index} mb={2}>
                  <Text fontSize="sm" mb={1}>
                    Semana {index + 1}
                  </Text>
                  <Progress
                    value={value}
                    max={Math.max(...stats.ingredientsTrend)}
                    colorScheme="blue"
                    size="sm"
                  />
                </Box>
              ))}
            </Box>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Tendência de Receitas</Heading>
            <Box h="200px">
              {stats.recipesTrend.map((value, index) => (
                <Box key={index} mb={2}>
                  <Text fontSize="sm" mb={1}>
                    Semana {index + 1}
                  </Text>
                  <Progress
                    value={value}
                    max={Math.max(...stats.recipesTrend)}
                    colorScheme="purple"
                    size="sm"
                  />
                </Box>
              ))}
            </Box>
          </CardBody>
        </Card>
      </Grid>
    </Box>
  );
} 