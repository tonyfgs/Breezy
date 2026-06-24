import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserProfileService } from '../../infrastructure/services/UserProfileService';
import { LoginDTO } from '../dto/LoginDTO';
import { TokenDTO } from '../dto/TokenDTO';
import { comparePassword } from '../../infrastructure/utils/bcrypt.util';
import { generateToken } from '../../infrastructure/utils/jwt.util';

export class LoginUseCase {
    constructor(
        private readonly repository: IUserRepository,
        private readonly userProfileService: UserProfileService,
    ) {}

    async execute(dto: LoginDTO): Promise<TokenDTO | null> {
        const user = await this.repository.getUserByUsername(dto.username);
        if (!user) return null;
        const valid = await comparePassword(dto.password, user.passwordHash);
        if (!valid) return null;
        const profileId = await this.userProfileService.getProfileId(user.username);
        const token = generateToken({ iamId: user.id, profileId, username: user.username, role: user.role });
        return { token };
    }
}
