import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { LoginDTO } from '../dto/LoginDTO';
import { TokenDTO } from '../dto/TokenDTO';
import { comparePassword } from '../../infrastructure/utils/bcrypt.util';
import { generateToken } from '../../infrastructure/utils/jwt.util';

export class LoginUseCase {
    private readonly repository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.repository = userRepository;
    }

    async execute(dto: LoginDTO): Promise<TokenDTO | null> {
        const user = await this.repository.getUserByUsername(dto.username);
        if (!user) return null;
        const valid = await comparePassword(dto.password, user.passwordHash);
        if (!valid) return null;
        const token = generateToken({ id: user.id, username: user.username, role: user.role });
        return { token };
    }
}
