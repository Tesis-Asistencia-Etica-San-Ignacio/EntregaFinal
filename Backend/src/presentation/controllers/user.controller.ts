import { Request, Response, NextFunction } from "express";
import {
  CreateEvaluatorUseCase,
  CreateInvestigatorUseCase,
  GetAllUsersUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  CreateUserDto,
  UpdatePasswordUseCase,
} from "../../application";
import { User } from "../../domain";

export class UserController {
  constructor(
    private readonly createEvaluatorUseCase: CreateEvaluatorUseCase,
    private readonly createInvestigatorUseCase: CreateInvestigatorUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly updatePasswordUseCase: UpdatePasswordUseCase
  ) {}

  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await this.getAllUsersUseCase.execute();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  public getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.getUserByIdUseCase.execute(id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).json(user);
      }
    } catch (error) {
      next(error);
    }
  };

  public createEvaluator = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const newUser = await this.createEvaluatorUseCase.execute(
        req.body as CreateUserDto
      );
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  };

  public createInvestigator = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const newUser = await this.createInvestigatorUseCase.execute(
        req.body as CreateUserDto
      );
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  };

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      // Verificar que el usuario autenticado es el mismo que se quiere actualizar
      const updatedUser = await this.updateUserUseCase.execute(
        userId,
        { ...req.body } as User
      );
      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).json(updatedUser);
      }
    } catch (error) {
      next(error);
    }
  };

  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      // Verificar que el usuario autenticado es el mismo que se quiere eliminar
      const wasDeleted = await this.deleteUserUseCase.execute(userId);
      if (!wasDeleted) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).json({ message: "User deleted successfully" });
      }
    } catch (error) {
      next(error);
    }
  };

  public updatePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { password, newPassword } = req.body;

      if (!password || !newPassword) {
        res.status(400).json({ message: 'Campos incompletos' });
        return;
      }

      console.log('userId', userId);
      console.log('password', password);
      console.log('newPassword', newPassword);

      await this.updatePasswordUseCase.execute({
        userId,
        password,
        newPassword,
      });

      res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}