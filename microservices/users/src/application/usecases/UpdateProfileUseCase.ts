import {IProfileRepository} from "../../domain/repositories/IProfileRepository";

export class UpdateProfileUseCase {
    private readonly repository: IProfileRepository;
    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async execute(id: string, profile: any): Promise<any> {
        return this.repository.patchProfile(id, profile);
    }
}