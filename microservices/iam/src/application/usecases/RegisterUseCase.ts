import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { UserDTO, toDTO } from '../dto/UserDTO';
import { hashPassword } from '../../infrastructure/utils/bcrypt.util';
import { isRole } from '../../domain/entities/Role';

export class RegisterUseCase {
    private readonly repository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.repository = userRepository;
    }

    async execute(dto: CreateUserDTO): Promise<UserDTO | null> {
        if (dto.role && !isRole(dto.role)) {
            throw new Error(`Invalid role: ${dto.role}`);
        }
        const userExists = await this.repository.getUserByUsername(dto.username);
        if (userExists) return null;
        const hash = await hashPassword(dto.password);
        const newUser = new User(dto.username, hash, dto.role ?? 'user');
        const val = await this.repository.createUser(newUser);
        return toDTO(val);
    }
}
