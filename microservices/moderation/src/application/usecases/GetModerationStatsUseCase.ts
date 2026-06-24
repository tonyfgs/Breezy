import { IReportRepository } from '../../domain/repositories/IReportRepository';
import { ISanctionRepository } from '../../domain/repositories/ISanctionRepository';
import { HttpUsersGateway } from '../../infrastructure/http/HttpUsersGateway';
import { HttpPostsGateway } from '../../infrastructure/http/HttpPostsGateway';

export interface ModerationStatsDTO {
    nb_active_members: number;
    nb_posts_per_day: number;
    nb_pending_reports: number;
    pct_healthy_content: number;
}

export class GetModerationStatsUseCase {
    constructor(
        private readonly reportRepository: IReportRepository,
        private readonly sanctionRepository: ISanctionRepository,
        private readonly usersGateway: HttpUsersGateway,
        private readonly postsGateway: HttpPostsGateway,
    ) {}

    async execute(): Promise<ModerationStatsDTO> {
        const [
            pendingReports,
            bannedUsers,
            bannedPosts,
            totalUsers,
            postsStats,
        ] = await Promise.all([
            this.reportRepository.countPendingReports(),
            this.sanctionRepository.countActiveSanctions('user'),
            this.sanctionRepository.countActiveSanctions('post'),
            this.usersGateway.countUsers(),
            this.postsGateway.getStats(),
        ]);

        const activeMembers = Math.max(0, totalUsers - bannedUsers);
        const pctHealthy = postsStats.totalPosts > 0
            ? Math.round((1 - bannedPosts / postsStats.totalPosts) * 100)
            : 100;

        return {
            nb_active_members: activeMembers,
            nb_posts_per_day: postsStats.postsToday,
            nb_pending_reports: pendingReports,
            pct_healthy_content: pctHealthy,
        };
    }
}
