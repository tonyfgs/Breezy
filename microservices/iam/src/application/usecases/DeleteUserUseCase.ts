import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserProfileService } from '../../infrastructure/services/UserProfileService';

export class DeleteUserUseCase {
    private readonly repository: IUserRepository;
    private readonly userProfileService: UserProfileService;

    constructor(userRepository: IUserRepository, userProfileService: UserProfileService) {
        this.repository = userRepository;
        this.userProfileService = userProfileService;
    }

    async execute(username: string): Promise<void> {
        const user = await this.repository.getUserByUsername(username);
        if (!user) throw new Error(`User not found: ${username}`);
        await this.userProfileService.deleteProfile(username);
        await this.repository.deleteUser(user.id!);
    }
}
