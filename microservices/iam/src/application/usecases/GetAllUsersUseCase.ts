import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserDTO, toDTO } from '../dto/UserDTO';

export class GetAllUsersUseCase {
    private readonly repository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.repository = userRepository;
    }

    async execute(): Promise<UserDTO[]> {
        const users = await this.repository.getAllUsers();
        return users.map(toDTO);
    }
}
