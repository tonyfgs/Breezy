import {IProfileRepository} from "../../domain/repositories/IProfileRepository";

export class GetProfileUseCase {
    private readonly repository: IProfileRepository;
    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async execute(id: string): Promise<any> {
        return this.repository.getProfile(id);
    }
}