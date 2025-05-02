import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

export class AuthController {
  private get userRepository() {
    return getRepository(User);
  }

  register = async (req: Request, res: Response) => {
    try {
      console.log('Iniciando processo de registro no backend...');
      console.log('Dados recebidos:', { 
        name: req.body.name, 
        email: req.body.email, 
        password: '***' 
      });

      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        console.log('Dados incompletos:', { name, email, password: !!password });
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      console.log('Verificando se email já existe...');
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        console.log('Email já cadastrado:', email);
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      console.log('Criando novo usuário...');
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
      });

      console.log('Salvando usuário no banco de dados...');
      await this.userRepository.save(user);
      console.log('Usuário salvo com sucesso:', { id: user.id, email: user.email });

      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET não está definido no .env');
        return res.status(500).json({ error: 'Erro de configuração do servidor' });
      }

      console.log('Gerando token JWT...');
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      console.log('Token gerado com sucesso');

      console.log('Registro concluído com sucesso!');
      return res.status(201).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('Erro detalhado no registro:', {
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined,
        error: error
      });
      return res.status(500).json({ 
        error: 'Erro ao criar usuário',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
      );

      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }
      
      const userId = req.user.id;
      const { name, dietaryPreferences, budget } = req.body;

      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      if (name) user.name = name;
      if (dietaryPreferences) user.dietaryPreferences = dietaryPreferences;
      if (budget) user.budget = budget;

      await userRepository.save(user);

      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        dietaryPreferences: user.dietaryPreferences,
        budget: user.budget
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 