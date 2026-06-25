import { IProfileRepository } from '../../domain/repositories/IProfileRepository';

export class DeleteProfileByUsernameUseCase {
    private readonly repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async execute(username: string): Promise<void> {
        return this.repository.deleteProfileByUsername(username);
    }
}
