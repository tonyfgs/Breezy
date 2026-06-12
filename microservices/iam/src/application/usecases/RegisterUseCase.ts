import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { UserDTO, toDTO } from '../dto/UserDTO';
import { hashPassword } from '../../infrastructure/utils/bcrypt.util';

export class RegisterUseCase {
    private readonly repository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.repository = userRepository;
    }

    async execute(dto: CreateUserDTO): Promise<UserDTO | null> {
        const userExists = await this.repository.getUserByUsername(dto.username);
        if (userExists) return null;
        const hash = await hashPassword(dto.password);
        const newUser = new User(dto.username, hash, dto.role ?? 'user');
        const val = await this.repository.createUser(newUser);
        return toDTO(val);
    }
}
