import {IProfileRepository} from "../../domain/repositories/IProfileRepository";

export class DeleteProfileUseCase {

    private readonly repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async execute(id: string): Promise<void> {
        return this.repository.deleteProfile(id);
    }
}