import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  useToast,
  Input,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { spoonacularApi } from '../services/api';
import api from '../services/api';

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  expirationDate: string;
}

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  isSuggested: boolean;
  missedIngredients: string[];
  usedIngredients: string[];
}

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchIngredients();
    fetchRandomRecipes();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await api.get('/ingredients');
      setIngredients(response.data);
    } catch (error) {
      console.error('Erro ao buscar ingredientes:', error);
      toast({
        title: 'Erro ao carregar ingredientes',
        description: 'Não foi possível carregar os ingredientes.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchRandomRecipes = async () => {
    try {
      console.log('Iniciando busca de receitas aleatórias...');
      
      const response = await spoonacularApi.get('/random', {
        params: {
          number: 10,
          tags: 'vegetarian,dessert'
        }
      });
      
      console.log('Resposta da API Spoonacular:', response.data);
      setRecipes(response.data.recipes);
    } catch (error: any) {
      console.error('Erro detalhado ao buscar receitas:', error);
      toast({
        title: 'Erro ao carregar receitas',
        description: 'Não foi possível carregar as receitas.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const suggestRecipes = async () => {
    try {
      setIsLoading(true);
      
      // Criar uma string com os nomes dos ingredientes
      const ingredientsList = ingredients.map(ing => ing.name).join(',');
      
      // Buscar receitas que usam esses ingredientes
      const response = await spoonacularApi.get('/findByIngredients', {
        params: {
          ingredients: ingredientsList,
          number: 10,
          ranking: 1, // Prioriza receitas que usam mais ingredientes disponíveis
          ignorePantry: true
        }
      });

      // Processar as receitas para mostrar ingredientes usados e faltantes
      const processedRecipes = response.data.map((recipe: any) => ({
        ...recipe,
        isSuggested: true,
        usedIngredients: recipe.usedIngredients.map((ing: any) => ing.name),
        missedIngredients: recipe.missedIngredients.map((ing: any) => ing.name)
      }));

      setRecipes(processedRecipes);
    } catch (error: any) {
      console.error('Erro ao sugerir receitas:', error);
      toast({
        title: 'Erro ao sugerir receitas',
        description: 'Não foi possível sugerir receitas com seus ingredientes.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const searchRecipes = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await spoonacularApi.get('/complexSearch', {
        params: {
          query: searchQuery,
          number: 10
        }
      });
      setRecipes(response.data.results);
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
      toast({
        title: 'Erro ao buscar receitas',
        description: 'Não foi possível buscar as receitas.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRecipe = async (recipe: Recipe) => {
    try {
      await api.post('/recipes', recipe);
      toast({
        title: 'Receita salva',
        description: 'A receita foi salva com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
      toast({
        title: 'Erro ao salvar receita',
        description: 'Não foi possível salvar a receita.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteRecipe = async (id: number) => {
    try {
      await api.delete(`/recipes/${id}`);
      toast({
        title: 'Receita removida',
        description: 'A receita foi removida com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      fetchRandomRecipes();
    } catch (error) {
      toast({
        title: 'Erro ao remover receita',
        description: 'Não foi possível remover a receita.',
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
      <Box mb={6}>
        <Heading mb={4}>Receitas</Heading>
        <Tabs>
          <TabList>
            <Tab>Receitas Aleatórias</Tab>
            <Tab>Receitas com Meus Ingredientes</Tab>
            <Tab>Buscar Receitas</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Button onClick={fetchRandomRecipes} mb={4}>
                Carregar Receitas Aleatórias
              </Button>
            </TabPanel>

            <TabPanel>
              <Button onClick={suggestRecipes} mb={4}>
                Sugerir Receitas com Meus Ingredientes
              </Button>
              <Text mb={4}>
                Ingredientes disponíveis: {ingredients.map(ing => ing.name).join(', ')}
              </Text>
            </TabPanel>

            <TabPanel>
              <HStack mb={4}>
                <Input
                  placeholder="Buscar receitas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchRecipes()}
                />
                <Button colorScheme="blue" onClick={searchRecipes}>
                  Buscar
                </Button>
              </HStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
        {recipes && recipes.map((recipe) => (
          <GridItem key={recipe.id}>
            <Card>
              <CardHeader>
                <Heading size="md">
                  <Box as="strong" fontWeight="bold">
                    {recipe.title}
                  </Box>
                </Heading>
                {recipe.isSuggested && (
                  <Badge colorScheme="green" mt={2}>
                    Sugerida
                  </Badge>
                )}
              </CardHeader>
              <CardBody>
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  borderRadius="lg"
                  mb={4}
                />
                <Text>
                  <strong>Tempo de preparo:</strong> {recipe.readyInMinutes} minutos
                </Text>
                <Text>
                  <strong>Porções:</strong> {recipe.servings}
                </Text>
                {recipe.usedIngredients && recipe.usedIngredients.length > 0 && (
                  <Box mt={4}>
                    <Text fontWeight="bold">Ingredientes que você tem:</Text>
                    <Text>{recipe.usedIngredients.join(', ')}</Text>
                  </Box>
                )}
                {recipe.missedIngredients && recipe.missedIngredients.length > 0 && (
                  <Box mt={4}>
                    <Text fontWeight="bold">Ingredientes que faltam:</Text>
                    <Text>{recipe.missedIngredients.join(', ')}</Text>
                  </Box>
                )}
              </CardBody>
              <CardFooter>
                <Button
                  colorScheme="blue"
                  mr={2}
                  onClick={() => window.open(recipe.sourceUrl, '_blank')}
                >
                  Ver Receita
                </Button>
                {recipe.isSuggested ? (
                  <Button
                    colorScheme="green"
                    onClick={() => handleSaveRecipe(recipe)}
                  >
                    Salvar
                  </Button>
                ) : (
                  <Button
                    colorScheme="red"
                    onClick={() => handleDeleteRecipe(recipe.id)}
                  >
                    Remover
                  </Button>
                )}
              </CardFooter>
            </Card>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
} 