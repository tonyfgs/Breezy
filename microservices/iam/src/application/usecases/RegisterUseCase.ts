import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { UserDTO, toDTO } from '../dto/UserDTO';
import { hashPassword } from '../../infrastructure/utils/bcrypt.util';
import { isRole } from '../../domain/entities/Role';
import { UserProfileService } from '../../infrastructure/services/UserProfileService';

export class RegisterUseCase {
    private readonly repository: IUserRepository;
    private readonly userProfileService: UserProfileService;

    constructor(userRepository: IUserRepository, userProfileService: UserProfileService) {
        this.repository = userRepository;
        this.userProfileService = userProfileService;
    }

    async execute(dto: CreateUserDTO): Promise<UserDTO | null> {
        if (dto.role && !isRole(dto.role)) {
            throw new Error(`Invalid role: ${dto.role}`);
        }
        const userExists = await this.repository.getUserByUsername(dto.username);
        if (userExists) return null;
        const hash = await hashPassword(dto.password);
        const newUser = new User(dto.username, hash, dto.role ?? 'user');
        const created = await this.repository.createUser(newUser);
        try {
            await this.userProfileService.createProfile(dto.username);
        } catch (err) {
            await this.repository.deleteUser(created.id!);
            throw new Error('Profile creation failed, registration rolled back');
        }
        return toDTO(created);
    }
}
