import { ISanctionRepository } from '../../domain/repositories/ISanctionRepository';

export class GetActiveUsersUseCase {
    constructor(private readonly sanctionRepository: ISanctionRepository) {}

    async execute(userIds: string[]): Promise<string[]> {
        const bannedIds = await this.sanctionRepository.getActivelySanctionedUserIds(userIds);
        const bannedSet = new Set(bannedIds);
        return userIds.filter(id => !bannedSet.has(id));
    }
}
